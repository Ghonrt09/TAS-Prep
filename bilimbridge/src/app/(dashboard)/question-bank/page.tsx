"use client";

import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";
import { bankCategories } from "@/lib/bankCategories";

export default function QuestionBankPage() {
  const { t, language } = useLanguage();

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
        {bankCategories.map((category) => {
          const title = language === "kk" && category.titleKk ? category.titleKk : category.title;
          const description =
            language === "kk" && category.descriptionKk ? category.descriptionKk : category.description;
          const count = category.questionCount ?? 0;
          return (
            <Link
              key={category.slug}
              href={`/question-bank/${category.slug}`}
              className="block cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {description}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{count > 0 ? t("bankQuestions", { value: count }) : "—"}</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600">
                  {t("bankOpen")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
