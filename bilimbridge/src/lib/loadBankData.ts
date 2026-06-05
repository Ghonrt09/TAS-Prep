import type { BankCategory } from "@/lib/bankCategories";
import { parseMatemNisDetail } from "@/lib/parseMatemNisDetail";
import { parseLinesFormat, type BankBlock, type ParsedQuestion } from "@/lib/parseLinesJson";
import { bankJsonToLines } from "@/lib/segmentsToLines";
import type { TrialSectionDef } from "@/lib/trialTests";
import { getSectionCategory, getSectionTitle } from "@/lib/trialTests";

export type BankLoadResult = {
  questions: ParsedQuestion[];
  blocks: BankBlock[];
};

export async function fetchBankData(category: BankCategory): Promise<BankLoadResult> {
  const url = "/data/" + encodeURIComponent(category.file);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Файл не найден");

  const json = await res.json();

  if (category.format === "detail") {
    const { questions } = parseMatemNisDetail(json);
    return { questions, blocks: [] };
  }

  const lines = bankJsonToLines(json);
  const { questions, blocks } = parseLinesFormat({ lines });
  return { questions, blocks: blocks ?? [] };
}

export type TrialQuestionItem = {
  question: ParsedQuestion;
  questionNumber: number;
  passage?: string;
};

/** Один текст для чтения остаётся у всех следующих вопросов, пока не появится новый текст. */
export function buildTrialQuestionItems(
  questions: ParsedQuestion[],
  blocks: BankBlock[]
): TrialQuestionItem[] {
  if (blocks.length === 0) {
    let activePassage: string | undefined;
    return questions.map((question, index) => {
      if (question.passage?.trim()) activePassage = question.passage;
      return {
        question,
        questionNumber: index + 1,
        passage: activePassage,
      };
    });
  }

  const items: TrialQuestionItem[] = [];
  let activePassage: string | undefined;

  for (const block of blocks) {
    if (block.type === "passage") {
      activePassage = block.text;
      continue;
    }

    const question = block.question;
    items.push({
      question,
      questionNumber: questions.indexOf(question) + 1,
      passage: activePassage ?? question.passage,
    });
  }

  return items;
}

export function questionKey(question: ParsedQuestion, questionNumber: number): string {
  return (question.id ?? questionNumber).toString();
}

export type TrialFlatItem = TrialQuestionItem & {
  globalIndex: number;
  sectionId: string;
  sectionTitle: string;
  answerKey: string;
};

export type LoadedTrialSection = {
  section: TrialSectionDef;
  title: string;
  items: TrialQuestionItem[];
};

export async function loadTrialExam(
  sections: TrialSectionDef[],
  language: "ru" | "kk"
): Promise<LoadedTrialSection[]> {
  const loaded: LoadedTrialSection[] = [];

  for (const section of sections) {
    const category = getSectionCategory(section, language);
    if (!category) continue;

    const { questions, blocks } = await fetchBankData(category);
    const items = buildTrialQuestionItems(questions, blocks);
    if (items.length === 0) continue;

    loaded.push({
      section,
      title: getSectionTitle(section, language),
      items,
    });
  }

  return loaded;
}

export function flattenTrialSections(sections: LoadedTrialSection[]): TrialFlatItem[] {
  const flat: TrialFlatItem[] = [];
  let globalIndex = 0;

  for (const { section, title, items } of sections) {
    for (const item of items) {
      const key = `${section.id}:${questionKey(item.question, item.questionNumber)}`;
      flat.push({
        ...item,
        globalIndex,
        sectionId: section.id,
        sectionTitle: title,
        answerKey: key,
      });
      globalIndex += 1;
    }
  }

  return flat;
}
