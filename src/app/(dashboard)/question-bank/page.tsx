"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function QuestionBankPage() {
  const { t } = useLanguage();
  const categories = [
    {
      title: t("categoryArithmetic"),
      description: t("categoryArithmeticDesc"),
      questions: 120,
    },
    {
      title: t("categoryAlgebra"),
      description: t("categoryAlgebraDesc"),
      questions: 80,
    },
    {
      title: t("categoryLogic"),
      description: t("categoryLogicDesc"),
      questions: 95,
    },
    {
      title: t("categoryGeometry"),
      description: t("categoryGeometryDesc"),
      questions: 60,
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
          <div
            key={category.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {category.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {category.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>{t("bankQuestions", { value: category.questions })}</span>
              <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                {t("bankOpen")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
