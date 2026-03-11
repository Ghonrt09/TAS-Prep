"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  getUserProgress,
  getOrCreateUserProfile,
  type UserProgress as UserProgressType,
} from "@/lib/userProfile";

export default function ProfilePage() {
  const { user, loading: authLoading, signOutUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgressType | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      if (!authLoading) router.replace("/auth");
      return;
    }
    let cancelled = false;
    (async () => {
      await getOrCreateUserProfile(
        user.uid,
        user.email ?? "",
        user.displayName ?? null
      );
      if (cancelled) return;
      const p = await getUserProgress(user.uid);
      if (!cancelled) setProgress(p ?? null);
      setProfileLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <section className="flex flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          {t("authLoading")}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("profileTitle")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t("profileSubtitle")}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName ?? t("authAvatarAlt")}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700">
              {user.displayName?.charAt(0) ?? user.email?.charAt(0) ?? "U"}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {user.displayName || t("authStudent")}
            </p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={signOutUser}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {t("authSignOut")}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {t("profileProgress")}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {t("profileProgressDesc")}
        </p>
        {profileLoading ? (
          <p className="mt-4 text-sm text-slate-500">{t("authLoading")}</p>
        ) : progress && progress.totalAnswered > 0 ? (
          <div className="mt-4 flex flex-wrap gap-4 rounded-xl bg-slate-50 p-4">
            <span className="text-sm font-medium text-slate-700">
              {t("profileTotal")}: {progress.totalAnswered}
            </span>
            <span className="text-sm font-medium text-emerald-700">
              {t("profileCorrect")}: {progress.correct}
            </span>
            <span className="text-sm font-medium text-rose-600">
              {t("profileIncorrect")}: {progress.incorrect}
            </span>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            {t("profileNoProgress")}
          </p>
        )}
        <Link
          href="/practice"
          className="mt-4 inline-block rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          {t("navPractice")}
        </Link>
      </div>
    </section>
  );
}
