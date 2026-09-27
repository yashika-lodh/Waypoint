import { groq } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { task } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `You are a planning agent. Given a task, break it into 3-6 concrete steps.
Respond ONLY with valid JSON matching this shape, no markdown fences, no preamble:
{ "steps": [{ "title": string, "description": string }] }`,
      },
      { role: "user", content: task },
    ],
  });

  const raw = completion.choices[0].message.content;
  return NextResponse.json({ raw });
}