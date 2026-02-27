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

export default function MathemNisRusPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<MathemNisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    : detailArray;

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
                  {(q as QuestionItem).options && (q as QuestionItem).options!.length > 0 && (
                    <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                      {(q as QuestionItem).options!.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                  )}
                  {(q as DetailItem).text && !hasQuestion && (
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
