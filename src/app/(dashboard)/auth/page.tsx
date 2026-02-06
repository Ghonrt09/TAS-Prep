import AuthButton from "@/components/AuthButton";

export default function AuthPage() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Вход</h1>
        <p className="mt-2 text-sm text-slate-600">
          Вход через Google включен для проверки MVP.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Продолжить с Google
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Войдите, чтобы сохранять прогресс и синхронизировать устройство.
        </p>
        <div className="mt-4">
          <AuthButton />
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Полная интеграция OAuth будет добавлена после проверки MVP.
        </p>
      </div>
    </section>
  );
}
