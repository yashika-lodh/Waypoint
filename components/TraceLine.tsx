"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// browser_search grounding emits markers like 【1†L8-L26】.
const CITATION = /【(\d+)†[^】]*】/g;
const PARTIAL_CITATION = /【[^】]*$/; // half-streamed marker at the end
const HTML_BREAK = /<br\s*\/?>/gi; // models put <br> inside table cells

export function prepareOutput(raw: string) {
  return raw
    .replace(PARTIAL_CITATION, "")
    .replace(HTML_BREAK, " ")
    .replace(CITATION, (_m, n: string) => `\`src:${n}\``)
    .replace(/(`src:(\d+)`)(\s*`src:\2`)+/g, "$1"); // collapse repeats of the same source
}

const components: Components = {
  code({ children, className }) {
    const match = /^src:(\d+)$/.exec(String(children));
    if (match) {
      return (
        <span className="wp-cite" title={`Source ${match[1]}`}>
          {match[1]}
        </span>
      );
    }
    return <code className={className}>{children}</code>;
  },
  table({ children }) {
    return (
      <div className="wp-table-scroll">
        <table>{children}</table>
      </div>
    );
  },
  a({ href, children }) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },
};

type TraceLineProps = {
  output: string;
  streaming: boolean;
};

export function TraceLine({ output, streaming }: TraceLineProps) {
  if (!output && streaming) {
    return <p className="wp-waiting">Searching sources and drafting…</p>;
  }
  if (!output) return null;

  return (
    <div className="wp-output" aria-busy={streaming}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {prepareOutput(output)}
      </ReactMarkdown>
      {streaming && <span className="wp-caret" aria-hidden />}
    </div>
  );
}