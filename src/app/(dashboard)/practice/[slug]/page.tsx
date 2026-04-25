"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

const TRIAL_SLUGS = ["nis", "bil", "rfmsh"] as const;
type TrialSlug = (typeof TRIAL_SLUGS)[number];

function isTrialSlug(value: string): value is TrialSlug {
  return (TRIAL_SLUGS as readonly string[]).includes(value);
}

export default function TrialPlaceholderPage() {
  const params = useParams();
  const raw = typeof params.slug === "string" ? params.slug : "";
  const { t } = useLanguage();

  const slug = isTrialSlug(raw) ? raw : null;

  const examTitle =
    slug === "nis"
      ? t("examNisTitle")
      : slug === "bil"
        ? t("examBilTitle")
        : slug === "rfmsh"
          ? t("examRfmshTitle")
          : t("practiceTitle");

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

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{examTitle}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Пока здесь пусто — позже вы загрузите файлы и задания для этого пробного теста.
          </p>
        </div>
        <Link
          href="/practice"
          className="shrink-0 rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          {t("practiceBackToList")}
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Скоро добавим задания.
      </div>
    </section>
  );
}

