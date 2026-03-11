"use client";

import { useState } from "react";

import AuthButton from "@/components/AuthButton";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

type Tab = "signin" | "register";

export default function AuthPage() {
  const { t } = useLanguage();
  const {
    signUpWithEmail,
    signInWithEmail,
    clearError,
    error,
  } = useAuth();
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (tab === "register") {
      if (password !== confirmPassword) {
        return; // show error via context or local state
      }
      signUpWithEmail(email.trim(), password, displayName.trim() || undefined);
    } else {
      signInWithEmail(email.trim(), password);
    }
  };

  const switchTab = (newTab: Tab) => {
    setTab(newTab);
    clearError();
    setPassword("");
    setConfirmPassword("");
  }

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

      <div className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => switchTab("signin")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            tab === "signin"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {t("authSignIn")}
        </button>
        <button
          type="button"
          onClick={() => switchTab("register")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            tab === "register"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {t("authRegister")}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              {t("authEmail")}
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
          {tab === "register" && (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {t("authDisplayName")}
              </span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
          )}
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              {t("authPassword")}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={tab === "register" ? 6 : undefined}
              autoComplete={tab === "register" ? "new-password" : "current-password"}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
          {tab === "register" && (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {t("authConfirmPassword")}
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {password && confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-rose-500">
                  {t("authPasswordMismatch")}
                </p>
              )}
            </label>
          )}
          <button
            type="submit"
            disabled={tab === "register" && password !== confirmPassword}
            className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {tab === "register" ? t("authRegister") : t("authSignIn")}
          </button>
        </form>
        {error && (
          <p className="mt-3 text-xs text-rose-500">{t("authError", { error })}</p>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="h-px flex-1 bg-slate-200" />
        {t("authOr")}
        <span className="h-px flex-1 bg-slate-200" />
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
