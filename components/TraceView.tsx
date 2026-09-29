"use client";

import { AnimatePresence } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";
import { RunHeader } from "./RunHeader";
import { RunErrorBanner } from "./States";
import { StepCard } from "./StepCard";

type TraceViewProps = {
  isRerunning: boolean;
  canIntervene: boolean;
};

export function TraceView({ isRerunning, canIntervene }: TraceViewProps) {
  const plan = useAgentStore((s) => s.plan);
  const runState = useAgentStore((s) => s.runState);
  if (!plan) return null;

  const steps = plan.steps;

  return (
    <section>
      <RunHeader isRerunning={isRerunning} />
      {runState === "error" && <RunErrorBanner />}

      <ol className="mt-8">
        <AnimatePresence initial={false}>
          {steps.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              index={i}
              isLast={i === steps.length - 1}
              mode="trace"
              canIntervene={canIntervene}
              isRerunning={isRerunning}
            />
          ))}
        </AnimatePresence>
      </ol>
    </section>
  );
}