"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { MathText } from "@/components/MathText";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryBySlug } from "@/lib/bankCategories";
import { parseLinesFormat, type BankBlock, type ParsedQuestion } from "@/lib/parseLinesJson";

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
  const [showResults, setShowResults] = useState(false);

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

  function normalizeAnswer(s: string | undefined): string {
    if (s == null) return "";
    return s
      .trim()
      .replace(/\s+/g, " ")
      .replace(/,/g, ".");
  }

  const correctCount = questions.filter((q, i) => {
    const key = (q.id ?? i + 1).toString();
    const selected = selectedOptions[key];
    return selected != null && normalizeAnswer(selected) === normalizeAnswer(q.correctAnswer);
  }).length;

  const totalQuestions = questions.length;

  if (!category) {
    return (
      <section className="flex flex-col gap-6">
        <Link href="/question-bank" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← {t("bankTitle")}
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          Категория не найдена.
        </div>
      </section>
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
          Не удалось загрузить материалы. Проверьте файл <code className="rounded bg-red-100 px-1">{category.file}</code>.
        </div>
      )}

      {!loading && !error && questions.length > 0 && (
        <>
          <p className="text-sm text-slate-500">
            Вопросов: {totalQuestions}.
          </p>
          <div className="flex flex-col gap-3">
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
                  const questionKey = (q.id ?? questionNumber).toString();
                  const selected = selectedOptions[questionKey];
                  const letters = ["A", "B", "C", "D", "E"];
                  return (
                    <div key={`q-${q.id ?? blockIndex}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-1 flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-slate-500">{questionNumber}.</span>
                        <div className="min-w-0 flex-1 font-medium text-slate-900">
                          <MathText text={q.question} />
                        </div>
                      </div>
                      {q.options.length > 0 ? (
                        <>
                          <div className="mt-3 flex flex-col gap-1.5">
                            {q.options.map((opt, i) => {
                              const letter = letters[i] ?? "?";
                              const isSelected = selected === opt;
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() =>
                                    setSelectedOptions((prev) => ({ ...prev, [questionKey]: opt }))
                                  }
                                  className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                                    isSelected
                                      ? "border-blue-600 bg-blue-50 text-blue-700"
                                      : "border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-slate-50"
                                  }`}
                                >
                                  <span className="font-semibold">{letter}.</span>
                                  <MathText text={opt} />
                                </button>
                              );
                            })}
                          </div>
                          {showResults && q.correctAnswer && (
                            <p className="mt-2 text-xs text-slate-500">
                              Правильный ответ: <span className="font-medium text-slate-700"><MathText text={q.correctAnswer} /></span>
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="mt-3">
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Введите ответ:
                          </label>
                          <input
                            type="text"
                            value={selected ?? ""}
                            onChange={(e) =>
                              setSelectedOptions((prev) => ({ ...prev, [questionKey]: e.target.value }))
                            }
                            placeholder="Ответ"
                            className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          {showResults && (
                            <p className="mt-1 text-xs text-slate-500">
                              Правильный ответ: <span className="font-medium text-slate-700">{q.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      )}
                      {showResults && q.explanation && (
                        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-sm text-slate-700">
                          <p className="mb-1 font-semibold text-amber-900">Пояснение:</p>
                          <MathText text={q.explanation} />
                        </div>
                      )}
                    </div>
                  );
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
                  {questions.map((q, index) => {
                    const questionNumber = index + 1;
                    const questionKey = (q.id ?? questionNumber).toString();
                    const selected = selectedOptions[questionKey];
                    const letters = ["A", "B", "C", "D", "E"];
                    return (
                      <div key={q.id ?? index} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-1 flex items-baseline gap-2">
                          <span className="text-sm font-semibold text-slate-500">{questionNumber}.</span>
                          <div className="min-w-0 flex-1 font-medium text-slate-900">
                            <MathText text={q.question} />
                          </div>
                        </div>
                        {q.options.length > 0 ? (
                          <>
                            <div className="mt-3 flex flex-col gap-1.5">
                              {q.options.map((opt, i) => {
                                const letter = letters[i] ?? "?";
                                const isSelected = selected === opt;
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() =>
                                      setSelectedOptions((prev) => ({ ...prev, [questionKey]: opt }))
                                    }
                                    className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                                      isSelected
                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                        : "border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-slate-50"
                                    }`}
                                  >
                                    <span className="font-semibold">{letter}.</span>
                                    <MathText text={opt} />
                                  </button>
                                );
                              })}
                            </div>
                            {showResults && q.correctAnswer && (
                              <p className="mt-2 text-xs text-slate-500">
                                Правильный ответ: <span className="font-medium text-slate-700"><MathText text={q.correctAnswer} /></span>
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="mt-3">
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                              Введите ответ:
                            </label>
                            <input
                              type="text"
                              value={selected ?? ""}
                              onChange={(e) =>
                                setSelectedOptions((prev) => ({ ...prev, [questionKey]: e.target.value }))
                              }
                              placeholder="Ответ"
                              className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {showResults && (
                              <p className="mt-1 text-xs text-slate-500">
                                Правильный ответ: <span className="font-medium text-slate-700">{q.correctAnswer}</span>
                              </p>
                            )}
                          </div>
                        )}
                        {showResults && q.explanation && (
                          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-sm text-slate-700">
                            <p className="mb-1 font-semibold text-amber-900">Пояснение:</p>
                            <MathText text={q.explanation} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowResults(true)}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Завершить тест
              </button>
              {showResults && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <p>
                    Вопросов: {totalQuestions}, правильных ответов: {correctCount}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!loading && !error && questions.length === 0 && (
        <p className="text-slate-500">В файле нет вопросов для отображения.</p>
      )}
    </section>
  );
}
