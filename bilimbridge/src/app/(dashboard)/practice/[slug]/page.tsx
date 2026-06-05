"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import BankQuestionCard from "@/components/BankQuestionCard";
import QuestionGrid, { type QuestionGridEntry } from "@/components/QuestionGrid";
import TrialQuestionCard from "@/components/TrialQuestionCard";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  flattenTrialSections,
  loadTrialExam,
  type LoadedTrialSection,
  type TrialFlatItem,
} from "@/lib/loadBankData";
import { getTrialSections, isTrialSlug, type TrialSlug } from "@/lib/trialTests";
import { saveUserProgress } from "@/lib/userProfile";

type Phase = "test" | "results" | "review";

function normalizeAnswer(s: string | undefined): string {
  if (s == null) return "";
  return s.trim().replace(/\s+/g, " ").replace(/,/g, ".");
}

function isAnswerCorrect(selected: string, item: TrialFlatItem): boolean {
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
  const sectionDefs = slug ? getTrialSections(slug) : [];

  const [loadedSections, setLoadedSections] = useState<LoadedTrialSection[]>([]);
  const [items, setItems] = useState<TrialFlatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("test");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showGrid, setShowGrid] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const savedProgressRef = useRef(false);

  useEffect(() => {
    if (!slug || sectionDefs.length === 0) {
      setLoadedSections([]);
      setItems([]);
      setLoading(false);
      setLoadError(slug ? "Не удалось загрузить пробник" : null);
      return;
    }

    setLoading(true);
    setLoadError(null);
    loadTrialExam(sectionDefs, language)
      .then((sections) => {
        if (sections.length === 0) throw new Error("Нет вопросов в пробнике");
        setLoadedSections(sections);
        setItems(flattenTrialSections(sections));
        setLoadError(null);
      })
      .catch((err) => {
        setLoadedSections([]);
        setItems([]);
        setLoadError(err instanceof Error ? err.message : "Ошибка загрузки");
      })
      .finally(() => setLoading(false));
  }, [slug, language, sectionDefs.length]);

  useEffect(() => {
    setPhase("test");
    setCurrentIndex(0);
    setAnswers({});
    setReviewIndex(0);
    setShowGrid(false);
    savedProgressRef.current = false;
  }, [slug, language]);

  const currentItem = items[currentIndex];
  const totalQuestions = items.length;
  const answeredCount = useMemo(
    () => items.filter((item) => Boolean(answers[item.answerKey]?.trim())).length,
    [answers, items]
  );

  const sectionStats = useMemo(() => {
    return loadedSections.map(({ section, title, items: sectionItems }) => {
      let correct = 0;
      let answered = 0;
      sectionItems.forEach((item) => {
        const flat = items.find(
          (f) =>
            f.sectionId === section.id &&
            f.questionNumber === item.questionNumber &&
            f.question.id === item.question.id
        );
        if (!flat) return;
        const ans = answers[flat.answerKey];
        if (!ans?.trim()) return;
        answered += 1;
        if (isAnswerCorrect(ans, flat)) correct += 1;
      });
      return {
        id: section.id,
        title,
        total: sectionItems.length,
        answered,
        correct,
      };
    });
  }, [loadedSections, items, answers]);

  const totalCorrect = sectionStats.reduce((s, x) => s + x.correct, 0);

  const gridEntries: QuestionGridEntry[] = useMemo(
    () =>
      items.map((item) => ({
        globalIndex: item.globalIndex,
        sectionTitle: item.sectionTitle,
        sectionId: item.sectionId,
        questionNumber: item.questionNumber,
        answered: Boolean(answers[item.answerKey]?.trim()),
      })),
    [items, answers]
  );

  const finishExam = useCallback(() => {
    setPhase("results");
  }, []);

  useEffect(() => {
    if (phase !== "results" || !user || !slug || savedProgressRef.current || answeredCount === 0) {
      return;
    }
    savedProgressRef.current = true;
    saveUserProgress(user.uid, {
      totalAnswered: answeredCount,
      correct: totalCorrect,
      incorrect: answeredCount - totalCorrect,
    }).catch(() => {});
  }, [phase, user, slug, answeredCount, totalCorrect]);

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
          {t("practiceLoading")}
        </div>
      </section>
    );
  }

  if (loadError || totalQuestions === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">{examTitle}</h1>
        <p className="text-sm text-slate-600">{loadError ?? t("practiceTrialNotFound")}</p>
        <Link
          href="/practice"
          className="w-fit rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
        >
          {t("practiceBackToList")}
        </Link>
      </section>
    );
  }

  if (phase === "results") {
    return (
      <section className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{examTitle}</h1>
          <p className="mt-2 text-sm text-slate-600">{t("practiceResultsSubtitle")}</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">{t("practiceResults")}</h2>
          <p className="mt-2 text-sm text-slate-600">
            {t("practiceTotal")}: {totalQuestions} · {t("practiceAnswered")}: {answeredCount} ·{" "}
            {t("practiceCorrect")}: {totalCorrect}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {sectionStats.map((stat) => (
            <div
              key={stat.id}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              <p className="font-semibold text-slate-900">{stat.title}</p>
              <p className="mt-1 text-slate-600">
                {t("practiceSectionScore", {
                  correct: stat.correct,
                  total: stat.total,
                  answered: stat.answered,
                })}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setReviewIndex(0);
              setPhase("review");
            }}
            className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
          >
            {t("practiceReviewWithAnswers")}
          </button>
          <Link
            href="/practice"
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t("practiceBackToList")}
          </Link>
        </div>
      </section>
    );
  }

  if (phase === "review") {
    const reviewItem = items[reviewIndex];
    if (!reviewItem) {
      setPhase("results");
      return null;
    }

    return (
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{t("practiceReviewTitle")}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {reviewItem.sectionTitle} · {reviewIndex + 1}/{totalQuestions}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPhase("results")}
            className="shrink-0 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t("practiceBackToResults")}
          </button>
        </div>

        <BankQuestionCard
          question={reviewItem.question}
          questionNumber={reviewItem.questionNumber}
          selected={answers[reviewItem.answerKey]}
          onSelect={() => {}}
          reviewMode
          passage={reviewItem.passage}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setReviewIndex((i) => Math.max(0, i - 1))}
            disabled={reviewIndex === 0}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {t("practiceBack")}
          </button>
          <button
            type="button"
            onClick={() => setReviewIndex((i) => Math.min(totalQuestions - 1, i + 1))}
            disabled={reviewIndex === totalQuestions - 1}
            className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {t("practiceNext")}
          </button>
        </div>
      </section>
    );
  }

  const progress = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const currentAnswer = currentItem ? answers[currentItem.answerKey] : undefined;

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

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        {t("practiceNavHint")}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <div>
          <span className="font-semibold text-slate-800">{currentItem.sectionTitle}</span>
          <span className="mx-2 text-slate-300">·</span>
          {t("practiceProgress")}: {progress}% ({currentIndex + 1}/{totalQuestions})
        </div>
        <div className="text-slate-500">
          {t("practiceAnswered")}: {answeredCount}/{totalQuestions}
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 sm:order-last sm:basis-full">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <TrialQuestionCard
        question={currentItem.question}
        questionNumber={currentItem.questionNumber}
        selected={currentAnswer}
        onSelect={(answer) =>
          setAnswers((prev) => ({ ...prev, [currentItem.answerKey]: answer }))
        }
        passage={currentItem.passage}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {t("practiceBack")}
        </button>
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
          disabled={currentIndex === totalQuestions - 1}
          className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {t("practiceNext")}
        </button>
        <button
          type="button"
          onClick={() => setShowGrid(true)}
          className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100"
        >
          {t("practiceOpenGrid")}
        </button>
        <button
          type="button"
          onClick={finishExam}
          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
        >
          {t("practiceFinishExam")}
        </button>
      </div>

      {showGrid ? (
        <QuestionGrid
          entries={gridEntries}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
          onClose={() => setShowGrid(false)}
        />
      ) : null}
    </section>
  );
}
