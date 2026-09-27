import { z } from "zod";

export const PlanResponseSchema = z.object({
  steps: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});