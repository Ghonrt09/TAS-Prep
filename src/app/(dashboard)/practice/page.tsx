"use client";

import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";

export default function PracticePage() {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("practiceTitle")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t("practiceHubSubtitle")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/practice/nis"
          className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Пробный экзамен в НИШ
          </h2>
          <span className="mt-6 text-sm font-semibold text-blue-700">
            {t("practiceOpenTrial")} →
          </span>
        </Link>

        <Link
          href="/practice/bil"
          className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Пробный экзамен в БИЛ
          </h2>
          <span className="mt-6 text-sm font-semibold text-blue-700">
            {t("practiceOpenTrial")} →
          </span>
        </Link>

        <Link
          href="/practice/rfmsh"
          className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Пробный экзамен в РФМШ
          </h2>
          <span className="mt-6 text-sm font-semibold text-blue-700">
            {t("practiceOpenTrial")} →
          </span>
        </Link>
      </div>
    </section>
  );
}
