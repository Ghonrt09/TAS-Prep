import { getCategoryBySlug, type BankCategory } from "@/lib/bankCategories";

export const TRIAL_SLUGS = ["nis", "bil", "rfmsh"] as const;
export type TrialSlug = (typeof TRIAL_SLUGS)[number];

export type TrialSectionDef = {
  id: string;
  titleRu: string;
  titleKk: string;
  categorySlugs: { ru: string; kk: string };
};

/** Разделы полного пробного экзамена по каждому направлению. */
export const TRIAL_SECTIONS: Record<TrialSlug, TrialSectionDef[]> = {
  nis: [
    {
      id: "rus-reading",
      titleRu: "Русский язык (грамотность чтения)",
      titleKk: "Орыс тілі (оқу сауаттылығы)",
      categorySlugs: { ru: "rus-yaz-rsh-nish", kk: "rus-yaz-ksh-nish" },
    },
    {
      id: "kaz-lang",
      titleRu: "Казахский язык",
      titleKk: "Қазақ тілі",
      categorySlugs: { ru: "kaz-yz-rsh-nish", kk: "kaz-yz-ksh-nish" },
    },
    {
      id: "english",
      titleRu: "Английский язык",
      titleKk: "Ағылшын тілі",
      categorySlugs: { ru: "english-nish", kk: "english-nish" },
    },
    {
      id: "estestvoznanie",
      titleRu: "Естествознание",
      titleKk: "Жаратылыстану",
      categorySlugs: { ru: "estestvoznanie-nish", kk: "estestvoznanie-nish" },
    },
    {
      id: "kolhar",
      titleRu: "Количественные характеристики",
      titleKk: "Сандық сипаттамалар",
      categorySlugs: { ru: "kolhar-nish-rus", kk: "kolhar-nish-kaz" },
    },
    {
      id: "matem",
      titleRu: "Математика",
      titleKk: "Математика",
      categorySlugs: { ru: "matem-nis-rus", kk: "matem-nish-kaz" },
    },
  ],
  bil: [
    {
      id: "reading",
      titleRu: "Грамотность чтения",
      titleKk: "Оқу сауаттылығы",
      categorySlugs: { ru: "gch-ktl-rus", kk: "gch-ktl-kaz" },
    },
    {
      id: "matem",
      titleRu: "Математика",
      titleKk: "Математика",
      categorySlugs: { ru: "matem-ktl-rus", kk: "matem-ktl-kaz" },
    },
  ],
  rfmsh: [
    {
      id: "matem",
      titleRu: "Математика",
      titleKk: "Математика",
      categorySlugs: { ru: "matem-rfmsh-rus", kk: "matem-rfmsh-kaz" },
    },
  ],
};

export function isTrialSlug(value: string): value is TrialSlug {
  return (TRIAL_SLUGS as readonly string[]).includes(value);
}

export function getTrialSections(slug: TrialSlug): TrialSectionDef[] {
  return TRIAL_SECTIONS[slug];
}

export function getSectionCategory(
  section: TrialSectionDef,
  language: "ru" | "kk"
): BankCategory | undefined {
  const slug = language === "kk" ? section.categorySlugs.kk : section.categorySlugs.ru;
  return getCategoryBySlug(slug);
}

export function getSectionTitle(section: TrialSectionDef, language: "ru" | "kk"): string {
  return language === "kk" ? section.titleKk : section.titleRu;
}
