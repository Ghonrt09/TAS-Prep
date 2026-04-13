"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

const iconClass = "size-5 shrink-0";

const icons = {
  lightning: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  question: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  calculator: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  chart: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4v16" />
    </svg>
  ),
  star: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

const sections = [
  { href: "/practice", key: "navPractice" as const, icon: "lightning" as const, isNew: true },
  { href: "/question-bank", key: "navQuestionBank" as const, icon: "question" as const },
  { href: "/score-calculator", key: "navScoreCalculator" as const, icon: "calculator" as const },
  { href: "/score-predictor", key: "navScorePredictor" as const, icon: "chart" as const },
  { href: "/reviews", key: "navReviews" as const, icon: "star" as const },
];

function NavLink({
  href,
  label,
  iconKey,
  isNew,
  isActive,
}: {
  href: string;
  label: string;
  iconKey: keyof typeof icons;
  isNew?: boolean;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-700 ${
        isActive ? "bg-slate-100 text-slate-900" : "text-slate-700"
      }`}
    >
      <span className={isActive ? "text-blue-600" : "text-slate-500"} aria-hidden>
        {icons[iconKey]}
      </span>
      <span className="min-w-0 flex-1">{label}</span>
      {isNew && (
        <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
          New
        </span>
      )}
    </Link>
  );
}

export default function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <aside className="hidden w-[11rem] shrink-0 flex-col border-r border-slate-200 bg-white px-2 py-6 lg:flex">
      <nav className="flex flex-col gap-1 text-slate-700">
        {sections.map((section) => (
          <NavLink
            key={section.href}
            href={section.href}
            label={t(section.key)}
            iconKey={section.icon}
            isNew={section.isNew}
            isActive={pathname === section.href}
          />
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-blue-50 p-2.5 text-xs text-blue-700">
        {t("footerAbout")}
      </div>
    </aside>
  );
}
