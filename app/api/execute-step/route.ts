import { NextRequest } from "next/server";
import { groq } from "@/lib/groq";
import { Step } from "@/types/agent";

export const runtime = "nodejs";

interface ExecuteStepRequest {
  step: Step;
  planTask: string;
  priorOutputs: { title: string; output: string }[];
}

function buildMessages(body: ExecuteStepRequest) {
  const { step, planTask, priorOutputs } = body;

  const priorContext = priorOutputs.length
    ? priorOutputs.map((p) => `### ${p.title}\n${p.output}`).join("\n\n")
    : "No prior steps completed yet.";

  return [
    {
      role: "system" as const,
      content:
        "You are an execution agent completing ONE step of a multi-step research task. " +
        "You have a browser_search tool — use it to look up current, real facts (pricing, " +
        "features, dates) rather than relying on training knowledge, which may be stale or " +
        "wrong for fast-changing products. Write a focused, concrete answer for only this " +
        "step. Do not restate the overall task or summarize other steps. Keep it to a few " +
        "paragraphs or a short list; this is one step among several.",
    },
    {
      role: "user" as const,
      content:
        `Overall task: ${planTask}\n\n` +
        `Context from previously completed steps:\n${priorContext}\n\n` +
        `Now complete this step:\nTitle: ${step.title}\nDescription: ${step.description}`,
    },
  ];
}

export async function POST(request: NextRequest) {
  let body: ExecuteStepRequest;

  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!body.step || !body.planTask) {
    return new Response("Missing step or planTask", { status: 400 });
  }

  const messages = buildMessages(body);

  let groqStream;
  try {
    groqStream = await groq.chat.completions.create(
      {
        model: "openai/gpt-oss-20b",
        messages,
        stream: true,
        temperature: 0.4,
        reasoning_effort: "low",
        tool_choice: "required",
        tools: [{ type: "browser_search" }],
      },
      { signal: request.signal }
    );
  } catch (err) {
    if (request.signal.aborted) {
      return new Response(null, { status: 499 });
    }
    console.error("Groq call failed:", err);
    return new Response("Failed to reach Groq", { status: 502 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of groqStream) {
          if (request.signal.aborted) break;
          const token = chunk.choices[0]?.delta?.content ?? "";
          if (token) controller.enqueue(encoder.encode(token));
        }
      } catch (err) {
        if (!request.signal.aborted) {
          console.error("Stream error:", err);
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}