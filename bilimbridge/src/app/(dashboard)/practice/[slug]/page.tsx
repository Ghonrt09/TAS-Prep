"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import QuestionCard from "@/components/QuestionCard";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getTrialQuestions, isTrialSlug, type TrialSlug } from "@/lib/trialTests";
import { saveUserProgress } from "@/lib/userProfile";

export default function TrialTestPage() {
  const params = useParams();
  const raw = typeof params.slug === "string" ? params.slug : "";
  const { t } = useLanguage();
  const { user } = useAuth();

  const slug = isTrialSlug(raw) ? raw : null;
  const questions = useMemo(() => (slug ? getTrialQuestions(slug) : []), [slug]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const savedProgressRef = useRef(false);

  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
    savedProgressRef.current = false;
  }, [slug]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = totalQuestions > 0 && currentIndex === totalQuestions - 1;

  const progress = useMemo(
    () =>
      totalQuestions === 0
        ? 0
        : Math.round(((currentIndex + 1) / totalQuestions) * 100),
    [currentIndex, totalQuestions]
  );

  const results = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    questions.forEach((question) => {
      const answer = answers[question.id];
      if (!answer) return;
      if (answer === question.correctAnswer) {
        correct += 1;
      } else {
        incorrect += 1;
      }
    });
    return { correct, incorrect, totalAnswered: correct + incorrect };
  }, [answers, questions]);

  useEffect(() => {
    if (
      !user ||
      !slug ||
      savedProgressRef.current ||
      results.totalAnswered === 0 ||
      !isLastQuestion
    ) {
      return;
    }
    savedProgressRef.current = true;
    saveUserProgress(user.uid, {
      totalAnswered: results.totalAnswered,
      correct: results.correct,
      incorrect: results.incorrect,
    }).catch(() => {});
  }, [user, slug, isLastQuestion, results.totalAnswered, results.correct, results.incorrect]);

  if (!slug || totalQuestions === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">{t("practiceTitle")}</h1>
        <p className="text-sm text-slate-600">{t("practiceTrialNotFound")}</p>
        <Link
          href="/practice"
          className="w-fit rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
        >
          {t("practiceBackToList")}
        </Link>
      </section>
    );
  }

  const examTitle =
    slug === "nis"
      ? t("examNisTitle")
      : slug === "bil"
        ? t("examBilTitle")
        : t("examRfmshTitle");

  const hasCurrentAnswer = Boolean(answers[currentQuestion.id]);
  const finishedBlock = isLastQuestion && hasCurrentAnswer;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{examTitle}</h1>
          <p className="mt-2 text-sm text-slate-600">{t("practiceSubtitle")}</p>
        </div>
        <Link
          href="/practice"
          className="shrink-0 rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          {t("practiceBackToList")}
        </Link>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {t("practiceOneWayRule")}
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

      {!isLastQuestion ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (!hasCurrentAnswer) return;
              setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
            }}
            disabled={!hasCurrentAnswer}
            className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("practiceNext")}
          </button>
        </div>
      ) : !hasCurrentAnswer ? (
        <p className="text-sm text-slate-500">{t("practicePickAnswerToFinish")}</p>
      ) : null}

      {finishedBlock ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">{t("practiceResults")}</h2>
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
