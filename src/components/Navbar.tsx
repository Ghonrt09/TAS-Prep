"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/context/LanguageContext";
import { useMobileMenu } from "@/context/MobileMenuContext";

const navLinks = [
  { href: "/practice", key: "navPractice" },
  { href: "/question-bank", key: "navQuestionBank" },
  { href: "/score-calculator", key: "navScoreCalculator" },
  { href: "/score-predictor", key: "navScorePredictor" },
  { href: "/reviews", key: "navReviews" },
] as const;

const examTimers = [
  { label: "NIS", target: "2026-05-15T09:00:00+06:00" },
  { label: "BIL", target: "2026-06-10T09:00:00+06:00" },
  { label: "RFMSH", target: "2026-07-05T09:00:00+06:00" },
];

const clampNumber = (value: number) => (value < 0 ? 0 : value);

const formatCountdown = (targetDate: Date, now: number) => {
  const diffMs = clampNumber(targetDate.getTime() - now);
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export default function Navbar() {
  const [now, setNow] = useState(() => Date.now());
  const { language, setLanguage, t } = useLanguage();
  const { openMenu } = useMobileMenu();
  const pathname = usePathname();
  const showTimers = pathname !== "/";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const timers = useMemo(
    () =>
      examTimers.map((timer) => ({
        ...timer,
        date: new Date(timer.target),
      })),
    []
  );

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={openMenu}
            className="flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Открыть меню"
          >
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <img
              src="/tas-prep-logo.png"
              alt="BilimBridge"
              className="object-contain"
              style={{ height: "clamp(36px, 10vw, 160px)", width: "auto" }}
              fetchPriority="high"
            />
          </Link>
        </div>
        {showTimers ? (
          <div className="flex flex-1 items-center justify-center gap-2 overflow-x-auto py-0.5 sm:flex-col sm:gap-2 sm:overflow-visible sm:py-0">
            {timers.map((timer) => {
              const countdown = formatCountdown(timer.date, now);
              return (
                <div
                  key={timer.label}
                  className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm sm:flex sm:min-w-[180px] sm:items-center sm:justify-center sm:gap-2 sm:px-4 sm:py-2 sm:text-xs"
                >
                  <span className="text-slate-500">
                    {timer.label}:
                  </span>{" "}
                  <span className="font-mono tabular-nums text-slate-900">
                    {countdown.days}
                    {t("timerDays")} {countdown.hours}
                    {t("timerHours")} {countdown.minutes}
                    {t("timerMinutes")} {countdown.seconds}
                    {t("timerSeconds")}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-slate-900"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage("ru")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              language === "ru"
                ? "bg-blue-600 text-white"
                : "border border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            RU
          </button>
          <button
            type="button"
            onClick={() => setLanguage("kk")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              language === "kk"
                ? "bg-blue-600 text-white"
                : "border border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            KZ
          </button>
        </div>
        <Link
          href="/auth"
          className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100"
        >
          {t("navSignIn")}
        </Link>
      </div>
    </header>
  );
}
