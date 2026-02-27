"use client";

import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";

export default function QuestionBankPage() {
  const { t } = useLanguage();
  const categories = [
    {
      title: t("categoryArithmetic"),
      description: t("categoryArithmeticDesc"),
      questions: 120,
      href: "/question-bank",
    },
    {
      title: t("categoryAlgebra"),
      description: t("categoryAlgebraDesc"),
      questions: 80,
      href: "/question-bank",
    },
    {
      title: t("categoryLogic"),
      description: t("categoryLogicDesc"),
      questions: 95,
      href: "/question-bank",
    },
    {
      title: t("categoryGeometry"),
      description: t("categoryGeometryDesc"),
      questions: 60,
      href: "/question-bank",
    },
    {
      title: t("categoryMatemNisRu"),
      description: t("categoryMatemNisRuDesc"),
      questions: 249,
      href: "/question-bank/matem-nis-rus",
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("bankTitle")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t("bankSubtitle")}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="block cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {category.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {category.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>{t("bankQuestions", { value: category.questions })}</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600">
                {t("bankOpen")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
