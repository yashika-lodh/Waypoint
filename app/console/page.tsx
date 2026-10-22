"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Link from "next/link";
import { useAgentStore } from "@/store/useAgentStore";
import { WaypointMark } from "@/components/WaypointMark";
import { TaskInput } from "@/components/TaskInput";
import { PlanEditor } from "@/components/PlanEditor";
import { TraceView } from "@/components/TraceView";
import { PlanErrorState, PlanningState } from "@/components/States";

type View = "input" | "planning" | "plan-error" | "review" | "trace";

export default function Console() {
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
        <Link href="/" className="mb-12 flex w-fit items-center gap-2 text-sm font-semibold">
          <WaypointMark />
          Waypoint
        </Link>

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
