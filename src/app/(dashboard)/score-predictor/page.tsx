"use client";

import { useMemo, useState } from "react";

export default function ScorePredictorPage() {
  const [accuracy, setAccuracy] = useState(75);
  const [totalQuestions, setTotalQuestions] = useState(50);

  const predicted = useMemo(() => {
    const clampedAccuracy = Math.min(100, Math.max(0, accuracy));
    const correct = Math.round((totalQuestions * clampedAccuracy) / 100);
    const incorrect = Math.max(0, totalQuestions - correct);
    return {
      correct,
      incorrect,
      score: correct * 4 - incorrect,
    };
  }, [accuracy, totalQuestions]);

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Прогноз баллов
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Оцените результат по вашей недавней точности.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="flex flex-col gap-4 text-sm text-slate-700">
            <label className="flex flex-col gap-2">
              Точность (%) за последнее время
              <input
                type="number"
                min={0}
                max={100}
                value={accuracy}
                onChange={(event) =>
                  setAccuracy(Number(event.target.value))
                }
                className="rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              Всего вопросов в тесте
              <input
                type="number"
                min={10}
                value={totalQuestions}
                onChange={(event) =>
                  setTotalQuestions(Math.max(10, Number(event.target.value)))
                }
                className="rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>
          </form>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Прогноз
          </p>
          <div className="mt-4 text-4xl font-semibold text-slate-900">
            {predicted.score} баллов
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Правильно: {predicted.correct} · Неправильно: {predicted.incorrect}
          </p>
          <div className="mt-6 rounded-2xl bg-white p-4 text-sm text-slate-600">
            Используйте это, чтобы поставить реальную цель на следующий тест.
          </div>
        </div>
      </div>
    </section>
  );
}
