"use client";

import { useMemo, useState } from "react";

export default function ScoreCalculatorPage() {
  const [correct, setCorrect] = useState(20);
  const [incorrect, setIncorrect] = useState(5);
  const [skipped, setSkipped] = useState(5);

  const totalScore = useMemo(
    () => correct * 4 - incorrect,
    [correct, incorrect]
  );

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Калькулятор баллов
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Правила БИЛ: +4 за правильный, −1 за неправильный, 0 за пропуск.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="flex flex-col gap-4 text-sm text-slate-700">
            <label className="flex flex-col gap-2">
              Правильные ответы
              <input
                type="number"
                min={0}
                value={correct}
                onChange={(event) =>
                  setCorrect(Math.max(0, Number(event.target.value)))
                }
                className="rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              Неправильные ответы
              <input
                type="number"
                min={0}
                value={incorrect}
                onChange={(event) =>
                  setIncorrect(Math.max(0, Number(event.target.value)))
                }
                className="rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              Пропущенные вопросы
              <input
                type="number"
                min={0}
                value={skipped}
                onChange={(event) =>
                  setSkipped(Math.max(0, Number(event.target.value)))
                }
                className="rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>
          </form>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Оценка баллов
          </p>
          <div className="mt-4 text-4xl font-semibold text-slate-900">
            {totalScore} баллов
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Всего отвечено: {correct + incorrect} · Пропущено: {skipped}
          </p>
          <div className="mt-6 rounded-2xl bg-white p-4 text-sm text-slate-600">
            Старайтесь меньше пропускать и отвечать точнее, чтобы набрать больше.
          </div>
        </div>
      </div>
    </section>
  );
}
