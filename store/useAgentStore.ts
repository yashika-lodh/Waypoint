import { create } from "zustand";
import { Plan, Step, RunState } from "@/types/agent";

interface AgentStore {
  runState: RunState;
  plan: Plan | null;
  currentStepIndex: number;
  error: string | null;

  setRunState: (state: RunState) => void;
  setPlan: (plan: Plan) => void;
  updateStep: (stepId: string, updates: Partial<Step>) => void;
  deleteStep: (stepId: string) => void;
  appendStepOutput: (stepId: string, chunk: string) => void;
  setCurrentStepIndex: (index: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  runState: "idle",
  plan: null,
  currentStepIndex: 0,
  error: null,

  setRunState: (runState) => set({ runState }),
  setPlan: (plan) => set({ plan }),
  setError: (error) => set({ error }),
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
  appendStepOutput: (stepId, chunk) =>
    set((state) => {
      if (!state.plan) return state;
      return {
        plan: {
          ...state.plan,
          steps: state.plan.steps.map((s) =>
            s.id === stepId
              ? { ...s, output: (s.output ?? "") + chunk }
              : s
          ),
        },
      };
    }),
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
  reset: () => set({ runState: "idle", plan: null, currentStepIndex: 0, error: null, }),
}));