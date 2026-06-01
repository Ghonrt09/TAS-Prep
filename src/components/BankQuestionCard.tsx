"use client";

import { useState } from "react";

import { MathText } from "@/components/MathText";
import type { ParsedQuestion } from "@/lib/parseLinesJson";

const LETTERS = ["A", "B", "C", "D", "E"];

function normalizeAnswer(s: string | undefined): string {
  if (s == null) return "";
  return s.trim().replace(/\s+/g, " ").replace(/,/g, ".");
}

type BankQuestionCardProps = {
  question: ParsedQuestion;
  questionNumber: number;
  selected: string | undefined;
  onSelect: (answer: string) => void;
};

export default function BankQuestionCard({
  question,
  questionNumber,
  selected,
  onSelect,
}: BankQuestionCardProps) {
  const q = question;
  const [draft, setDraft] = useState("");
  const answered = selected != null && selected !== "";
  const isCorrect =
    answered && normalizeAnswer(selected) === normalizeAnswer(q.correctAnswer);
  const showExplanation = answered && !isCorrect && Boolean(q.explanation);

  return (
    <div
      className={
        showExplanation
          ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start"
          : ""
      }
    >
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-slate-500">{questionNumber}.</span>
          <div className="min-w-0 flex-1 font-medium text-slate-900">
            <MathText text={q.question} />
          </div>
        </div>

        {q.options.length > 0 ? (
          <div className="mt-3 flex flex-col gap-1.5">
            {q.options.map((opt, i) => {
              const letter = LETTERS[i] ?? "?";
              const isSelected = selected === opt;
              const isCorrectOption =
                normalizeAnswer(opt) === normalizeAnswer(q.correctAnswer);
              const showWrong = answered && isSelected && !isCorrect;
              const showCorrect = answered && isCorrectOption;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelect(opt)}
                  disabled={answered}
                  className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                    showWrong
                      ? "border-red-400 bg-red-50 text-red-900"
                      : showCorrect
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-slate-50"
                  } ${answered ? "cursor-default" : ""}`}
                >
                  {showWrong ? (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      ✕
                    </span>
                  ) : showCorrect ? (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      ✓
                    </span>
                  ) : (
                    <span className="font-semibold">{letter}.</span>
                  )}
                  <MathText text={opt} />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Введите ответ:</label>
              <input
                type="text"
                value={answered ? (selected ?? "") : draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && draft.trim()) onSelect(draft.trim());
                }}
                disabled={answered}
                placeholder="Ответ"
                className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
              />
            </div>
            {!answered && (
              <button
                type="button"
                onClick={() => draft.trim() && onSelect(draft.trim())}
                disabled={!draft.trim()}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Проверить
              </button>
            )}
          </div>
        )}
      </div>

      {showExplanation && (
        <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-md lg:sticky lg:top-24">
          <h3 className="text-sm font-semibold text-slate-900">Пошаговое объяснение</h3>
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Правильный ответ
            </p>
            <p className="mt-1 text-sm text-emerald-950">
              <MathText text={q.correctAnswer} />
            </p>
          </div>
          <div className="mt-3 text-sm leading-relaxed text-slate-700">
            <MathText text={q.explanation!} />
          </div>
        </aside>
      )}
    </div>
  );
}
