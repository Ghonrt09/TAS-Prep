const reviews = [
  {
    name: "Aigerim K.",
    message: "The mock tests feel realistic and easy to follow.",
  },
  {
    name: "Parent of 6th grader",
    message: "Simple layout and clear progress. We want more math sets.",
  },
];

export default function ReviewsPage() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reviews</h1>
        <p className="mt-2 text-sm text-slate-600">
          Share feedback to help shape the MVP.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-600">"{review.message}"</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              {review.name}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Leave a comment
        </h2>
        <form className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
          <input
            type="text"
            placeholder="Your name"
            className="rounded-xl border border-slate-200 px-3 py-2"
          />
          <textarea
            rows={4}
            placeholder="What should we improve next?"
            className="rounded-xl border border-slate-200 px-3 py-2"
          />
          <button className="w-fit rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
            Send feedback
          </button>
        </form>
      </div>
    </section>
  );
}
