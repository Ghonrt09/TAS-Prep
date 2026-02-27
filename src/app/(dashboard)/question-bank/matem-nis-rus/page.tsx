"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useLanguage } from "@/context/LanguageContext";
import { MathText } from "@/components/MathText";

type DetailItem = {
  position?: number;
  paragraph_id?: string;
  page_id?: number;
  text?: string;
  tags?: string[];
  type?: string;
};

type QuestionItem = {
  id?: number;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  passage?: string;
};

type MathemNisData = {
  detail?: DetailItem[];
  pages?: unknown[];
  total_count?: number;
  success_count?: number;
} | QuestionItem[];

function buildQuestionsFromDetail(detail: DetailItem[]): (DetailItem & QuestionItem)[] {
  const result: (DetailItem & QuestionItem)[] = [];
  let current: (DetailItem & QuestionItem) | null = null;

  detail.forEach((item) => {
    const rawText = item.text ?? "";
    const text = rawText.trim();
    if (!text) return;

    const isQuestion = /^\d+[\).\s]/.test(text);
    // Варианты ответов помечены буквами A)–E) (латиница и кириллица).
    const isOption = /^[A-EА-Е]\)/.test(text);

    if (isQuestion) {
      current = {
        ...item,
        id: result.length + 1,
        question: text,
        options: [],
      };
      result.push(current);
      return;
    }

    if (isOption && current) {
      const optionText = text.replace(/^[A-DА-Г]\)\s*/, "");
      current.options = [...(current.options ?? []), optionText];
      return;
    }

    // Отдельный абзац, не вопрос и не вариант — показываем как отдельный блок.
    result.push({ ...item });
    current = null;
  });

  return result;
}

export default function MathemNisRusPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<MathemNisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/data/Матем%20НИШ%20РУС.json")
      .then((res) => {
        if (!res.ok) throw new Error("Файл не найден");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const isArray = Array.isArray(data);

  // В экспортированном JSON detail может быть не массивом, а объектом с числовыми ключами.
  const rawDetail =
    !isArray && data && "detail" in data ? (data as { detail?: unknown }).detail : null;

  const detailArray: DetailItem[] = Array.isArray(rawDetail)
    ? rawDetail
    : rawDetail && typeof rawDetail === "object"
    ? Object.values(rawDetail as Record<string, DetailItem>)
    : [];

  const list: (DetailItem & QuestionItem)[] = isArray
    ? (data as QuestionItem[])
    : buildQuestionsFromDetail(detailArray);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/question-bank"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← {t("bankTitle")}
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("categoryMatemNisRu")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t("categoryMatemNisRuDesc")}
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Загрузка...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          Не удалось загрузить материалы. Проверьте, что файл{" "}
          <code className="rounded bg-red-100 px-1">public/data/Матем НИШ РУС.json</code>{" "}
          есть в проекте.
        </div>
      )}

      {!loading && !error && data && (
        <>
          <p className="text-sm text-slate-500">
            Загружено: {list.length} элементов.
          </p>
          <div className="flex flex-col gap-3">
            {list.length === 0 && (
              <p className="text-slate-500">В файле нет элементов для отображения.</p>
            )}
            {list.map((item, index) => {
              const q = item as QuestionItem & DetailItem;
              const hasQuestion = "question" in q && q.question;
              const questionKey = ((q as QuestionItem).id ?? index).toString();
              const options = (q as QuestionItem).options ?? [];
              const selected = selectedOptions[questionKey];

              return (
                <div
                  key={(q as DetailItem).paragraph_id ?? (q as QuestionItem).id ?? index}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  {(q as DetailItem).type && (
                    <span className="mb-2 block text-xs font-medium uppercase text-slate-400">
                      {(q as DetailItem).type}
                    </span>
                  )}
                  {hasQuestion && (
                    <p className="font-medium text-slate-900">{(q as QuestionItem).question}</p>
                  )}
                  {options.length > 0 && (
                    <div className="mt-3 flex flex-col gap-1.5">
                      {options.map((opt, i) => {
                        const isSelected = selected === opt;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              setSelectedOptions((prev) => ({
                                ...prev,
                                [questionKey]: opt,
                              }))
                            }
                            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                              isSelected
                                ? "border-blue-600 bg-blue-50 text-blue-700"
                                : "border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-slate-50"
                            }`}
                          >
                            <MathText text={opt} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {(q as DetailItem).text && !hasQuestion && options.length === 0 && (
                    <MathText text={(q as DetailItem).text ?? ""} />
                  )}
                  {(q as DetailItem).page_id != null && (
                    <p className="mt-2 text-xs text-slate-400">Страница {(q as DetailItem).page_id}</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
