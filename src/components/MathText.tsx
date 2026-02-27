"use client";

import { InlineMath } from "react-katex";

type MathTextProps = {
  text: string;
};

// Простой рендер: обычный текст, а всё внутри $...$ — формулы KaTeX.
export function MathText({ text }: MathTextProps) {
  if (!text) return null;

  const parts = text.split("$");

  return (
    <p className="whitespace-pre-wrap text-slate-700">
      {parts.map((part, index) =>
        index % 2 === 1 ? <InlineMath key={index}>{part}</InlineMath> : part
      )}
    </p>
  );
}

