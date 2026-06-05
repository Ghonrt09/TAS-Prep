import { getCategoryBySlug, type BankCategory } from "@/lib/bankCategories";

export const TRIAL_SLUGS = ["nis", "bil", "rfmsh"] as const;
export type TrialSlug = (typeof TRIAL_SLUGS)[number];

/** Категории банка вопросов для каждого пробного теста (RU / KZ). */
const TRIAL_CATEGORY_SLUG: Record<TrialSlug, { ru: string; kk: string }> = {
  nis: { ru: "rus-yaz-rsh-nish", kk: "matem-nish-kaz" },
  bil: { ru: "gch-ktl-rus", kk: "matem-ktl-kaz" },
  rfmsh: { ru: "matem-rfmsh-rus", kk: "matem-rfmsh-kaz" },
};

export function isTrialSlug(value: string): value is TrialSlug {
  return (TRIAL_SLUGS as readonly string[]).includes(value);
}

export function getTrialCategory(
  slug: TrialSlug,
  language: "ru" | "kk"
): BankCategory | undefined {
  const slugs = TRIAL_CATEGORY_SLUG[slug];
  const categorySlug = language === "kk" ? slugs.kk : slugs.ru;
  return getCategoryBySlug(categorySlug);
}
