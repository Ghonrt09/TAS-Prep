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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Полный текст для чтения (Текст 1, Текст 2 и т.д.) — прокручивается при длинном содержании */}
      {question.passage && (
        <div className="mb-6 max-h-[280px] overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {question.passage}
          </p>
        </div>
      )}
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
        {t("questionPrompt")}
      </p>
      <h2 className="mt-3 break-words text-xl font-semibold text-slate-900">
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
