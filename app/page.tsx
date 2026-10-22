import Link from "next/link";
import type { ReactNode } from "react";
import type { Step } from "@/types/agent";
import { StatusMarker } from "@/components/StatusMarker";
import { WaypointMark } from "@/components/WaypointMark";

const linkBase =
  "inline-flex items-center gap-1.5 rounded-md font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wp-route)]";
const primaryLink = `${linkBase} h-11 px-5 bg-[var(--wp-route)] text-[var(--wp-on-accent)] hover:brightness-110`;
const quietLink = `${linkBase} h-11 px-5 border border-[var(--wp-line)] bg-[var(--wp-surface)] text-[var(--wp-ink)] hover:border-[var(--wp-muted)]`;

export default function Landing() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <StatusLegend />
        <UseCases />
        <UnderTheHood />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

/* ---------------------------------------------------------------- layout */

function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  tinted = false,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  tinted?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-16 py-20 sm:py-28 ${
        tinted ? "border-y border-[var(--wp-line)] bg-[var(--wp-surface)]" : ""
      }`}
    >
      <Container>
        <p className="text-sm font-semibold text-[var(--wp-route)]">{eyebrow}</p>
        <h2 className="mt-2 max-w-[24ch] text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {title}
        </h2>
        {intro && <p className="mt-4 max-w-[60ch] text-lg text-[var(--wp-muted)]">{intro}</p>}
        <div className="mt-12">{children}</div>
      </Container>
    </section>
  );
}

function SiteHeader() {
  const links = [
    ["How it works", "#how-it-works"],
    ["Features", "#features"],
    ["Use cases", "#use-cases"],
    ["FAQ", "#faq"],
  ];
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--wp-line)] bg-[var(--wp-paper)]/85 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <WaypointMark />
          Waypoint
        </Link>
        <nav aria-label="Sections" className="hidden items-center gap-7 text-sm text-[var(--wp-muted)] md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-[var(--wp-ink)]">
              {label}
            </a>
          ))}
        </nav>
        <Link href="/console" className={`${linkBase} h-9 px-3.5 text-sm bg-[var(--wp-route)] text-[var(--wp-on-accent)] hover:brightness-110`}>
          Open console
        </Link>
      </Container>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-[var(--wp-line)] py-10 text-sm text-[var(--wp-muted)]">
      <Container className="flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2">
          <WaypointMark size={16} />
          <span className="font-semibold text-[var(--wp-ink)]">Waypoint</span>
          <span>· Open source under the MIT License</span>
        </p>
        <nav aria-label="Footer" className="flex gap-6">
          <a href="#how-it-works" className="hover:text-[var(--wp-ink)]">How it works</a>
          <a href="#faq" className="hover:text-[var(--wp-ink)]">FAQ</a>
          <Link href="/console" className="hover:text-[var(--wp-ink)]">Console</Link>
        </nav>
      </Container>
    </footer>
  );
}

/* ------------------------------------------------------------------ hero */

function Hero() {
  return (
    <section className="overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
      <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--wp-line)] bg-[var(--wp-surface)] px-3 py-1 text-sm text-[var(--wp-muted)]">
            <span className="size-1.5 rounded-full bg-[var(--wp-route)]" />
            A research agent with a steering wheel
          </p>
          <h1 className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.08] tracking-tight sm:text-[3.5rem]">
            AI agents you can steer, step&nbsp;by&nbsp;step.
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-[var(--wp-muted)]">
            Describe a task. Waypoint drafts a plan you can edit before anything runs, then works
            through it one step at a time, searching the live web and citing its sources. Pause it,
            rewrite a step, or re-run from any point. You stay in the driver&apos;s seat the whole way.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/console" className={primaryLink}>
              Start a task
              <Arrow />
            </Link>
            <a href="#how-it-works" className={quietLink}>
              See how it works
            </a>
          </div>
          <p className="mt-5 text-sm text-[var(--wp-muted)]">
            No sign-up. Runs in your browser, powered by fast inference on Groq.
          </p>
        </div>
        <ConsolePreview />
      </Container>
    </section>
  );
}

type PreviewStep = {
  title: string;
  description: string;
  status: Step["status"];
  edited?: boolean;
  output?: ReactNode;
};

const PREVIEW_STEPS: PreviewStep[] = [
  {
    title: "Collect current pricing",
    description: "Find per-seat pricing for each tool at the 10-user tier.",
    status: "done",
    output: (
      <>
        Linear Business is $14/user/mo<Cite n={1} />, Notion Plus $10<Cite n={2} />, ClickUp
        Unlimited $7<Cite n={3} />…
      </>
    ),
  },
  {
    title: "Compare integrations",
    description: "Focus on GitHub, Slack, and Figma. Skip the long tail.",
    status: "done",
    edited: true,
  },
  {
    title: "Evaluate AI features",
    description: "What each AI add-on actually does, and what it costs extra.",
    status: "running",
    output: <>Notion AI is now bundled into Business plans, while Asana</>,
  },
  {
    title: "Write the recommendation",
    description: "Rank the five tools for a 10-person startup.",
    status: "pending",
  },
];

function ConsolePreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_top_right,var(--wp-route-soft),transparent_65%)]"
      />
      <figure
        aria-label="Preview of the Waypoint console mid-run"
        className="rounded-xl border border-[var(--wp-line)] bg-[var(--wp-surface)] p-5 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.35)] sm:p-7"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--wp-line)] pb-5">
          <div className="min-w-0">
            <p className="text-xs text-[var(--wp-muted)]">Running step 3 of 4</p>
            <p className="mt-1 text-[1.0625rem] font-semibold leading-snug">
              Compare Notion, Linear, Asana, ClickUp, and Monday.com for a 10-person startup
            </p>
          </div>
          <span className="shrink-0 rounded-md bg-[var(--wp-route)] px-3 py-1.5 text-xs font-medium text-[var(--wp-on-accent)]">
            Pause
          </span>
        </div>
        <div className="mt-4 flex gap-1" aria-hidden>
          <span className="h-1 flex-1 rounded-full bg-[var(--wp-route)]" />
          <span className="h-1 flex-1 rounded-full bg-[var(--wp-route)]" />
          <span className="wp-skeleton h-1 flex-1 rounded-full" />
          <span className="h-1 flex-1 rounded-full bg-[var(--wp-line)]" />
        </div>

        <ol className="mt-6">
          {PREVIEW_STEPS.map((step, i) => (
            <RouteItem
              key={step.title}
              status={step.status}
              number={i + 1}
              isLast={i === PREVIEW_STEPS.length - 1}
            >
              <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
                {step.title}
                {step.status === "running" && (
                  <span className="text-xs font-normal text-[var(--wp-route)]">Running</span>
                )}
              </p>
              {step.edited ? (
                <div className="mt-1.5 rounded-r-md border-l-2 border-[var(--wp-annot)] bg-[var(--wp-annot-soft)] px-2.5 py-1.5">
                  <p className="text-[0.6875rem] font-semibold text-[var(--wp-annot)]">Edited by you</p>
                  <p className="text-xs leading-relaxed">{step.description}</p>
                </div>
              ) : (
                <p className="mt-1 text-xs leading-relaxed text-[var(--wp-muted)]">{step.description}</p>
              )}
              {step.output && (
                <p className="mt-2.5 rounded-md border border-[var(--wp-line)] bg-[var(--wp-paper)] px-3 py-2 text-xs leading-relaxed">
                  {step.output}
                  {step.status === "running" && <span className="wp-caret" aria-hidden />}
                </p>
              )}
            </RouteItem>
          ))}
        </ol>
      </figure>
    </div>
  );
}

function RouteItem({
  status,
  stale = false,
  number,
  isLast,
  children,
}: {
  status: Step["status"];
  stale?: boolean;
  number: number;
  isLast: boolean;
  children: ReactNode;
}) {
  return (
    <li className="relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3.5">
      <div className="relative flex justify-center" aria-hidden>
        {!isLast && (
          <span
            className={`absolute top-8 -bottom-1 w-0.5 rounded-full ${
              status === "done" && !stale ? "bg-[var(--wp-route)]" : "bg-[var(--wp-line)]"
            }`}
          />
        )}
        <StatusMarker status={status} stale={stale} number={number} />
      </div>
      <div className={isLast ? "pb-1" : "pb-6"}>{children}</div>
    </li>
  );
}

function Cite({ n }: { n: number }) {
  return <span className="wp-cite">{n}</span>;
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* --------------------------------------------------------------- problem */

function Problem() {
  const points = [
    {
      title: "You can't see the plan",
      body: "Most agents decide what to do on their own. You find out what they were thinking only after the answer arrives.",
    },
    {
      title: "You can't change course",
      body: "Spot a wrong assumption halfway through? Your only option is to stop everything and start over from scratch.",
    },
    {
      title: "You can't trust the facts",
      body: "Answers drawn from training data go stale fast, especially for prices, features, and anything that changed this year.",
    },
  ];
  return (
    <Section
      eyebrow="Why Waypoint"
      title="Autonomous agents are a black box. Waypoint is a glass one."
      intro="Handing a task to an AI agent usually means hoping for the best. Waypoint makes every decision visible and every step editable, so the work goes where you actually want it to."
      tinted
    >
      <div className="grid gap-5 md:grid-cols-3">
        {points.map((p) => (
          <div key={p.title} className="rounded-xl border border-[var(--wp-line)] bg-[var(--wp-paper)] p-6">
            <p className="flex items-center gap-2 font-semibold">
              <span className="grid size-5 place-items-center rounded-full bg-[var(--wp-danger-soft)] text-xs text-[var(--wp-danger)]">
                ×
              </span>
              {p.title}
            </p>
            <p className="mt-3 text-[var(--wp-muted)]">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------- how it works */

function HowItWorks() {
  const stages = [
    {
      title: "Describe the task",
      body: "Write what you need in plain language: a comparison, a research question, an audit. Up to 2,000 characters, as specific as you like.",
      detail: "“Compare five project tools on pricing, integrations, and AI features.”",
    },
    {
      title: "Review the plan",
      body: "A planning model breaks your task into 3–6 concrete steps. Rewrite any step, delete what you don't need, and only then press Run.",
      detail: "Nothing executes until you approve it.",
    },
    {
      title: "Watch it work",
      body: "Steps run in order. Each one searches the live web, builds on the results before it, and streams its answer into a trace you can read as it's written.",
      detail: "Every claim is tagged with a numbered source.",
    },
    {
      title: "Steer at any point",
      body: "Pause mid-step, edit the instructions, re-run a single step, or re-run everything from a given step onward. Waypoint shows you what's out of date.",
      detail: "Fix the route without restarting the trip.",
    },
  ];
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="From a sentence to a finished brief, in four stops."
      intro="Waypoint splits work into a route of small, visible steps. You set the destination, approve the route, and can take the wheel whenever you like."
    >
      <ol className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
        {stages.map((s, i) => (
          <li key={s.title} className="relative">
            <div className="flex items-center gap-3" aria-hidden>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--wp-route)] text-sm font-semibold text-[var(--wp-on-accent)]">
                {i + 1}
              </span>
              {i < stages.length - 1 && (
                <span className="hidden h-0.5 flex-1 rounded-full bg-[var(--wp-line)] lg:block" />
              )}
            </div>
            <h3 className="mt-5 text-lg font-semibold">
              <span className="sr-only">Step {i + 1}: </span>
              {s.title}
            </h3>
            <p className="mt-2 text-[var(--wp-muted)]">{s.body}</p>
            <p className="mt-4 border-l-2 border-[var(--wp-route-soft)] pl-3 text-sm">{s.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* -------------------------------------------------------------- features */

function Features() {
  const features: { title: string; body: string; icon: ReactNode }[] = [
    {
      title: "Editable plans",
      body: "Every plan is a draft. Change a step's title or instructions, remove steps, and see your edits highlighted so you always know what you changed.",
      icon: <IconPath d="M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4" />,
    },
    {
      title: "Live, streamed trace",
      body: "Watch each step's answer appear token by token, rendered as clean Markdown with tables and lists, plus a progress bar for the whole run.",
      icon: <IconPath d="M4 6h16M4 12h10M4 18h6" />,
    },
    {
      title: "Grounded in the live web",
      body: "Every step is required to search the web before answering, so prices, features, and dates come from current sources, not stale memory.",
      icon: <IconPath d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z" />,
    },
    {
      title: "Inline citations",
      body: "Claims carry numbered source chips right where they're made, so you can see which parts of an answer are backed by what.",
      icon: <IconPath d="M7 8h10M7 12h6m-6 8 3-4h7a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3" />,
    },
    {
      title: "Pause and resume",
      body: "Stop the agent mid-sentence. The partial output is kept, and Resume picks up from the next unfinished step whenever you're ready.",
      icon: <IconPath d="M9 5v14m6-14v14" />,
    },
    {
      title: "Re-run one step, or from here",
      body: "Not happy with a result? Re-run just that step, or re-run it and everything after it so later steps build on the new answer.",
      icon: <IconPath d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />,
    },
    {
      title: "Stale-output tracking",
      body: "Edit a step or redo an earlier one, and Waypoint flags every downstream result that may now be out of date. No silent inconsistencies.",
      icon: <IconPath d="M12 8v5m0 3.5v.5M10.3 3.9 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />,
    },
    {
      title: "Context that carries forward",
      body: "Each step receives the finished outputs of the steps before it, so the final step can compare, rank, and recommend with the full picture.",
      icon: <IconPath d="M5 12h14m-5-5 5 5-5 5" />,
    },
    {
      title: "Fast and recoverable",
      body: "Runs on Groq's low-latency inference. If a step fails, you see the error in place and can retry and continue without losing earlier work.",
      icon: <IconPath d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />,
    },
  ];
  return (
    <Section
      id="features"
      eyebrow="Features"
      title="Everything you need to keep an agent on course."
      tinted
    >
      <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--wp-line)] bg-[var(--wp-line)] sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="bg-[var(--wp-paper)] p-6 sm:p-7">
            <span className="grid size-10 place-items-center rounded-lg bg-[var(--wp-route-soft)] text-[var(--wp-route)]">
              {f.icon}
            </span>
            <h3 className="mt-5 font-semibold">{f.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--wp-muted)]">{f.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function IconPath({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------------------------------------------------------- legend */

function StatusLegend() {
  const states: { status: Step["status"]; stale?: boolean; label: string; body: string }[] = [
    { status: "pending", label: "Waiting", body: "Queued. It runs once the steps before it finish." },
    { status: "running", label: "Running", body: "Searching sources and writing its answer right now." },
    { status: "done", label: "Done", body: "Finished, and its output matches its current instructions." },
    { status: "done", stale: true, label: "Out of date", body: "Its instructions or an earlier step changed after it ran. Re-run to refresh." },
    { status: "paused", label: "Paused", body: "You stopped it. Partial output is kept until you resume or re-run." },
    { status: "error", label: "Failed", body: "Something went wrong. The error is shown in place, with Retry and continue." },
  ];
  return (
    <Section
      eyebrow="Reading the route"
      title="Know the state of every step at a glance."
      intro="Each step sits on a route line that fills in as work completes. Its marker tells you exactly where it stands."
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {states.map((s, i) => (
          <li
            key={s.label}
            className="flex gap-4 rounded-xl border border-[var(--wp-line)] bg-[var(--wp-surface)] p-5"
          >
            <StatusMarker status={s.status} stale={Boolean(s.stale)} number={i + 1} />
            <div>
              <p className="font-semibold">{s.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--wp-muted)]">{s.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------- use cases */

function UseCases() {
  const cases = [
    {
      who: "Founders & operators",
      title: "Pick the right tool",
      example: "Compare five CRMs for a 20-person sales team on price, setup time, and HubSpot migration.",
    },
    {
      who: "Product & strategy",
      title: "Map a market",
      example: "Survey the main players in AI meeting notes: positioning, pricing tiers, and recent launches.",
    },
    {
      who: "Students & researchers",
      title: "Get oriented fast",
      example: "Summarize the current approaches to battery recycling and the companies leading each one.",
    },
    {
      who: "Procurement & finance",
      title: "Audit what you pay",
      example: "Check whether our cloud storage, email, and design tools have cheaper plans at our seat count.",
    },
  ];
  return (
    <Section
      id="use-cases"
      eyebrow="Use cases"
      title="Built for research that has to be right."
      intro="Waypoint shines on multi-part questions where facts change often and you want to check the reasoning before you act on it."
      tinted
    >
      <div className="grid gap-5 md:grid-cols-2">
        {cases.map((c) => (
          <div key={c.title} className="rounded-xl border border-[var(--wp-line)] bg-[var(--wp-paper)] p-6">
            <p className="text-sm text-[var(--wp-muted)]">{c.who}</p>
            <h3 className="mt-1 text-lg font-semibold">{c.title}</h3>
            <p className="mt-4 rounded-lg border border-dashed border-[var(--wp-line)] bg-[var(--wp-surface)] px-4 py-3 text-[0.9375rem] leading-relaxed">
              “{c.example}”
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------------------------------------- under the hood */

function UnderTheHood() {
  const pipeline = [
    { label: "Planner", body: "A larger reasoning model (GPT-OSS 120B on Groq) turns your task into 3–6 steps, validated against a strict schema and retried if malformed." },
    { label: "Executor", body: "A fast model (GPT-OSS 20B on Groq) runs each step with a required browser-search tool, given the task and all prior step outputs." },
    { label: "Stream", body: "Answers stream straight to your browser and can be cancelled instantly. Pausing aborts the request; nothing keeps running in the background." },
  ];
  return (
    <Section
      eyebrow="Under the hood"
      title="Two models, one route, and nothing hidden."
      intro="Waypoint is a small, open-source Next.js app. You can run your own copy in a couple of minutes with a free Groq API key."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ol className="space-y-6">
          {pipeline.map((p, i) => (
            <li key={p.label} className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-md border border-[var(--wp-line)] bg-[var(--wp-surface)] text-sm font-semibold text-[var(--wp-route)]">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{p.label}</p>
                <p className="mt-1 text-[var(--wp-muted)]">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="min-w-0 rounded-xl border border-[var(--wp-line)] bg-[var(--wp-surface)] p-5 sm:p-6">
          <p className="text-sm font-semibold">Run it yourself</p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-[var(--wp-paper)] p-4 font-mono text-sm leading-7">
            <code>
              <span className="text-[var(--wp-muted)]"># 1. Install</span>
              {"\n"}npm install
              {"\n\n"}
              <span className="text-[var(--wp-muted)]"># 2. Add your key to .env.local</span>
              {"\n"}GROQ_API_KEY=your_key_here
              {"\n\n"}
              <span className="text-[var(--wp-muted)]"># 3. Start</span>
              {"\n"}npm run dev
            </code>
          </pre>
          <p className="mt-4 text-sm text-[var(--wp-muted)]">
            Get a key at{" "}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--wp-route)] underline underline-offset-2"
            >
              console.groq.com/keys
            </a>
            . Built with Next.js, React, Tailwind CSS, Zustand, and Zod.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------- faq */

function Faq() {
  const faqs = [
    {
      q: "Do I need an account?",
      a: "No. Open the console and type a task. If you self-host, the only setup is a Groq API key in your environment.",
    },
    {
      q: "Is my task or its results stored anywhere?",
      a: "Waypoint has no database. Your plan and its outputs live in your browser tab's memory and disappear when you refresh or start a new task. Your task and step prompts are sent to Groq to generate answers.",
    },
    {
      q: "What happens to later steps if I change an earlier one?",
      a: "They're kept, but marked “Out of date” so you know they were built on different input. Use “Re-run from here” to refresh the step and everything after it in one go.",
    },
    {
      q: "Can I change the plan while it's running?",
      a: "Yes. Pause the run, then edit any step that isn't currently running. Edited steps are highlighted, and any output they already produced is flagged as stale.",
    },
    {
      q: "How accurate are the answers?",
      a: "Every step searches the live web and cites sources inline, which helps a lot with fast-changing facts. It's still an AI model, so check the cited sources before making important decisions.",
    },
    {
      q: "What does it cost?",
      a: "Waypoint itself is free and MIT-licensed. Running it uses your Groq API key, which is billed (or free-tier limited) by Groq.",
    },
  ];
  return (
    <Section id="faq" eyebrow="FAQ" title="Questions, answered." tinted>
      <div className="grid gap-x-10 md:grid-cols-2">
        {faqs.map((f) => (
          <details key={f.q} className="group border-b border-[var(--wp-line)] py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center rounded-full border border-[var(--wp-line)] text-[var(--wp-muted)] transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-[60ch] leading-relaxed text-[var(--wp-muted)]">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------- cta */

function FinalCta() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-[var(--wp-route)] px-6 py-14 text-center text-[var(--wp-on-accent)] sm:px-12 sm:py-20">
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
            viewBox="0 0 800 300"
            preserveAspectRatio="none"
            fill="none"
          >
            <path d="M-20 260C120 260 140 150 280 150S440 60 560 60 700 20 820 20" stroke="currentColor" strokeWidth="2" strokeDasharray="6 10" />
          </svg>
          <h2 className="relative mx-auto max-w-[20ch] text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Give the agent a destination. Keep the wheel.
          </h2>
          <p className="relative mx-auto mt-4 max-w-[48ch] text-lg opacity-85">
            Your first plan is one sentence away. Try the example task if you need a starting point.
          </p>
          <Link
            href="/console"
            className={`${linkBase} relative mt-8 h-11 bg-[var(--wp-on-accent)] px-5 text-[var(--wp-route)] hover:opacity-90 focus-visible:outline-[var(--wp-on-accent)]`}
          >
            Open the console
            <Arrow />
          </Link>
        </div>
      </Container>
    </section>
  );
}
