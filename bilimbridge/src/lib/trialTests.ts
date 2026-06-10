export const TRIAL_SLUGS = ["nis", "bil", "rfmsh"] as const;
export type TrialSlug = (typeof TRIAL_SLUGS)[number];

/** Русские школы (РШ) или казахские школы (КШ) — какой набор файлов пробника. */
export const TRIAL_TRACKS = ["rsh", "ksh"] as const;
export type TrialSchoolTrack = (typeof TRIAL_TRACKS)[number];

export type TrialSectionDef = {
  id: string;
  titleRu: string;
  titleKk: string;
  files: Record<TrialSchoolTrack, string>;
};

/** Разделы пробника: порядок файлов задаётся массивом. */
export const TRIAL_SECTIONS: Record<TrialSlug, TrialSectionDef[]> = {
  nis: [
    {
      id: "matem",
      titleRu: "Математика",
      titleKk: "Математика",
      files: { rsh: "МАТ ПР НИШ РУС.json", ksh: "МАТ НИШ КЗ ПР.json" },
    },
    {
      id: "kolhar",
      titleRu: "Количественные характеристики",
      titleKk: "Сандық сипаттамалар",
      files: { rsh: "КХ ПР НИШ РУС.json", ksh: "КХ НИШ КЗ ПР.json" },
    },
    {
      id: "estestvoznanie",
      titleRu: "Естествознание",
      titleKk: "Жаратылыстану",
      files: {
        rsh: "ЕСТЕСТВОЗНАНИЕ НИШ ДЛЯ ПРОБНИКА.json",
        ksh: "ЕСТЕСТВОЗНАНИЕ НИШ ДЛЯ ПРОБНИКА.json",
      },
    },
    {
      id: "kaz-lang",
      titleRu: "Казахский язык",
      titleKk: "Қазақ тілі",
      files: { rsh: "КАЗЯЗ РШ ПР НИШ.json", ksh: "КАЗЯЗ КШ ПР НИШ.json" },
    },
    {
      id: "rus-reading",
      titleRu: "Русский язык",
      titleKk: "Орыс тілі",
      files: {
        rsh: "РУССКИЙ НИШ ДЛЯ ПРОБНИКА русские школы.json",
        ksh: "РУССКИЙ НИШ ДЛЯ ПРОБНИКА каз школы.json",
      },
    },
    {
      id: "english",
      titleRu: "Английский язык",
      titleKk: "Ағылшын тілі",
      files: {
        rsh: "АНГЛИЙСКИЙ НИШ ДЛЯ ПРОБНИКА.json",
        ksh: "АНГЛИЙСКИЙ НИШ ДЛЯ ПРОБНИКА.json",
      },
    },
  ],
  bil: [
    {
      id: "matem",
      titleRu: "Математика",
      titleKk: "Математика",
      files: { rsh: "МАТ КТЛ ПР РУС.json", ksh: "МАТ КТЛ КЗ ПР.json" },
    },
    {
      id: "reading",
      titleRu: "Грамотность чтения",
      titleKk: "Оқу сауаттылығы",
      files: { rsh: "ГЧ КТЛ РШ ПР.json", ksh: "ГЧ КТЛ КШ ПР.json" },
    },
  ],
  rfmsh: [
    {
      id: "matem",
      titleRu: "Математика",
      titleKk: "Математика",
      files: { rsh: "МАТ РФМШ ДОП РУС.json", ksh: "МАТ РФМШ КЗ ПР.json" },
    },
  ],
};

export function isTrialSlug(value: string): value is TrialSlug {
  return (TRIAL_SLUGS as readonly string[]).includes(value);
}

export function isTrialTrack(value: string): value is TrialSchoolTrack {
  return (TRIAL_TRACKS as readonly string[]).includes(value);
}

export function getTrialSections(slug: TrialSlug): TrialSectionDef[] {
  return TRIAL_SECTIONS[slug];
}

export function getSectionTitle(section: TrialSectionDef, language: "ru" | "kk"): string {
  return language === "kk" ? section.titleKk : section.titleRu;
}

export function getSectionFile(section: TrialSectionDef, track: TrialSchoolTrack): string {
  return section.files[track];
}
