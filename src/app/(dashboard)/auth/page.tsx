import AuthButton from "@/components/AuthButton";

export default function AuthPage() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Sign In</h1>
        <p className="mt-2 text-sm text-slate-600">
          Google sign-in is enabled for MVP validation.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Continue with Google
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Connect to save progress and sync across devices.
        </p>
        <div className="mt-4">
          <AuthButton />
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Full OAuth integration will be added after MVP validation.
        </p>
      </div>
    </section>
  );
}
