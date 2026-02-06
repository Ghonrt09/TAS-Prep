"use client";

import Image from "next/image";

import { useAuth } from "@/context/AuthContext";

export default function AuthButton() {
  const { user, loading, error, signInWithGoogle, signOutUser } = useAuth();

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
        Loading authentication...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {user ? (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName ?? "User avatar"}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {user.displayName?.charAt(0) ?? "U"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {user.displayName ?? "Student"}
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <button
            onClick={signOutUser}
            className="ml-auto rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      )}
      {error ? (
        <p className="text-xs text-rose-500">Error: {error}</p>
      ) : null}
    </div>
  );
}
