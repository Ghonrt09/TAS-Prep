"use client";

import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";
import type { TrialSlug } from "@/lib/trialTests";

const trialLinks: {
  slug: TrialSlug;
  titleKey: "examNisTitle" | "examBilTitle" | "examRfmshTitle";
}[] = [
  { slug: "nis", titleKey: "examNisTitle" },
  { slug: "bil", titleKey: "examBilTitle" },
  { slug: "rfmsh", titleKey: "examRfmshTitle" },
];

export default function PracticePage() {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{t("practiceTitle")}</h1>
        <p className="mt-2 text-sm text-slate-600">{t("practiceHubSubtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {trialLinks.map(({ slug, titleKey }) => (
          <Link
            key={slug}
            href={`/practice/${slug}`}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <h2 className="mt-4 text-lg font-semibold text-slate-900">{t(titleKey)}</h2>
            <span className="mt-6 text-sm font-semibold text-blue-700">{t("practiceOpenTrial")} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
