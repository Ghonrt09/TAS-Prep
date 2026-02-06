"use client";

import Link from "next/link";

const sections = [
  { href: "/practice", label: "Пробные тесты" },
  { href: "/question-bank", label: "Банк вопросов" },
  { href: "/score-calculator", label: "Калькулятор баллов" },
  { href: "/score-predictor", label: "Прогноз баллов" },
  { href: "/reviews", label: "Отзывы" },
];

export default function Sidebar() {
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
              {section.label}
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
              {section.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-blue-50 p-4 text-xs text-blue-700">
          Отслеживайте прогресс и готовьтесь к экзаменам увереннее.
        </div>
      </aside>

    </>
  );
}
