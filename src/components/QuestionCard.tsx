"use client";

import { MockQuestion } from "@/lib/mockQuestions";
import { useLanguage } from "@/context/LanguageContext";

type QuestionCardProps = {
  question: MockQuestion;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
};

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelect,
}: QuestionCardProps) {
  const { t } = useLanguage();

  // UI-only component for rendering a single question.
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
        {t("questionPrompt")}
      </p>
      <h2 className="mt-3 text-xl font-semibold text-slate-900">
        {question.question}
      </h2>
      <div className="mt-6 grid gap-3">
        {question.options.map((option) => {
          const isSelected = option === selectedAnswer;
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                isSelected
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-700 hover:border-blue-200"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
