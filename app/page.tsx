"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";
import { TaskInput } from "@/components/TaskInput";
import { PlanEditor } from "@/components/PlanEditor";
import { TraceView } from "@/components/TraceView";
import { PlanErrorState, PlanningState } from "@/components/States";

type View = "input" | "planning" | "plan-error" | "review" | "trace";

export default function Home() {
  const plan = useAgentStore((s) => s.plan);
  const runState = useAgentStore((s) => s.runState);

  const steps = plan?.steps ?? [];
  const isRerunning = runState !== "executing" && steps.some((s) => s.status === "running");
  const canIntervene = runState !== "executing" && !isRerunning;

  let view: View;
  if (!plan) {
    view = runState === "planning" ? "planning" : runState === "error" ? "plan-error" : "input";
  } else {
    view = runState === "reviewing" || runState === "idle" ? "review" : "trace";
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto w-full max-w-[46rem] px-5 pb-24 pt-10 sm:pt-14">
        <p className="mb-12 flex items-center gap-2 text-sm font-semibold">
          <WaypointMark />
          Waypoint
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            {view === "input" && <TaskInput />}
            {view === "planning" && <PlanningState />}
            {view === "plan-error" && <PlanErrorState />}
            {view === "review" && <PlanEditor />}
            {view === "trace" && (
              <TraceView isRerunning={isRerunning} canIntervene={canIntervene} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}

function WaypointMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M4 15V9.5a3 3 0 0 1 3-3h4a3 3 0 0 0 3-3V3" stroke="var(--wp-line)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4" cy="15" r="2.25" fill="var(--wp-route)" />
      <circle cx="14" cy="3" r="2.25" fill="none" stroke="var(--wp-route)" strokeWidth="1.5" />
    </svg>
  );
}