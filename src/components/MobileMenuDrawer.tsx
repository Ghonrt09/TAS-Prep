"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";
import { useMobileMenu } from "@/context/MobileMenuContext";

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

type IconKey = keyof typeof icons;

export default function MobileMenuDrawer() {
  const { isOpen, closeMenu } = useMobileMenu();
  const { t } = useLanguage();
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Закрыть меню"
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={closeMenu}
      />
      <aside
        className="fixed left-0 top-0 z-50 flex h-full w-[min(280px,85vw)] flex-col border-r border-slate-200 bg-white shadow-xl lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
            <img
              src="/tas-prep-logo.png"
              alt="BilimBridge"
              className="h-8 w-auto object-contain"
              fetchPriority="high"
            />
            <span className="text-lg font-semibold text-slate-900">BilimBridge</span>
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Закрыть"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
          {sections.map((section) => {
            const isActive = pathname === section.href;
            return (
              <Link
                key={section.href}
                href={section.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-700 ${
                  isActive ? "bg-slate-100 text-slate-900" : "text-slate-700"
                }`}
              >
                <span className={isActive ? "text-blue-600" : "text-slate-500"} aria-hidden>
                  {icons[section.icon as IconKey]}
                </span>
                <span className="min-w-0 flex-1">{t(section.key)}</span>
                {section.isNew && (
                  <span className="shrink-0 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <div className="rounded-2xl bg-blue-50 p-3 text-xs text-blue-700">
            {t("footerAbout")}
          </div>
        </div>
      </aside>
    </>
  );
}
