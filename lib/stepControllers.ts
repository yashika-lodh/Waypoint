// Lives outside Zustand deliberately — AbortControllers aren't
// serializable state, they're imperative handles for in-flight requests.
const controllers = new Map<string, AbortController>();

export function createStepController(stepId: string): AbortController {
  const controller = new AbortController();
  controllers.set(stepId, controller);
  return controller;
}

export function getStepController(stepId: string): AbortController | undefined {
  return controllers.get(stepId);
}

export function clearStepController(stepId: string): void {
  controllers.delete(stepId);
}