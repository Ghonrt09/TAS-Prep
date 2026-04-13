"use client";

import { BlockMath, InlineMath } from "react-katex";

type MathTextProps = {
  text: string;
};

// Рендер: текст, $...$ — инлайн формулы, $$...$$ — блочные формулы KaTeX.
export function MathText({ text }: MathTextProps) {
  if (!text) return null;

  const parts: (string | { type: "inline"; formula: string } | { type: "block"; formula: string })[] = [];
  let rest = text;

  while (rest.length > 0) {
    const idxBlock = rest.indexOf("$$");
    const idxInline = rest.indexOf("$");

    if (idxBlock >= 0 && (idxInline < 0 || idxBlock <= idxInline)) {
      const before = rest.slice(0, idxBlock);
      if (before) parts.push(before);
      const after = rest.slice(idxBlock + 2);
      const end = after.indexOf("$$");
      if (end >= 0) {
        parts.push({ type: "block", formula: after.slice(0, end) });
        rest = after.slice(end + 2);
      } else {
        parts.push({ type: "block", formula: after });
        rest = "";
      }
      continue;
    }
    if (idxInline >= 0) {
      const before = rest.slice(0, idxInline);
      if (before) parts.push(before);
      const after = rest.slice(idxInline + 1);
      const end = after.indexOf("$");
      if (end >= 0) {
        parts.push({ type: "inline", formula: after.slice(0, end) });
        rest = after.slice(end + 1);
      } else {
        parts.push(rest);
        rest = "";
      }
      continue;
    }
    parts.push(rest);
    break;
  }

  return (
    <span className="whitespace-pre-wrap text-slate-700">
      {parts.map((part, index) => {
        if (typeof part === "string") return <span key={index}>{part}</span>;
        if (part.type === "block") {
          return (
            <span key={index} className="my-1 block">
              <BlockMath>{part.formula}</BlockMath>
            </span>
          );
        }
        return <InlineMath key={index}>{part.formula}</InlineMath>;
      })}
    </span>
  );
}

