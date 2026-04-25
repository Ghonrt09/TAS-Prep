/**
 * Категории банка вопросов: slug → файл в public/data и название.
 * Файлы из PDF-to-JSON (lines) и существующий Матем НИШ РУС (detail).
 */

export type BankCategory = {
  slug: string;
  file: string;
  title: string;
  titleKk?: string;
  description: string;
  descriptionKk?: string;
  /** Для фильтра вкладками на странице банка вопросов */
  school: "nis" | "bil" | "rfmsh";
  /** 'lines' = PDF-to-JSON с полем lines; 'detail' = Матем НИШ РУС (detail/pages) */
  format: "lines" | "detail";
  /** Примерное кол-во вопросов для отображения в списке (опционально) */
  questionCount?: number;
};

export const bankCategories: BankCategory[] = [
  {
    slug: "matem-nis-rus",
    file: "Матем НИШ РУС.json",
    title: "Математика НИШ (рус)",
    titleKk: "Математика НИШ (орыс)",
    description: "Материалы по математике для подготовки к НИШ.",
    descriptionKk: "НИШ дайындығына арналған математика материалы.",
    school: "nis",
    format: "detail",
  },
  {
    slug: "matem-ktl-rus",
    file: "МАТЕМ КТЛ РУС.json",
    title: "Математика КТЛ (рус)",
    titleKk: "Математика КТЛ (орыс)",
    description: "Пробный тест по математике, блок 1.",
    descriptionKk: "Математика бойынша сынақ тесті, 1-блок.",
    school: "bil",
    format: "lines",
    questionCount: 50,
  },
  {
    slug: "matem-rfmsh-rus",
    file: "МАТЕМ РФМШ РУС.json",
    title: "Математика РФМШ (рус)",
    titleKk: "Математика РФМШ (орыс)",
    description: "Подготовка к экзамену РФМШ по математике.",
    descriptionKk: "РФМШ емтиханына дайындық, математика.",
    school: "rfmsh",
    format: "lines",
  },
  {
    slug: "matem-nish-kaz",
    file: "МАТЕМ НИШ КАЗ.json",
    title: "Математика НИШ (каз)",
    titleKk: "Математика НИШ (қаз)",
    description: "НИШ дайындығы, математика (қазақ тілінде).",
    descriptionKk: "НИШ дайындығы, математика.",
    school: "nis",
    format: "lines",
  },
  {
    slug: "matem-ktl-kaz",
    file: "МАТЕМ КТЛ КАЗ.json",
    title: "Математика КТЛ (каз)",
    titleKk: "Математика КТЛ (қаз)",
    description: "Математика КТЛ, қазақ тілінде.",
    descriptionKk: "Математика КТЛ.",
    school: "bil",
    format: "lines",
  },
  {
    slug: "matem-rfmsh-kaz",
    file: "МАТЕМ РФМШ КАЗ.json",
    title: "Математика РФМШ (каз)",
    titleKk: "Математика РФМШ (қаз)",
    description: "РФМШ математикасы, қазақ тілінде.",
    descriptionKk: "РФМШ математикасы.",
    school: "rfmsh",
    format: "lines",
  },
  {
    slug: "gch-ktl-rus",
    file: "ГЧ КТЛ РУС.json",
    title: "Грамотность чтения КТЛ (рус)",
    titleKk: "Оқу сауаттылығы КТЛ (орыс)",
    description: "Пробный тест по грамотности чтения.",
    descriptionKk: "Оқу сауаттылығы бойынша сынақ тесті.",
    school: "bil",
    format: "lines",
  },
  {
    slug: "gch-ktl-kaz",
    file: "ГЧ КТЛ КАЗ.json",
    title: "Грамотность чтения КТЛ (каз)",
    titleKk: "Оқу сауаттылығы КТЛ (қаз)",
    description: "Грамотность чтения, қазақ тілінде.",
    descriptionKk: "Оқу сауаттылығы КТЛ.",
    school: "bil",
    format: "lines",
  },
  {
    slug: "kaz-yz-ksh-nish",
    file: "КАЗ ЯЗ КШ НИШ.json",
    title: "Қазақ тілі КШ НИШ",
    titleKk: "Қазақ тілі КШ НИШ",
    description: "Пробный тест по казахскому языку (НИШ, казахские классы).",
    descriptionKk: "Қазақ тілі бойынша сынақ тесті (НИШ, қазақ сыныптары).",
    school: "nis",
    format: "lines",
  },
  {
    slug: "kaz-yz-rsh-nish",
    file: "КАЗ ЯЗ РШ НИШ.json",
    title: "Қазақ тілі РШ НИШ",
    titleKk: "Қазақ тілі РШ НИШ",
    description: "Пробный тест по казахскому языку (русские классы).",
    descriptionKk: "Қазақ тілі бойынша сынақ тесті (орыс сыныптары).",
    school: "nis",
    format: "lines",
  },
  {
    slug: "kolhar-nish-kaz",
    file: "КОЛХАР НИШ КАЗ.json",
    title: "Количественные характеристики НИШ (каз)",
    titleKk: "Сандық сипаттамалар НИШ (қаз)",
    description: "Пробный тест по количественным характеристикам, қазақ тілінде.",
    descriptionKk: "Сандық сипаттамалар бойынша сынақ тесті.",
    school: "nis",
    format: "lines",
  },
  {
    slug: "kolhar-nish-rus",
    file: "КОЛХАР НИШ РУС.json",
    title: "Количественные характеристики НИШ (рус)",
    titleKk: "Сандық сипаттамалар НИШ (орыс)",
    description: "Пробный тест по количественным характеристикам, русский язык.",
    descriptionKk: "Сандық сипаттамалар бойынша сынақ тесті (орыс).",
    school: "nis",
    format: "lines",
  },
];

export function getCategoryBySlug(slug: string): BankCategory | undefined {
  return bankCategories.find((c) => c.slug === slug);
}
