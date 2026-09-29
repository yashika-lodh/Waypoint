import { useAgentStore } from "@/store/useAgentStore";

type RerunResult = "done" | "paused" | "error";

// Re-runs are user-initiated one-offs, separate from the runner's loop,
// so they get their own controller instead of sharing stepControllers.
let active: AbortController | null = null;

export function cancelRerun() {
  active?.abort();
}

function markDownstreamStale(fromIndex: number) {
  const { plan, updateStep } = useAgentStore.getState();
  plan?.steps.slice(fromIndex + 1).forEach((s) => {
    if (s.output) updateStep(s.id, { stale: true });
  });
}

function syncRunState() {
  const { plan, runState, setRunState } = useAgentStore.getState();
  if (!plan || runState === "executing") return;
  if (plan.steps.length > 0 && plan.steps.every((s) => s.status === "done")) {
    setRunState("done");
  }
}

export async function rerunStep(stepId: string): Promise<RerunResult> {
  const { plan, updateStep, setError } = useAgentStore.getState();
  if (!plan) return "error";

  const index = plan.steps.findIndex((s) => s.id === stepId);
  if (index === -1) return "error";
  const step = plan.steps[index];

  active?.abort();
  const controller = new AbortController();
  active = controller;

  const priorOutputs = plan.steps
    .slice(0, index)
    .filter((s) => s.status === "done" && s.output)
    .map((s) => ({ title: s.title, output: s.output as string }));

  updateStep(stepId, { status: "running", output: "", stale: false });
  setError(null);

  let output = "";
  try {
    const res = await fetch("/api/execute-step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        step: {
          id: step.id,
          title: step.title,
          description: step.description,
          status: "pending",
          editedByUser: step.editedByUser,
        },
        planTask: plan.task,
        priorOutputs,
      }),
      signal: controller.signal,
    });

    if (!res.ok || !res.body) {
      throw new Error(`The step request failed (HTTP ${res.status}).`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      output += decoder.decode(value, { stream: true });
      useAgentStore.getState().updateStep(stepId, { output });
    }
    output += decoder.decode();

    useAgentStore.getState().updateStep(stepId, { output, status: "done" });
    markDownstreamStale(index);
    return "done";
  } catch (err) {
    const store = useAgentStore.getState();
    if (controller.signal.aborted) {
      store.updateStep(stepId, { status: "paused", output });
      return "paused";
    }
    store.updateStep(stepId, { status: "error", output });
    store.setError(err instanceof Error ? err.message : "The step failed.");
    store.setRunState("error");
    return "error";
  } finally {
    if (active === controller) active = null;
    syncRunState();
  }
}

// Re-runs this step, then every step after it, in order. Stops on pause or error.
export async function rerunFrom(stepId: string) {
  const { plan, runState, setRunState, setError } = useAgentStore.getState();
  if (!plan) return;

  const start = plan.steps.findIndex((s) => s.id === stepId);
  if (start === -1) return;

  if (runState === "error") setRunState("paused");
  setError(null);

  const ids = plan.steps.slice(start).map((s) => s.id);
  for (const id of ids) {
    const result = await rerunStep(id);
    if (result !== "done") break;
  }
}