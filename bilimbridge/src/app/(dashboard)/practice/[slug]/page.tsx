"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import BankQuestionCard from "@/components/BankQuestionCard";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  buildTrialQuestionItems,
  fetchBankData,
  questionKey,
  type TrialQuestionItem,
} from "@/lib/loadBankData";
import { getTrialCategory, isTrialSlug, type TrialSlug } from "@/lib/trialTests";
import { saveUserProgress } from "@/lib/userProfile";

function normalizeAnswer(s: string | undefined): string {
  if (s == null) return "";
  return s.trim().replace(/\s+/g, " ").replace(/,/g, ".");
}

function isAnswerCorrect(selected: string, item: TrialQuestionItem): boolean {
  const q = item.question;
  if (normalizeAnswer(selected) === normalizeAnswer(q.correctAnswer)) return true;
  const selectedIdx = q.options.indexOf(selected);
  const correctIdx = q.options.findIndex(
    (opt) => normalizeAnswer(opt) === normalizeAnswer(q.correctAnswer)
  );
  return selectedIdx >= 0 && correctIdx >= 0 && selectedIdx === correctIdx;
}

export default function TrialTestPage() {
  const params = useParams();
  const raw = typeof params.slug === "string" ? params.slug : "";
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const slug = isTrialSlug(raw) ? raw : null;
  const category = slug ? getTrialCategory(slug, language) : undefined;

  const [items, setItems] = useState<TrialQuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [draftAnswer, setDraftAnswer] = useState<string | undefined>();
  const savedProgressRef = useRef(false);

  useEffect(() => {
    if (!category) {
      setItems([]);
      setLoading(false);
      setLoadError(slug ? "Не удалось загрузить пробник" : null);
      return;
    }

    setLoading(true);
    setLoadError(null);
    fetchBankData(category)
      .then(({ questions, blocks }) => {
        setItems(buildTrialQuestionItems(questions, blocks));
        setLoadError(null);
      })
      .catch((err) => {
        setItems([]);
        setLoadError(err instanceof Error ? err.message : "Ошибка загрузки");
      })
      .finally(() => setLoading(false));
  }, [category, slug]);

  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
    setDraftAnswer(undefined);
    savedProgressRef.current = false;
  }, [slug, language]);

  const currentItem = items[currentIndex];
  const totalQuestions = items.length;
  const isLastQuestion = totalQuestions > 0 && currentIndex === totalQuestions - 1;

  useEffect(() => {
    if (!currentItem) {
      setDraftAnswer(undefined);
      return;
    }
    const key = questionKey(currentItem.question, currentItem.questionNumber);
    setDraftAnswer(answers[key]);
  }, [currentIndex, currentItem, answers]);

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
    items.forEach((item) => {
      const key = questionKey(item.question, item.questionNumber);
      const answer = answers[key];
      if (!answer) return;
      if (isAnswerCorrect(answer, item)) {
        correct += 1;
      } else {
        incorrect += 1;
      }
    });
    return { correct, incorrect, totalAnswered: correct + incorrect };
  }, [answers, items]);

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
    const key = currentItem
      ? questionKey(currentItem.question, currentItem.questionNumber)
      : "";
    if (!key || !answers[key]) return;

    savedProgressRef.current = true;
    saveUserProgress(user.uid, {
      totalAnswered: results.totalAnswered,
      correct: results.correct,
      incorrect: results.incorrect,
    }).catch(() => {});
  }, [
    user,
    slug,
    isLastQuestion,
    results.totalAnswered,
    results.correct,
    results.incorrect,
    answers,
    currentItem,
  ]);

  if (!slug) {
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

  if (loading) {
    return (
      <section className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-slate-900">{examTitle}</h1>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Загрузка...
        </div>
      </section>
    );
  }

  if (loadError || totalQuestions === 0 || !currentItem) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">{examTitle}</h1>
        <p className="text-sm text-slate-600">
          {loadError ?? t("practiceTrialNotFound")}
        </p>
        <Link
          href="/practice"
          className="w-fit rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
        >
          {t("practiceBackToList")}
        </Link>
      </section>
    );
  }

  const hasCurrentAnswer = Boolean(draftAnswer);
  const finishedBlock = isLastQuestion && hasCurrentAnswer && Boolean(answers[questionKey(currentItem.question, currentItem.questionNumber)]);

  const commitAndNext = () => {
    if (!draftAnswer) return;
    const key = questionKey(currentItem.question, currentItem.questionNumber);
    setAnswers((prev) => ({ ...prev, [key]: draftAnswer }));
    if (!isLastQuestion) {
      setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
    }
  };

  const showNextButton = !isLastQuestion || !answers[questionKey(currentItem.question, currentItem.questionNumber)];

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

      <BankQuestionCard
        question={currentItem.question}
        questionNumber={currentItem.questionNumber}
        selected={draftAnswer}
        onSelect={setDraftAnswer}
        allowReselect
        passage={currentItem.passage}
      />

      {showNextButton ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={commitAndNext}
            disabled={!hasCurrentAnswer}
            className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLastQuestion ? t("practiceFinish") : t("practiceNext")}
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
