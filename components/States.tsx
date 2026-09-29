"use client";

import { useAgentStore } from "@/store/useAgentStore";
import { getLastTask, requestPlan } from "@/lib/planClient";
import { Button } from "./Button";

export function PlanningState() {
  const task = getLastTask();
  return (
    <section aria-busy="true">
      <p className="text-sm text-[var(--wp-muted)]" role="status">
        Drafting a plan
      </p>
      <h1 className="mt-1 text-balance text-2xl font-semibold leading-snug tracking-tight">
        {task}
      </h1>
      <ol className="mt-8 space-y-7" aria-hidden>
        {[0.72, 0.55, 0.64, 0.48].map((w, i) => (
          <li key={i} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4">
            <span className="wp-skeleton size-7 rounded-full" />
            <div className="space-y-2 pt-1">
              <span className="wp-skeleton block h-4 rounded" style={{ width: `${w * 60}%` }} />
              <span className="wp-skeleton block h-3 rounded" style={{ width: `${w * 100}%` }} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function PlanErrorState() {
  const error = useAgentStore((s) => s.error);
  const setRunState = useAgentStore((s) => s.setRunState);
  const setError = useAgentStore((s) => s.setError);

  return (
    <section role="alert">
      <h1 className="text-2xl font-semibold tracking-tight">The plan couldn&apos;t be drafted</h1>
      <p className="mt-2 max-w-[60ch] text-[var(--wp-muted)]">
        {error ?? "The planner didn't return a usable plan."} Try again, or reword the task if it
        keeps failing.
      </p>
      <div className="mt-6 flex gap-2">
        <Button variant="primary" onClick={() => requestPlan(getLastTask())}>
          Try again
        </Button>
        <Button
          onClick={() => {
            setError(null);
            setRunState("idle");
          }}
        >
          Edit task
        </Button>
      </div>
    </section>
  );
}

export function RunErrorBanner() {
  return (
    <p className="mt-6 rounded-lg border border-[var(--wp-danger)] bg-[var(--wp-danger-soft)] px-4 py-3 text-sm text-[var(--wp-danger)]">
      A step failed, so the run stopped. Retry it below, or edit its instructions first.
    </p>
  );
}