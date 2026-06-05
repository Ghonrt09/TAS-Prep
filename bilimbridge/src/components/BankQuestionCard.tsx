"use client";

import { useState } from "react";

import { MathText } from "@/components/MathText";
import { useLanguage } from "@/context/LanguageContext";
import type { ParsedQuestion } from "@/lib/parseLinesJson";

const LETTERS = ["A", "B", "C", "D", "E"];

function normalizeAnswer(s: string | undefined): string {
  if (s == null) return "";
  return s.trim().replace(/\s+/g, " ").replace(/,/g, ".");
}

function isAnswerCorrect(selected: string, q: ParsedQuestion): boolean {
  if (!selected) return false;
  if (normalizeAnswer(selected) === normalizeAnswer(q.correctAnswer)) return true;
  const selectedIdx = q.options.indexOf(selected);
  const correctIdx = q.options.findIndex(
    (opt) => normalizeAnswer(opt) === normalizeAnswer(q.correctAnswer)
  );
  return selectedIdx >= 0 && correctIdx >= 0 && selectedIdx === correctIdx;
}

type BankQuestionCardProps = {
  question: ParsedQuestion;
  questionNumber: number;
  selected: string | undefined;
  onSelect: (answer: string) => void;
  /** Пробный тест: можно менять ответ до «Дальше». */
  allowReselect?: boolean;
  /** Текст для чтения перед вопросом (пробник). */
  passage?: string;
};

export default function BankQuestionCard({
  question,
  questionNumber,
  selected,
  onSelect,
  allowReselect = false,
  passage,
}: BankQuestionCardProps) {
  const { t } = useLanguage();
  const q = question;
  const [draft, setDraft] = useState("");

  const answered = selected != null && selected !== "";
  const lockOptions = answered && !allowReselect;
  const isCorrect = answered && isAnswerCorrect(selected, q);
  const explanationText = q.explanation?.trim() ?? "";
  const showExplanationPanel = answered;

  return (
    <div
      className={
        showExplanationPanel
          ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:items-start"
          : ""
      }
    >
      <article
        className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow ${
          answered
            ? isCorrect
              ? "border-emerald-200 ring-1 ring-emerald-100"
              : "border-red-200 ring-1 ring-red-100"
            : "border-slate-200"
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 ${
            answered
              ? isCorrect
                ? "border-emerald-100 bg-emerald-50/80"
                : "border-red-100 bg-red-50/80"
              : "border-slate-100 bg-slate-50/80"
          }`}
        >
          <span className="text-sm font-semibold text-slate-700">
            {t("bankQuestionLabel", { number: questionNumber })}
          </span>
          {answered && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isCorrect ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
              }`}
            >
              {isCorrect ? t("bankAnswerCorrect") : t("bankAnswerWrong")}
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5">
          {passage ? (
            <div className="mb-4 max-h-[280px] overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
              <MathText text={passage} />
            </div>
          ) : null}
          <div className="font-medium leading-relaxed text-slate-900">
            <MathText text={q.question} />
          </div>

          {q.options.length > 0 ? (
            <div className="mt-4 flex flex-col gap-2">
              {q.options.map((opt, i) => {
                const letter = LETTERS[i] ?? "?";
                const isSelected = selected === opt;
                const isCorrectOption = isAnswerCorrect(opt, q);
                const showWrong = answered && isSelected && !isCorrect;
                const showCorrect = answered && isCorrectOption;

                let optionClass =
                  "flex w-full items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition ";
                if (showWrong) {
                  optionClass += "border-red-500 bg-red-50 text-red-950";
                } else if (showCorrect) {
                  optionClass += "border-emerald-500 bg-emerald-50 text-emerald-950";
                } else if (answered) {
                  optionClass += "border-slate-200 bg-white text-slate-500";
                } else if (isSelected) {
                  optionClass += "border-blue-500 bg-blue-50 text-blue-900";
                } else {
                  optionClass +=
                    "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-slate-50";
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSelect(opt)}
                    disabled={lockOptions}
                    className={optionClass + (lockOptions ? "cursor-default" : "")}
                  >
                    <span
                      className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        showWrong
                          ? "bg-red-500 text-white"
                          : showCorrect
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {showWrong ? "✕" : showCorrect ? "✓" : letter}
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5">
                      <MathText text={opt} />
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-end gap-2">
              <div className="min-w-0 flex-1">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t("bankEnterAnswer")}
                </label>
                <input
                  type="text"
                  value={answered ? (selected ?? "") : draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && draft.trim()) onSelect(draft.trim());
                  }}
                  disabled={lockOptions}
                  placeholder={t("bankAnswerPlaceholder")}
                  className={`w-full max-w-md rounded-xl border-2 px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:bg-slate-50 ${
                    answered
                      ? isCorrect
                        ? "border-emerald-500 focus:ring-emerald-200"
                        : "border-red-500 focus:ring-red-200"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
              </div>
              {!lockOptions && (
                <button
                  type="button"
                  onClick={() => draft.trim() && onSelect(draft.trim())}
                  disabled={!draft.trim()}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {t("bankCheckAnswer")}
                </button>
              )}
            </div>
          )}
        </div>
      </article>

      {showExplanationPanel && (
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md lg:sticky lg:top-24">
          <h3 className="text-base font-semibold text-slate-900">{t("bankExplanationTitle")}</h3>
          <p className="mt-1 text-xs text-slate-500">{t("bankExplanationHint")}</p>

          <div className="mt-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              {t("bankCorrectAnswerLabel")}
            </p>
            <p className="mt-1 text-sm font-medium text-emerald-950">
              <MathText text={q.correctAnswer} />
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3">
            <p className="text-xs font-semibold text-amber-900">{t("bankHowToSolve")}</p>
            {explanationText ? (
              <div className="mt-2 text-sm leading-relaxed text-slate-800">
                <MathText text={explanationText} />
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-600">{t("bankNoExplanation")}</p>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
