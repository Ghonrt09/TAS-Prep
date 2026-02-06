const categories = [
  {
    title: "Arithmetic",
    description: "Fractions, percentages, and quick calculations.",
    questions: 120,
  },
  {
    title: "Algebra Basics",
    description: "Linear equations and simple word problems.",
    questions: 80,
  },
  {
    title: "Logic & Patterns",
    description: "Sequences, puzzles, and reasoning drills.",
    questions: 95,
  },
  {
    title: "Geometry",
    description: "Shapes, angles, and spatial thinking.",
    questions: 60,
  },
];

export default function QuestionBankPage() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Question Bank</h1>
        <p className="mt-2 text-sm text-slate-600">
          Explore curated categories. Content is expanding weekly.
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
              <span>{category.questions} questions</span>
              <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
