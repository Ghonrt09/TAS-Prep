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
          <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {t("examNisBadge")}
          </span>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            {t("examNisTitle")}
          </h2>
          <p className="mt-2 flex-1 text-sm text-slate-600">
            {t("examNisDetail")}
          </p>
          <span className="mt-6 text-sm font-semibold text-blue-700">
            {t("practiceOpenTrial")} →
          </span>
        </Link>

        <Link
          href="/practice/bil"
          className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {t("examBilBadge")}
          </span>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            {t("examBilTitle")}
          </h2>
          <p className="mt-2 flex-1 text-sm text-slate-600">
            {t("examBilDetail")}
          </p>
          <span className="mt-6 text-sm font-semibold text-blue-700">
            {t("practiceOpenTrial")} →
          </span>
        </Link>

        <Link
          href="/practice/rfmsh"
          className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {t("examRfmshBadge")}
          </span>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            {t("examRfmshTitle")}
          </h2>
          <p className="mt-2 flex-1 text-sm text-slate-600">
            {t("examRfmshDetail")}
          </p>
          <span className="mt-6 text-sm font-semibold text-blue-700">
            {t("practiceOpenTrial")} →
          </span>
        </Link>
      </div>

      <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {t("practiceOneWayRule")}
      </p>
    </section>
  );
}
