"use client";

import { useEffect, useState } from "react";

import { MathText } from "@/components/MathText";
import { useLanguage } from "@/context/LanguageContext";
import type { ParsedQuestion } from "@/lib/parseLinesJson";

const LETTERS = ["A", "B", "C", "D", "E"];

type TrialQuestionCardProps = {
  question: ParsedQuestion;
  questionNumber: number;
  selected: string | undefined;
  onSelect: (answer: string) => void;
  passage?: string;
};

/** Карточка для пробного теста: без подсказок и объяснений до завершения экзамена. */
export default function TrialQuestionCard({
  question,
  questionNumber,
  selected,
  onSelect,
  passage,
}: TrialQuestionCardProps) {
  const { t } = useLanguage();
  const [draft, setDraft] = useState(selected ?? "");

  useEffect(() => {
    setDraft(selected ?? "");
  }, [selected, questionNumber]);

  const q = question;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
        <span className="text-sm font-semibold text-slate-700">
          {t("bankQuestionLabel", { number: questionNumber })}
        </span>
      </div>

      <div className="p-4 sm:p-6">
        {passage ? (
          <div className="mb-5 max-h-[320px] overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
            <MathText text={passage} />
          </div>
        ) : null}

        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          {t("questionPrompt")}
        </p>
        <div className="mt-3 font-medium leading-relaxed text-slate-900">
          <MathText text={q.question} />
        </div>

        {q.options.length > 0 ? (
          <div className="mt-5 flex flex-col gap-2">
            {q.options.map((opt, i) => {
              const letter = LETTERS[i] ?? "?";
              const isSelected = selected === opt;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelect(opt)}
                  className={`flex w-full items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-900"
                      : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="min-w-0 flex-1 pt-0.5">
                    <MathText text={opt} />
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap items-end gap-2">
            <div className="min-w-0 flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t("bankEnterAnswer")}
              </label>
              <input
                type="text"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  onSelect(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && draft.trim()) onSelect(draft.trim());
                }}
                placeholder={t("bankAnswerPlaceholder")}
                className="w-full max-w-md rounded-xl border-2 border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
