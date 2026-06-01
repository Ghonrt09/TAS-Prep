"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import BankQuestionCard from "@/components/BankQuestionCard";
import { MathText } from "@/components/MathText";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryBySlug } from "@/lib/bankCategories";
import { parseLinesFormat, type BankBlock, type ParsedQuestion } from "@/lib/parseLinesJson";

function normalizeAnswer(s: string | undefined): string {
  if (s == null) return "";
  return s.trim().replace(/\s+/g, " ").replace(/,/g, ".");
}

export default function BankSlugPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const category = getCategoryBySlug(slug);
  const { t, language } = useLanguage();

  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [passage, setPassage] = useState<string>("");
  const [blocks, setBlocks] = useState<BankBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);

  const title = category && (language === "kk" && category.titleKk ? category.titleKk : category.title);
  const description =
    category && (language === "kk" && category.descriptionKk ? category.descriptionKk : category.description);

  useEffect(() => {
    if (!category || category.format !== "lines") {
      setLoading(false);
      if (category?.format === "detail") setError(null);
      else setError("Категория не найдена");
      return;
    }
    const url = "/data/" + encodeURIComponent(category.file);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Файл не найден");
        return res.json();
      })
      .then((json) => {
        const { questions: q, passage: p, blocks: b } = parseLinesFormat(json);
        setQuestions(q);
        setPassage(p ?? "");
        setBlocks(b ?? []);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
        setQuestions([]);
        setBlocks([]);
      })
      .finally(() => setLoading(false));
  }, [category]);

  const correctCount = questions.filter((q, i) => {
    const key = (q.id ?? i + 1).toString();
    const selected = selectedOptions[key];
    return selected != null && normalizeAnswer(selected) === normalizeAnswer(q.correctAnswer);
  }).length;

  const answeredCount = Object.keys(selectedOptions).length;
  const totalQuestions = questions.length;

  if (!category) {
    return (
      <section className="flex flex-col gap-6">
        <Link href="/question-bank" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← {t("bankTitle")}
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Категория не найдена.</div>
      </section>
    );
  }

  function renderQuestion(q: ParsedQuestion, questionNumber: number) {
    const questionKey = (q.id ?? questionNumber).toString();
    return (
      <BankQuestionCard
        key={`q-${q.id ?? questionNumber}`}
        question={q}
        questionNumber={questionNumber}
        selected={selectedOptions[questionKey]}
        onSelect={(answer) =>
          setSelectedOptions((prev) => ({ ...prev, [questionKey]: answer }))
        }
      />
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/question-bank" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← {t("bankTitle")}
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Загрузка...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          Не удалось загрузить материалы. Проверьте файл{" "}
          <code className="rounded bg-red-100 px-1">{category.file}</code>.
        </div>
      )}

      {!loading && !error && questions.length > 0 && (
        <>
          <p className="text-sm text-slate-500">
            {t("bankQuestions", { value: totalQuestions })}. {t("bankPracticeHint")}
          </p>
          <div className="flex flex-col gap-6">
            {blocks.length > 0
              ? blocks.map((block, blockIndex) => {
                  if (block.type === "passage") {
                    return (
                      <div
                        key={`p-${blockIndex}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
                      >
                        <p className="mb-2 font-semibold text-slate-800">Текст для заданий:</p>
                        <div className="whitespace-pre-wrap">
                          <MathText text={block.text} />
                        </div>
                      </div>
                    );
                  }
                  const q = block.question;
                  const questionNumber = questions.indexOf(q) + 1;
                  return renderQuestion(q, questionNumber);
                })
              : (
                <>
                  {passage && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      <p className="mb-2 font-semibold text-slate-800">Текст для заданий:</p>
                      <div className="whitespace-pre-wrap">
                        <MathText text={passage} />
                      </div>
                    </div>
                  )}
                  {questions.map((q, index) => renderQuestion(q, index + 1))}
                </>
              )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSummary(true)}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Итоги
            </button>
            {showSummary && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                <p>
                  Отвечено: {answeredCount} из {totalQuestions}, правильно: {correctCount}.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {!loading && !error && questions.length === 0 && (
        <p className="text-slate-500">В файле нет вопросов для отображения.</p>
      )}
    </section>
  );
}
