"use client";

import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";

const sections = [
  { href: "/practice", key: "navPractice" },
  { href: "/question-bank", key: "navQuestionBank" },
  { href: "/score-calculator", key: "navScoreCalculator" },
  { href: "/score-predictor", key: "navScorePredictor" },
  { href: "/reviews", key: "navReviews" },
] as const;

export default function Sidebar() {
  const { t } = useLanguage();

  return (
    <>
      <div className="mb-4 w-full max-w-[200px] rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <nav className="flex h-56 flex-col justify-start gap-3 text-sm font-semibold text-slate-700">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-xl px-3 py-2 leading-5 transition hover:bg-blue-50 hover:text-blue-700"
            >
              {t(section.key)}
            </Link>
          ))}
        </nav>
      </div>

      <aside className="hidden w-64 flex-col gap-6 border-r border-slate-200 bg-white px-6 py-8 lg:flex">
        <nav className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-2xl px-4 py-3 transition hover:bg-blue-50 hover:text-blue-700"
            >
              {t(section.key)}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-blue-50 p-4 text-xs text-blue-700">
          {t("footerAbout")}
        </div>
      </aside>

    </>
  );
}
