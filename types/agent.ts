  export type StepStatus = "pending" | "running" | "done" | "error" | "paused";

  export interface Step {
    id: string;
    title: string;
    description: string;
    status: StepStatus;
    output?: string;
    editedByUser: boolean;
    needsReview?: boolean;
    stale?: boolean;
  }

  export interface Plan {
    id: string;
    task: string;
    steps: Step[];
    createdAt: string;
  }

  export type RunState = "idle" | "planning" | "reviewing" | "executing" | "paused" | "done" | "error";