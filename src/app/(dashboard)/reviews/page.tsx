"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ReviewsPage() {
  const { t } = useLanguage();
  const reviews = [
    {
      name: t("reviewName1"),
      message: t("reviewMessage1"),
    },
    {
      name: t("reviewName2"),
      message: t("reviewMessage2"),
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("reviewsTitle")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t("reviewsSubtitle")}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-600">"{review.message}"</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              {review.name}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {t("reviewsLeave")}
        </h2>
        <form className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
          <input
            type="text"
            placeholder={t("reviewsNamePlaceholder")}
            className="rounded-xl border border-slate-200 px-3 py-2"
          />
          <textarea
            rows={4}
            placeholder={t("reviewsMessagePlaceholder")}
            className="rounded-xl border border-slate-200 px-3 py-2"
          />
          <button className="w-fit rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
            {t("reviewsSend")}
          </button>
        </form>
      </div>
    </section>
  );
}
