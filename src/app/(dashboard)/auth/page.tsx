"use client";

import AuthButton from "@/components/AuthButton";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthPage() {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("authTitle")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t("authSubtitle")}
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {t("authContinue")}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {t("authBody")}
        </p>
        <div className="mt-4">
          <AuthButton />
        </div>
        <p className="mt-4 text-xs text-slate-500">
          {t("authFooter")}
        </p>
      </div>
    </section>
  );
}
