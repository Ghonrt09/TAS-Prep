import type { BankCategory } from "@/lib/bankCategories";
import { parseMatemNisDetail } from "@/lib/parseMatemNisDetail";
import { parseLinesFormat, type BankBlock, type ParsedQuestion } from "@/lib/parseLinesJson";
import { bankJsonToLines } from "@/lib/segmentsToLines";

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

/** Вопросы с текстом для чтения, который идёт перед ними в probnik. */
export function buildTrialQuestionItems(
  questions: ParsedQuestion[],
  blocks: BankBlock[]
): TrialQuestionItem[] {
  if (blocks.length === 0) {
    return questions.map((question, index) => ({
      question,
      questionNumber: index + 1,
      passage: question.passage,
    }));
  }

  const items: TrialQuestionItem[] = [];
  let pendingPassage: string | undefined;

  for (const block of blocks) {
    if (block.type === "passage") {
      pendingPassage = pendingPassage
        ? `${pendingPassage}\n\n${block.text}`
        : block.text;
      continue;
    }

    const question = block.question;
    items.push({
      question,
      questionNumber: questions.indexOf(question) + 1,
      passage: pendingPassage ?? question.passage,
    });
    pendingPassage = undefined;
  }

  return items;
}

export function questionKey(question: ParsedQuestion, questionNumber: number): string {
  return (question.id ?? questionNumber).toString();
}
