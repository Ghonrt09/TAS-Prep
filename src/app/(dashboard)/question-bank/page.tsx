const categories = [
  {
    title: "Арифметика",
    description: "Дроби, проценты и быстрые вычисления.",
    questions: 120,
  },
  {
    title: "Основы алгебры",
    description: "Линейные уравнения и простые задачи.",
    questions: 80,
  },
  {
    title: "Логика и закономерности",
    description: "Последовательности, головоломки и тренировка мышления.",
    questions: 95,
  },
  {
    title: "Геометрия",
    description: "Фигуры, углы и пространственное мышление.",
    questions: 60,
  },
];

export default function QuestionBankPage() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Банк вопросов</h1>
        <p className="mt-2 text-sm text-slate-600">
          Выберите раздел. Контент пополняется каждую неделю.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {category.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {category.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>{category.questions} вопросов</span>
              <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                Открыть
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
