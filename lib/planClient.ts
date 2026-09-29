import type { Plan, Step } from "@/types/agent";
import { useAgentStore } from "@/store/useAgentStore";

type PlanResponse = {
  plan?: { steps: { title: string; description: string }[] };
  error?: string;
};

// Kept outside the store: it's only used to refill the input after an error.
let lastTask = "";
export const getLastTask = () => lastTask;
export const clearLastTask = () => {
  lastTask = "";
};

export async function requestPlan(task: string) {
  const { setPlan, setRunState, setError } = useAgentStore.getState();
  lastTask = task;
  setError(null);
  setRunState("planning");

  try {
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task }),
    });
    const data: PlanResponse = await res.json().catch(() => ({}));

    if (!res.ok || !data.plan) {
      throw new Error(data.error ?? `The planner returned an error (HTTP ${res.status}).`);
    }
    if (data.plan.steps.length === 0) {
      throw new Error("The planner returned an empty plan. Try describing the task in more detail.");
    }

    const steps: Step[] = data.plan.steps.map((s) => ({
      id: crypto.randomUUID(),
      title: s.title,
      description: s.description,
      status: "pending",
      output: "",
      editedByUser: false,
    }));

    const plan: Plan = {
      id: crypto.randomUUID(),
      task,
      createdAt: new Date().toISOString(),
      steps,
    };

    setPlan(plan);
    setRunState("reviewing");
  } catch (err) {
    setError(err instanceof Error ? err.message : "The planner couldn't be reached.");
    setRunState("error");
  }
}