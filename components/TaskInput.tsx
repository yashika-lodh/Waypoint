"use client";

import { useState } from "react";
import { useAgentStore } from "@/store/useAgentStore";

export function TaskInput() {
  const [task, setTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setPlan, setRunState } = useAgentStore();

  async function handleSubmit() {
    if (!task.trim()) return;

    setIsSubmitting(true);
    setRunState("planning");

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setRunState("error");
        console.error(data.error ?? "Unknown error generating plan");
        return;
      }

      // data.plan matches your PlanResponseSchema shape: { steps: [...] }
      setPlan({
        id: crypto.randomUUID(),
        task,
        createdAt: new Date().toISOString(),
        steps: data.plan.steps.map((s: { title: string; description: string }) => ({
          id: crypto.randomUUID(),
          title: s.title,
          description: s.description,
          status: "pending" as const,
          editedByUser: false,
        })),
      });

      setRunState("reviewing");
    } catch (err) {
      setRunState("error");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-xl">
      <textarea
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="e.g. Compare 5 project management tools against pricing, features, and integrations"
        rows={3}
        className="border rounded-md p-3 resize-none"
        disabled={isSubmitting}
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !task.trim()}
        className="bg-black text-white rounded-md px-4 py-2 disabled:opacity-50"
      >
        {isSubmitting ? "Planning..." : "Generate Plan"}
      </button>
    </div>
  );
}