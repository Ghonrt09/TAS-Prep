import { mockQuestions, type MockQuestion } from "@/lib/mockQuestions";

export const TRIAL_SLUGS = ["nis", "bil", "rfmsh"] as const;
export type TrialSlug = (typeof TRIAL_SLUGS)[number];

function remapIds(questions: MockQuestion[], baseId: number): MockQuestion[] {
  return questions.map((q, i) => ({ ...q, id: baseId + i }));
}

export function isTrialSlug(value: string): value is TrialSlug {
  return (TRIAL_SLUGS as readonly string[]).includes(value);
}

/** Для каждого направления — свой набор из 10 вопросов с уникальными id внутри сессии. */
export function getTrialQuestions(slug: TrialSlug): MockQuestion[] {
  const sets: Record<TrialSlug, MockQuestion[]> = {
    nis: mockQuestions.slice(0, 10),
    bil: mockQuestions.slice(10, 20),
    rfmsh: [...mockQuestions.slice(14, 20), ...mockQuestions.slice(0, 4)],
  };
  const baseId: Record<TrialSlug, number> = { nis: 1, bil: 101, rfmsh: 201 };
  return remapIds(sets[slug], baseId[slug]);
}

