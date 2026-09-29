"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { getLastTask, requestPlan } from "@/lib/planClient";
import { Button } from "./Button";

const MAX_LENGTH = 2000;
const EXAMPLE_TASK =
  "Compare Notion, Linear, Asana, ClickUp, and Monday.com for a 10-person startup on pricing, integrations, and AI features.";

export function TaskInput() {
  const [task, setTask] = useState(getLastTask);
  const trimmed = task.trim();
  const tooLong = task.length > MAX_LENGTH;
  const canSubmit = trimmed.length > 0 && !tooLong;

  function submit(e?: FormEvent) {
    e?.preventDefault();
    if (canSubmit) requestPlan(trimmed);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
  }

  return (
    <form onSubmit={submit}>
      <h1 className="text-balance text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.5rem]">
        What should the agent work on?
      </h1>
      <p className="mt-3 max-w-[56ch] text-[var(--wp-muted)]">
        Describe the task. Waypoint drafts a step-by-step plan you can edit before anything runs,
        and you can pause or redirect any step while it works.
      </p>

      <label htmlFor="task" className="sr-only">
        Task
      </label>
      <textarea
        id="task"
        rows={5}
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Research and compare five vendors against the criteria that matter to you…"
        aria-invalid={tooLong}
        aria-describedby="task-hint"
        className="mt-8 w-full resize-y rounded-lg border border-[var(--wp-line)] bg-[var(--wp-surface)] px-4 py-3 leading-relaxed text-[var(--wp-ink)] outline-none placeholder:text-[var(--wp-muted)] focus:border-[var(--wp-route)] focus:ring-2 focus:ring-[var(--wp-route-soft)]"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p
          id="task-hint"
          className={`text-sm ${tooLong ? "text-[var(--wp-danger)]" : "text-[var(--wp-muted)]"}`}
        >
          {tooLong
            ? `Shorten the task to ${MAX_LENGTH.toLocaleString()} characters or fewer.`
            : trimmed
              ? "Press ⌘ Enter to draft the plan."
              : (
                <button
                  type="button"
                  onClick={() => setTask(EXAMPLE_TASK)}
                  className="underline decoration-[var(--wp-line)] underline-offset-4 hover:text-[var(--wp-ink)]"
                >
                  Try an example task
                </button>
              )}
        </p>
        <Button type="submit" variant="primary" disabled={!canSubmit}>
          Draft plan
        </Button>
      </div>
    </form>
  );
}