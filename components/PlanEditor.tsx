"use client";

import { AnimatePresence } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";
import { runPlan } from "@/lib/runner";
import { clearLastTask } from "@/lib/planClient";
import { Button } from "./Button";
import { StepCard } from "./StepCard";

export function PlanEditor() {
  const plan = useAgentStore((s) => s.plan);
  const reset = useAgentStore((s) => s.reset);
  if (!plan) return null;

  const steps = plan.steps;
  const edits = steps.filter((s) => s.editedByUser).length;

  return (
    <section>
      <p className="text-sm text-[var(--wp-muted)]">Review the plan before it runs</p>
      <h1 className="mt-1 text-balance text-2xl font-semibold leading-snug tracking-tight">
        {plan.task}
      </h1>
      <p className="mt-2 text-sm text-[var(--wp-muted)]">
        {steps.length} {steps.length === 1 ? "step" : "steps"}
        {edits > 0 && `, ${edits} edited by you`}. Edit or remove anything, then run it.
      </p>

      {steps.length > 0 ? (
        <ol className="mt-8">
          <AnimatePresence initial={false}>
            {steps.map((step, i) => (
              <StepCard
                key={step.id}
                step={step}
                index={i}
                isLast={i === steps.length - 1}
                mode="review"
                canIntervene
                isRerunning={false}
              />
            ))}
          </AnimatePresence>
        </ol>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-[var(--wp-line)] px-4 py-6 text-center text-sm text-[var(--wp-muted)]">
          Every step has been removed. Start over to draft a new plan.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-2 border-t border-[var(--wp-line)] pt-5">
        <Button variant="primary" onClick={() => runPlan()} disabled={steps.length === 0}>
          Run plan
        </Button>
        <Button
          onClick={() => {
            clearLastTask();
            reset();
          }}
        >
          Start over
        </Button>
      </div>
    </section>
  );
}