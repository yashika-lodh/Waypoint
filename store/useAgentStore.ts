import { create } from "zustand";
import { Plan, Step, RunState } from "@/types/agent";

interface AgentStore {
  runState: RunState;
  plan: Plan | null;
  currentStepIndex: number;

  setRunState: (state: RunState) => void;
  setPlan: (plan: Plan) => void;
  updateStep: (stepId: string, updates: Partial<Step>) => void;
  deleteStep: (stepId: string) => void;
  reset: () => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  runState: "idle",
  plan: null,
  currentStepIndex: 0,

  setRunState: (runState) => set({ runState }),
  setPlan: (plan) => set({ plan }),
  updateStep: (stepId, updates) =>
    set((state) => {
      if (!state.plan) return state;
      return {
        plan: {
          ...state.plan,
          steps: state.plan.steps.map((s) =>
            s.id === stepId ? { ...s, ...updates } : s
          ),
        },
      };
    }),
  deleteStep: (stepId) =>
    set((state) => {
      if (!state.plan) return state;
      return {
        plan: {
          ...state.plan,
          steps: state.plan.steps.filter((s) => s.id !== stepId),
        },
      };
    }),
  reset: () => set({ runState: "idle", plan: null, currentStepIndex: 0 }),
}));