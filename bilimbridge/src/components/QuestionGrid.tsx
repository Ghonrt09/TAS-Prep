"use client";

import { useLanguage } from "@/context/LanguageContext";

export type QuestionGridEntry = {
  globalIndex: number;
  sectionTitle: string;
  sectionId: string;
  questionNumber: number;
  answered: boolean;
};

type QuestionGridProps = {
  entries: QuestionGridEntry[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
};

export default function QuestionGrid({
  entries,
  currentIndex,
  onSelect,
  onClose,
}: QuestionGridProps) {
  const { t } = useLanguage();

  const sections = entries.reduce<{ id: string; title: string; items: QuestionGridEntry[] }[]>(
    (acc, entry) => {
      const last = acc[acc.length - 1];
      if (last && last.id === entry.sectionId) {
        last.items.push(entry);
      } else {
        acc.push({ id: entry.sectionId, title: entry.sectionTitle, items: [entry] });
      }
      return acc;
    },
    []
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
      <div className="flex max-h-[min(90dvh,720px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="text-base font-semibold text-slate-900">{t("practiceQuestionGrid")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            {t("practiceCloseGrid")}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded border-2 border-blue-600 bg-blue-50" />
              {t("practiceGridCurrent")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded border-2 border-emerald-500 bg-emerald-50" />
              {t("practiceGridAnswered")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded border-2 border-slate-300 bg-white" />
              {t("practiceGridSkipped")}
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {sections.map((section) => (
              <div key={section.id}>
                <p className="mb-2 text-sm font-semibold text-slate-800">{section.title}</p>
                <div className="flex flex-wrap gap-2">
                  {section.items.map((entry) => {
                    const isCurrent = entry.globalIndex === currentIndex;
                    const answered = entry.answered;
                    let cls =
                      "flex size-9 items-center justify-center rounded-lg border-2 text-xs font-semibold transition ";
                    if (isCurrent) {
                      cls += "border-blue-600 bg-blue-50 text-blue-800";
                    } else if (answered) {
                      cls += "border-emerald-500 bg-emerald-50 text-emerald-900";
                    } else {
                      cls += "border-slate-300 bg-white text-slate-600 hover:border-blue-300";
                    }
                    return (
                      <button
                        key={entry.globalIndex}
                        type="button"
                        onClick={() => {
                          onSelect(entry.globalIndex);
                          onClose();
                        }}
                        className={cls}
                        title={`${section.title} — ${entry.questionNumber}`}
                      >
                        {entry.questionNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
