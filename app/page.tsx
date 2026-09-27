"use client";

import { TaskInput } from "@/components/TaskInput";
import { useAgentStore } from "@/store/useAgentStore";

export default function Home() {
  const { plan, runState } = useAgentStore();

  return (
    <main className="flex flex-col items-center gap-6 p-12">
      <h1 className="text-2xl font-semibold">Waypoint</h1>

      {runState === "idle" || runState === "planning" ? (
        <TaskInput />
      ) : null}

      {runState === "planning" && <p>Generating your plan...</p>}
      {runState === "error" && <p className="text-red-500">Something went wrong. Try again.</p>}

      {plan && (
        <ul className="w-full max-w-xl">
          {plan.steps.map((step) => (
            <li key={step.id} className="border rounded-md p-3 mb-2">
              <strong>{step.title}</strong>
              <p className="text-sm text-gray-500">{step.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}