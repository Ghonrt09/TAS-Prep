"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const navLinks = [
  { href: "/practice", label: "Practice Tests" },
  { href: "/question-bank", label: "Question Bank" },
  { href: "/score-calculator", label: "Score Calculator" },
  { href: "/score-predictor", label: "Score Predictor" },
  { href: "/reviews", label: "Reviews" },
];

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
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/tas-prep-logo.png"
            alt="TAS Prep"
            width={160}
            height={160}
            className="h-36 w-36 sm:h-40 sm:w-40"
            priority
          />
        </Link>
        <div className="flex flex-1 flex-col items-center gap-2">
          {timers.map((timer) => {
            const countdown = formatCountdown(timer.date, now);
            return (
              <div
                key={timer.label}
                className="flex min-w-[180px] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm sm:min-w-[200px]"
              >
                <span className="text-slate-500">Next {timer.label}:</span>
                <span className="font-mono text-slate-900">
                  {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
                  {countdown.seconds}s
                </span>
              </div>
            );
          })}
        </div>
        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/auth"
          className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}
