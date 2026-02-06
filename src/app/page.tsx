"use client";

import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  const features = [
    { title: t("feature1Title"), description: t("feature1Body") },
    { title: t("feature2Title"), description: t("feature2Body") },
    { title: t("feature3Title"), description: t("feature3Body") },
  ];

  const examCards = [
    {
      title: t("examNisTitle"),
      detail: t("examNisDetail"),
      badge: t("examNisBadge"),
    },
    {
      title: t("examBilTitle"),
      detail: t("examBilDetail"),
      badge: t("examBilBadge"),
    },
    {
      title: t("examRfmshTitle"),
      detail: t("examRfmshDetail"),
      badge: t("examRfmshBadge"),
    },
  ];

  return (
    <div className="bg-slate-50">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full bg-amber-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
            {t("heroBadge")}
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            {t("heroBody")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/practice"
              className="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              {t("heroCtaPractice")}
            </Link>
            <Link
              href="/question-bank"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              {t("heroCtaQuestionBank")}
            </Link>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
                {t("sectionBadge")}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                {t("sectionTitle")}
              </h2>
            </div>
            <div className="flex gap-3">
              <Link
                href="/score-calculator"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-700"
              >
                {t("sectionCalculator")}
              </Link>
              <Link
                href="/score-predictor"
                className="rounded-full border border-blue-200 px-5 py-2 text-sm font-semibold text-blue-700"
              >
                {t("sectionPredictor")}
              </Link>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {examCards.map((exam) => (
              <div
                key={exam.title}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {exam.badge}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {exam.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{exam.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            {t("instructionsTitle")}
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {t("nisTitle")}
              </h3>
              <div className="mt-4 space-y-4 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900">
                    {t("nisDay1Title")}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>{t("nisDay1Item1")}</li>
                    <li>{t("nisDay1Item2")}</li>
                    <li>{t("nisDay1Item3")}</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {t("nisDay2Title")}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>{t("nisDay2Item1")}</li>
                    <li>{t("nisDay2Item2")}</li>
                    <li>{t("nisDay2Item3")}</li>
                  </ul>
                  <p className="mt-2">
                    {t("nisDay2Note")}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {t("bilTitle")}
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">
                  {t("bilRoundTitle")}
                </p>
                <p>{t("bilIntro")}</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>{t("bilItem1")}</li>
                  <li>{t("bilItem2")}</li>
                  <li>{t("bilItem3")}</li>
                  <li>{t("bilItem4")}</li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {t("rfmshTitle")}
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <ul className="list-disc space-y-1 pl-5">
                  <li>{t("rfmshItem1")}</li>
                  <li>{t("rfmshItem2")}</li>
                  <li>{t("rfmshItem3")}</li>
                  <li>{t("rfmshItem4")}</li>
                </ul>
                <div>
                  <p className="font-semibold text-slate-900">
                    {t("rfmshScoreTitle")}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>{t("rfmshScoreItem1")}</li>
                    <li>{t("rfmshScoreItem2")}</li>
                    <li>{t("rfmshScoreItem3")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_2.5fr] lg:px-8">
          <div className="space-y-4">
            <p className="text-lg font-semibold text-slate-900">
              BilimBridge
            </p>
            <p className="text-sm text-slate-600">
              {t("footerAbout")}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {t("footerServices")}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/practice" className="hover:text-blue-700">
                    {t("footerServicePractice")}
                  </Link>
                </li>
                <li>
                  <Link href="/question-bank" className="hover:text-blue-700">
                    {t("footerServiceBank")}
                  </Link>
                </li>
                <li>
                  <Link href="/score-calculator" className="hover:text-blue-700">
                    {t("footerServiceCalculator")}
                  </Link>
                </li>
                <li>
                  <Link href="/score-predictor" className="hover:text-blue-700">
                    {t("footerServicePredictor")}
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="hover:text-blue-700">
                    {t("footerServiceReviews")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {t("footerResources")}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>{t("footerResourceTips")}</li>
                <li>{t("footerResourcePlan")}</li>
                <li>{t("footerResourceParents")}</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {t("footerContacts")}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>{t("footerContactInstagram")}</li>
                <li>{t("footerContactTelegram")}</li>
                <li>{t("footerContactEmail")}</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
