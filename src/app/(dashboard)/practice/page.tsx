"use client";

import { useMemo, useState } from "react";

import QuestionCard from "@/components/QuestionCard";
import { mockQuestions } from "@/lib/mockQuestions";
import { useLanguage } from "@/context/LanguageContext";

export default function PracticePage() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = mockQuestions[currentIndex];
  const totalQuestions = mockQuestions.length;

  const progress = useMemo(
    () => Math.round(((currentIndex + 1) / totalQuestions) * 100),
    [currentIndex, totalQuestions]
  );

  const results = useMemo(() => {
    let correct = 0;
    let incorrect = 0;

    mockQuestions.forEach((question) => {
      const answer = answers[question.id];
      if (!answer) return;
      if (answer === question.correctAnswer) {
        correct += 1;
      } else {
        incorrect += 1;
      }
    });

    return { correct, incorrect };
  }, [answers]);

  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("practiceTitle")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t("practiceSubtitle")}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        {t("practiceProgress")}: {progress}% ({currentIndex + 1}/{totalQuestions})
        <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        selectedAnswer={answers[currentQuestion.id] ?? null}
        onSelect={(answer) =>
          setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }))
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("practiceBack")}
        </button>
        <button
          onClick={() =>
            setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
          }
          disabled={isLastQuestion}
          className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("practiceNext")}
        </button>
      </div>

      {isLastQuestion ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("practiceResults")}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t("practiceTotal")}: {totalQuestions}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {t("practiceCorrect")}: {results.correct} · {t("practiceIncorrect")}:{" "}
            {results.incorrect}
          </p>
        </div>
      ) : null}
    </section>
  );
}
