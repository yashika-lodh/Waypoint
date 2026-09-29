import { useAgentStore } from "@/store/useAgentStore";
import {
  createStepController,
  getStepController,
  clearStepController,
} from "@/lib/stepControllers";
import { Step } from "@/types/agent";

async function runStep(
  step: Step,
  planTask: string,
  priorOutputs: { title: string; output: string }[]
) {
  const { updateStep, appendStepOutput } = useAgentStore.getState();
  const controller = createStepController(step.id);

  updateStep(step.id, { status: "running" });

  try {
    const res = await fetch("/api/execute-step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step, planTask, priorOutputs }),
      signal: controller.signal,
    });

    if (!res.ok || !res.body) {
      updateStep(step.id, { status: "error" });
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      appendStepOutput(step.id, decoder.decode(value, { stream: true }));
    }

    updateStep(step.id, { status: "done" });
  } catch (err) {
    if (controller.signal.aborted) {
      // Pause fired mid-stream — whatever streamed in already sits in
      // step.output via appendStepOutput. Just mark status.
      updateStep(step.id, { status: "paused" });
    } else {
      console.error("Step execution failed:", err);
      updateStep(step.id, { status: "error" });
    }
  } finally {
    clearStepController(step.id);
  }
}

export async function runPlan() {
  const { setRunState, setCurrentStepIndex } = useAgentStore.getState();
  const plan = useAgentStore.getState().plan;
  if (!plan) return;

  setRunState("executing");

  for (let i = 0; i < plan.steps.length; i++) {
    const currentPlan = useAgentStore.getState().plan;
    if (!currentPlan) break;

    const step = currentPlan.steps[i];
    if (step.status === "done") continue;

    setCurrentStepIndex(i);

    const priorOutputs = currentPlan.steps
      .slice(0, i)
      .filter((s) => s.status === "done")
      .map((s) => ({ title: s.title, output: s.output ?? "" }));

    await runStep(step, currentPlan.task, priorOutputs);

    if (useAgentStore.getState().runState === "paused") return;
  }

  setRunState("done");
}

export function pauseCurrentStep() {
  const { plan, currentStepIndex, setRunState } = useAgentStore.getState();
  const step = plan?.steps[currentStepIndex];
  if (!step) return;

  getStepController(step.id)?.abort();
  setRunState("paused");
}

export function resumeRun() {
  const { plan, currentStepIndex, updateStep, setRunState } =
    useAgentStore.getState();
  const step = plan?.steps[currentStepIndex];

  // Groq can't resume a partial completion — restarting the paused step
  // from scratch is the honest option here, not stitching onto a cut-off
  // generation. Flagging this in case you want different behavior.
  if (step && step.status === "paused") {
    updateStep(step.id, { status: "pending", output: "" });
  }

  setRunState("executing");
  runPlan();
}