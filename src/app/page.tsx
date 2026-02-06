import Link from "next/link";

const features = [
  {
    title: "Точная подготовка",
    description:
      "Короткие уроки и практика по НИШ, БИЛ и РФМШ.",
  },
  {
    title: "Понятный прогресс",
    description:
      "Сразу видно, что получается, а где нужно больше практики.",
  },
  {
    title: "Удобно родителям",
    description:
      "Простые отчеты и результаты для родителей.",
  },
];

const examCards = [
  {
    title: "Поступление в НИШ",
    detail: "База по математике и логике",
    badge: "База",
  },
  {
    title: "Поступление в БИЛ",
    detail: "Скорость и точность",
    badge: "Пробный",
  },
  {
    title: "Отбор в РФМШ",
    detail: "Углубленные задания",
    badge: "Скоро",
  },
];

export default function HomePage() {
  return (
    <div className="bg-slate-50">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full bg-amber-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
            MVP для 5–6 классов
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Готовьтесь к НИШ, БИЛ и РФМШ умнее.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            BilimBridge объединяет пробные тесты, банк вопросов и аналитику в
            одной удобной платформе для школьников Казахстана.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/practice"
              className="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Начать практику
            </Link>
            <Link
              href="/question-bank"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Открыть банк вопросов
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
                Готово к тренировкам
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                Все, что нужно для регулярной подготовки.
              </h2>
            </div>
            <div className="flex gap-3">
              <Link
                href="/score-calculator"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-700"
              >
                Калькулятор баллов
              </Link>
              <Link
                href="/score-predictor"
                className="rounded-full border border-blue-200 px-5 py-2 text-sm font-semibold text-blue-700"
              >
                Прогноз баллов
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
            Инструкции и структура экзаменов
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Структура экзамена НИШ
              </h3>
              <div className="mt-4 space-y-4 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900">
                    День 1 (Естественно-математическое направление)
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>
                      Математика: 40 вопросов, 1 час (максимум 400 баллов).
                    </li>
                    <li>
                      Количественные характеристики: 60 вопросов, 30 минут
                      (максимум 300 баллов).
                    </li>
                    <li>
                      Естествознание: 20 вопросов, 30 минут (максимум 200
                      баллов).
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    День 2 (Языковое направление)
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Казахский язык: 20 вопросов, 40 минут.</li>
                    <li>Русский язык: 20 вопросов, 40 минут.</li>
                    <li>Английский язык: 20 вопросов, 40 минут.</li>
                  </ul>
                  <p className="mt-2">
                    Каждый языковой тест оценивается максимум в 200 баллов.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">БИЛ</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">1 тур (Отборочный)</p>
                <p>
                  Это общее тестирование для проверки базовых знаний и логики.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Количество вопросов: 60 вопросов.</li>
                  <li>
                    Предметы: Математика и Логика — 50 вопросов; Грамотность
                    чтения — 10 вопросов (на языке обучения — казахском или
                    русском).
                  </li>
                  <li>Время: 110 минут.</li>
                  <li>
                    Система баллов: За правильный ответ — +4 балла, за
                    неправильный — минус 1 балл (метод штрафных баллов).
                  </li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Формат экзамена (РФМШ)
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Дисциплины: Математика и логика.</li>
                  <li>
                    Тип заданий: «Открытый тест» — без вариантов ответа. Ответ
                    нужно вписать самостоятельно.
                  </li>
                  <li>Количество заданий: 30 вопросов.</li>
                  <li>Длительность: 120 минут (2 часа).</li>
                </ul>
                <div>
                  <p className="font-semibold text-slate-900">
                    Сложность и баллы (всего 150 баллов)
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>10 задач уровня A (базовые) — по 3 балла.</li>
                    <li>10 задач уровня B (средние) — по 5 баллов.</li>
                    <li>10 задач уровня C (сложные) — по 7 баллов.</li>
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
              Подготовка к НИШ, БИЛ и РФМШ с пробными тестами и понятным
              прогрессом.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Сервисы</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/practice" className="hover:text-blue-700">
                    Пробные тесты
                  </Link>
                </li>
                <li>
                  <Link href="/question-bank" className="hover:text-blue-700">
                    Банк вопросов
                  </Link>
                </li>
                <li>
                  <Link href="/score-calculator" className="hover:text-blue-700">
                    Калькулятор баллов
                  </Link>
                </li>
                <li>
                  <Link href="/score-predictor" className="hover:text-blue-700">
                    Прогноз баллов
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="hover:text-blue-700">
                    Отзывы
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Материалы</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Советы по экзаменам</li>
                <li>План занятий на неделю</li>
                <li>Памятка для родителей</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Контакты</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Instagram — скоро</li>
                <li>Telegram — скоро</li>
                <li>Почта: hello@bilimbridge.kz</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
