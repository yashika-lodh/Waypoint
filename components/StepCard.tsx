"use client";

import { useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import type { Step } from "@/types/agent";
import { useAgentStore } from "@/store/useAgentStore";
import { cancelRerun, rerunFrom, rerunStep } from "@/lib/rerun";
import { Button } from "./Button";
import { StatusMarker } from "./StatusMarker";
import { TraceLine } from "./TraceLine";

type StepCardProps = {
  step: Step;
  index: number;
  isLast: boolean;
  mode: "review" | "trace";
  canIntervene: boolean;
  isRerunning: boolean;
};

const STATUS_LABEL: Record<Step["status"], string> = {
  pending: "Waiting",
  running: "Running",
  done: "Done",
  paused: "Paused",
  error: "Failed",
};

const STATUS_COLOR: Record<Step["status"], string> = {
  pending: "text-[var(--wp-muted)]",
  running: "text-[var(--wp-route)]",
  done: "text-[var(--wp-muted)]",
  paused: "text-[var(--wp-annot)]",
  error: "text-[var(--wp-danger)]",
};

const fieldClass =
  "w-full rounded-md border border-[var(--wp-line)] bg-[var(--wp-surface)] px-3 py-2 text-[var(--wp-ink)] outline-none focus:border-[var(--wp-route)] focus:ring-2 focus:ring-[var(--wp-route-soft)]";

export function StepCard({ step, index, isLast, mode, canIntervene, isRerunning }: StepCardProps) {
  const updateStep = useAgentStore((s) => s.updateStep);
  const deleteStep = useAgentStore((s) => s.deleteStep);
  const error = useAgentStore((s) => s.error);

  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(step.title);
  const [draftDescription, setDraftDescription] = useState(step.description);

  const isRunning = step.status === "running";
  const hasOutput = Boolean(step.output);
  const isTrace = mode === "trace";
  const canEdit = mode === "review" || (canIntervene && !isRunning);
  const canRerun = isTrace && canIntervene && (step.status === "done" || step.status === "paused");
  const canRetry = isTrace && canIntervene && step.status === "error";

  function startEditing() {
    setDraftTitle(step.title);
    setDraftDescription(step.description);
    setEditing(true);
  }

  function saveEdit() {
    const title = draftTitle.trim();
    const description = draftDescription.trim();
    if (!title) return;
    if (title !== step.title || description !== step.description) {
      updateStep(step.id, {
        title,
        description,
        editedByUser: true,
        // Output that no longer matches its instructions is out of date.
        ...(hasOutput ? { stale: true } : {}),
      });
    }
    setEditing(false);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") setEditing(false);
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveEdit();
  }

  const routeDone = step.status === "done" && !step.stale;

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      className="relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4"
    >
      <div className="relative flex justify-center" aria-hidden>
        {!isLast && (
          <span
            className={`absolute top-8 -bottom-1 w-0.5 rounded-full transition-colors duration-500 ${
              routeDone ? "bg-[var(--wp-route)]" : "bg-[var(--wp-line)]"
            }`}
          />
        )}
        <StatusMarker status={step.status} stale={Boolean(step.stale)} number={index + 1} />
      </div>

      <div className={isLast ? "pb-2" : "pb-9"}>
        {editing ? (
          <div className="space-y-2" onKeyDown={onKeyDown}>
            <label className="block">
              <span className="sr-only">Step title</span>
              <input
                autoFocus
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className={`${fieldClass} font-semibold`}
              />
            </label>
            <label className="block">
              <span className="sr-only">Step instructions</span>
              <textarea
                rows={3}
                value={draftDescription}
                onChange={(e) => setDraftDescription(e.target.value)}
                className={`${fieldClass} resize-y text-sm leading-relaxed`}
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="primary" onClick={saveEdit} disabled={!draftTitle.trim()}>
                Save
              </Button>
              <Button size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              {isTrace && hasOutput && (
                <span className="text-xs text-[var(--wp-muted)]">
                  Saving marks this step&apos;s output as out of date.
                </span>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-0.5">
              <h3 className="text-[1.0625rem] font-semibold leading-snug">{step.title}</h3>
              {isTrace && (
                <span className={`text-sm ${STATUS_COLOR[step.status]}`}>
                  {STATUS_LABEL[step.status]}
                </span>
              )}
            </div>

            {step.editedByUser ? (
              <div className="mt-2 rounded-r-md border-l-2 border-[var(--wp-annot)] bg-[var(--wp-annot-soft)] px-3 py-2">
                <p className="text-xs font-semibold text-[var(--wp-annot)]">Edited by you</p>
                <p className="mt-0.5 text-sm leading-relaxed">{step.description}</p>
              </div>
            ) : (
              <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-[var(--wp-muted)]">
                {step.description}
              </p>
            )}
          </>
        )}

        {isTrace && step.stale && !isRunning && (
          <p className="mt-3 text-sm text-[var(--wp-annot)]">
            Out of date: its instructions or an earlier step changed after it ran.
          </p>
        )}

        {step.status === "error" && error && (
          <p
            role="alert"
            className="mt-3 rounded-md bg-[var(--wp-danger-soft)] px-3 py-2 text-sm text-[var(--wp-danger)]"
          >
            {error}
          </p>
        )}

        {isTrace && (hasOutput || isRunning) && (
          <div
            className={`mt-4 rounded-lg border border-[var(--wp-line)] bg-[var(--wp-surface)] px-4 py-3 transition-opacity ${
              step.stale && !isRunning ? "opacity-60" : ""
            }`}
          >
            <TraceLine output={step.output ?? ""} streaming={isRunning} />
          </div>
        )}

        {!editing && (
          <div className="mt-3 flex flex-wrap gap-2 empty:hidden">
            {mode === "review" && (
              <>
                <Button size="sm" onClick={startEditing}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => deleteStep(step.id)}>
                  Remove
                </Button>
              </>
            )}

            {isTrace && isRunning && isRerunning && (
              <Button size="sm" onClick={cancelRerun}>
                Stop
              </Button>
            )}

            {canRetry && (
              <Button size="sm" variant="primary" onClick={() => rerunFrom(step.id)}>
                Retry and continue
              </Button>
            )}

            {canRerun && (
              <Button
                size="sm"
                variant={step.stale ? "primary" : "quiet"}
                onClick={() => rerunStep(step.id)}
              >
                Re-run step
              </Button>
            )}

            {canRerun && !isLast && (
              <Button size="sm" onClick={() => rerunFrom(step.id)}>
                Re-run from here
              </Button>
            )}

            {isTrace && canEdit && (
              <Button size="sm" onClick={startEditing}>
                Edit instructions
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.li>
  );
}