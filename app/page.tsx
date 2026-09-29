"use client";

import { useAgentStore } from "@/store/useAgentStore";
import { runPlan, pauseCurrentStep, resumeRun } from "@/lib/runner";
import { Plan } from "@/types/agent";

const dummyPlan: Plan = {
  id: "test-plan-1",
  task: "research and compare 3 project management tools on pricing and features",
  createdAt: new Date().toISOString(),
  steps: [
    {
      id: "step-1",
      title: "Research Notion pricing",
      description: "Find Notion's current pricing tiers and what each includes",
      status: "pending",
      editedByUser: false,
    },
    {
      id: "step-2",
      title: "Research Linear pricing",
      description: "Find Linear's current pricing tiers and what each includes",
      status: "pending",
      editedByUser: false,
    },
    {
      id: "step-3",
      title: "Research Asana pricing",
      description: "Find Asana's current pricing tiers and what each includes",
      status: "pending",
      editedByUser: false,
    },
  ],
};

export default function Home() {
  const { plan, setPlan, runState, currentStepIndex } = useAgentStore();

  return (
    <main style={{ padding: 24, fontFamily: "monospace" }}>
      <h1>Point 4 — Execution Engine Test</h1>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setPlan(dummyPlan)} disabled={!!plan}>
          Load dummy plan
        </button>{" "}
        <button onClick={() => runPlan()} disabled={!plan || runState === "executing"}>
          Run
        </button>{" "}
        <button onClick={() => pauseCurrentStep()} disabled={runState !== "executing"}>
          Pause
        </button>{" "}
        <button onClick={() => resumeRun()} disabled={runState !== "paused"}>
          Resume
        </button>
      </div>

      <p>
        runState: {runState} | currentStepIndex: {currentStepIndex}
      </p>

      {plan?.steps.map((step, i) => (
        <div
          key={step.id}
          style={{
            border: "1px solid #ccc",
            padding: 8,
            marginBottom: 8,
            background: i === currentStepIndex ? "#f5f5f5" : "white",
          }}
        >
          <strong>{step.title}</strong> — <em>{step.status}</em>
          <p style={{ whiteSpace: "pre-wrap" }}>{step.output}</p>
        </div>
      ))}
    </main>
  );
}