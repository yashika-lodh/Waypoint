"use client";

import { TaskInput } from "@/components/TaskInput";
import { PlanEditor } from "@/components/PlanEditor";
import { useAgentStore } from "@/store/useAgentStore";

export default function Home() {
  const { plan, runState } = useAgentStore();

  return (
    <main className="flex flex-col items-center gap-6 p-12">
      <h1 className="text-2xl font-semibold">Waypoint</h1>

      {runState === "idle" || runState === "planning" ? <TaskInput /> : null}

      {runState === "planning" && <p>Generating your plan...</p>}
      {runState === "error" && (
        <p className="text-red-500">Something went wrong. Try again.</p>
      )}

      {runState === "reviewing" && plan && <PlanEditor />}

      {runState === "executing" && <p>Executing plan... (Point 4 builds this)</p>}
    </main>
  );
}