"use client";

import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";
import type { TrialSlug } from "@/lib/trialTests";

const trialLinks: {
  slug: TrialSlug;
  titleKey: "examNisTitle" | "examBilTitle" | "examRfmshTitle";
  detailKey: "examNisDetail" | "examBilDetail" | "examRfmshDetail";
  badgeKey: "examNisBadge" | "examBilBadge" | "examRfmshBadge";
}[] = [
  { slug: "nis", titleKey: "examNisTitle", detailKey: "examNisDetail", badgeKey: "examNisBadge" },
  { slug: "bil", titleKey: "examBilTitle", detailKey: "examBilDetail", badgeKey: "examBilBadge" },
  { slug: "rfmsh", titleKey: "examRfmshTitle", detailKey: "examRfmshDetail", badgeKey: "examRfmshBadge" },
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
        {trialLinks.map(({ slug, titleKey, detailKey, badgeKey }) => (
          <Link
            key={slug}
            href={`/practice/${slug}`}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              {t(badgeKey)}
            </span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">{t(titleKey)}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-600">{t(detailKey)}</p>
            <span className="mt-6 text-sm font-semibold text-blue-700">{t("practiceOpenTrial")} →</span>
          </Link>
        ))}
      </div>

      <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {t("practiceOneWayRule")}
      </p>
    </section>
  );
}
