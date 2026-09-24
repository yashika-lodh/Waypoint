  export type StepStatus = "pending" | "running" | "done" | "error" | "paused";

  export interface Step {
    id: string;
    title: string;
    description: string;
    status: StepStatus;
    output?: string;
    editedByUser: boolean;
    needsReview?: boolean;
  }

  export interface Plan {
    task: string;
    steps: Step[];
  }

  export type RunState = "idle" | "planning" | "reviewing" | "executing" | "paused" | "done";