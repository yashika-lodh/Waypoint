"use client";

import { useAgentStore } from "@/store/useAgentStore";
import { pauseCurrentStep, resumeRun } from "@/lib/runner";
import { cancelRerun, rerunFrom } from "@/lib/rerun";
import { clearLastTask } from "@/lib/planClient";
import { Button } from "./Button";

export function RunHeader({ isRerunning }: { isRerunning: boolean }) {
  const plan = useAgentStore((s) => s.plan);
  const runState = useAgentStore((s) => s.runState);
  const currentStepIndex = useAgentStore((s) => s.currentStepIndex);
  const reset = useAgentStore((s) => s.reset);
  if (!plan) return null;

  const steps = plan.steps;
  const total = steps.length;
  const doneCount = steps.filter((s) => s.status === "done").length;
  const hasUnfinished = doneCount < total;

  const statusLine = isRerunning
    ? "Re-running a step"
    : runState === "executing"
      ? `Running step ${currentStepIndex + 1} of ${total}`
      : runState === "paused"
        ? `Paused, ${doneCount} of ${total} steps done`
        : runState === "error"
          ? "Stopped on an error"
          : hasUnfinished
            ? `${doneCount} of ${total} steps done`
            : `All ${total} steps done`;

  const canResume =
    (runState === "paused" || runState === "done") && !isRerunning && hasUnfinished;

  function resume() {
    const current = steps[currentStepIndex];
    if (current && (current.status === "paused" || current.status === "pending")) {
      resumeRun();
      return;
    }
    // The paused step was re-run by hand; continue from the next unfinished one.
    const next = steps.find((s) => s.status !== "done");
    if (next) rerunFrom(next.id);
  }

  function newTask() {
    cancelRerun();
    clearLastTask();
    reset();
  }

  return (
    <header className="border-b border-[var(--wp-line)] pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--wp-muted)]" role="status">
            {statusLine}
          </p>
          <h1 className="mt-1 text-balance text-2xl font-semibold leading-snug tracking-tight">
            {plan.task}
          </h1>
        </div>
        <div className="flex gap-2">
          {runState === "executing" && (
            <Button variant="primary" onClick={() => pauseCurrentStep()}>
              Pause
            </Button>
          )}
          {canResume && (
            <Button variant="primary" onClick={resume}>
              Resume
            </Button>
          )}
          {runState !== "executing" && !isRerunning && <Button onClick={newTask}>New task</Button>}
        </div>
      </div>

      <div className="mt-5 flex gap-1" aria-hidden>
        {steps.map((s) => (
          <span
            key={s.id}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              s.status === "done" && !s.stale
                ? "bg-[var(--wp-route)]"
                : s.status === "running"
                  ? "wp-skeleton bg-[var(--wp-route-soft)]"
                  : s.status === "error"
                    ? "bg-[var(--wp-danger)]"
                    : s.status === "paused" || s.stale
                      ? "bg-[var(--wp-annot)]"
                      : "bg-[var(--wp-line)]"
            }`}
          />
        ))}
      </div>
    </header>
  );
}