import { groq } from "@/lib/groq";
import { PlanResponseSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a planning agent. Given a task, break it into 3-6 concrete steps.
Respond ONLY with valid JSON matching this shape, no markdown fences, no preamble:
{ "steps": [{ "title": string, "description": string }] }`;

export async function POST(req: NextRequest) {
  const { task } = await req.json();

  if (!task || typeof task !== "string" || task.trim().length === 0) {
    return NextResponse.json({ error: "Task is required" }, { status: 400 });
  }

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: task },
  ];

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages,
      });

      const raw = completion.choices[0].message.content ?? "";

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(raw);
      } catch {
        throw new Error("Response was not valid JSON");
      }

      const result = PlanResponseSchema.safeParse(parsedJson);

      if (result.success) {
        return NextResponse.json({ plan: result.data });
      }

      throw new Error(`Schema validation failed: ${result.error.message}`);
    } catch (err) {
      if (attempt === 0) {
        console.log(`Attempt ${attempt + 1} failed, retrying...`);
        messages.push({
          role: "user",
          content:
            "Your last response was invalid JSON or didn't match the required shape. Respond again with ONLY valid JSON matching: { \"steps\": [{ \"title\": string, \"description\": string }] }",
        });
        continue;
      }

      return NextResponse.json(
        { error: "Failed to generate a valid plan after retry" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
}