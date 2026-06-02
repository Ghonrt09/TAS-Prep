import type { ParsedQuestion } from "@/lib/parseLinesJson";

type DetailItem = {
  position?: number;
  paragraph_id?: string;
  page_id?: number;
  text?: string;
  tags?: string[];
  type?: string;
};

type QuestionItem = {
  id?: number;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  passage?: string;
};

export type MathemNisJson =
  | {
      detail?: unknown;
      pages?: Array<{
        page_id?: number;
        content?: Array<{ id?: number; text?: string }>;
      }>;
    }
  | QuestionItem[];

const LETTER_MAP: Record<string, string> = {
  А: "A",
  Б: "B",
  В: "C",
  Г: "D",
  Д: "E",
  Е: "E",
};

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];

const ANSWER_KEY_REGEX = /^(\d+)\.\s*([A-EА-Е])\s*[).]?\s*(.*)/;
const QUESTION_NUM_REGEX = /^(\d+)\.\s*([A-EА-Е])\b/;
const EXAM_HEADER_REGEX =
  /^(ПРОБНЫЙ ТЕСТ|БЛОК\s+\d|вопросов\.|Время выполнения|Рекомендуемое время|минут\.?)\s*$/i;
const EXAM_HEADER_LONG =
  /^\d+\s*вопросов\.\s*Время выполнения:\s*\d+\s*минут/i;

function normalizeLetter(raw: string): string {
  const upper = raw.toUpperCase();
  return LETTER_MAP[upper] ?? upper;
}

function detailToArray(data: MathemNisJson): DetailItem[] {
  if (Array.isArray(data)) return [];

  const rawDetail = data.detail;
  let detailArray: DetailItem[] = Array.isArray(rawDetail)
    ? rawDetail
    : rawDetail && typeof rawDetail === "object"
      ? Object.values(rawDetail as Record<string, DetailItem>)
      : [];

  if (detailArray.length === 0 && data.pages) {
    detailArray = data.pages.flatMap((page) =>
      (page.content ?? []).map((c) => ({
        text: c.text,
        page_id: page.page_id,
        paragraph_id: c.id?.toString(),
      }))
    );
  }

  return detailArray;
}

function buildQuestionsFromDetail(detail: DetailItem[]): (DetailItem & QuestionItem)[] {
  const result: (DetailItem & QuestionItem)[] = [];
  let current: (DetailItem & QuestionItem) | null = null;

  detail.forEach((item) => {
    const text = (item.text ?? "").trim();
    if (!text) return;

    const isQuestion = /^\d+[\).\s]/.test(text);
    const isOption = /^[A-EА-Е]\)/.test(text);

    if (QUESTION_NUM_REGEX.test(text)) return;

    const page = item.page_id ?? 0;
    if (page >= 10 && !isQuestion && !isOption) return;

    if (isQuestion) {
      const numMatch = /^(\d+)\s*[.)]\s*/.exec(text);
      const questionText = text.replace(/^\d+\s*[.)]\s*/, "").trim();
      if (EXAM_HEADER_REGEX.test(questionText) || EXAM_HEADER_LONG.test(questionText)) {
        current = null;
        return;
      }
      const questionId = numMatch ? Number(numMatch[1]) : result.length + 1;
      current = {
        ...item,
        id: questionId,
        question: questionText,
        options: [],
      };
      result.push(current);
      return;
    }

    if (isOption && current) {
      const optionText = text.replace(/^[A-EА-Е]\)\s*/, "");
      current.options = [...(current.options ?? []), optionText];
      return;
    }

    result.push({ ...item });
    current = null;
  });

  return result;
}

function buildAnswerKey(detail: DetailItem[]): Map<number, { letter: string; explanation: string }> {
  const map = new Map<number, { letter: string; explanation: string }>();

  detail.forEach((item) => {
    const text = (item.text ?? "").trim();
    const match = ANSWER_KEY_REGEX.exec(text);
    if (!match) return;
    const num = Number(match[1]);
    if (num <= 0) return;
    map.set(num, {
      letter: normalizeLetter(match[2]),
      explanation: (match[3] ?? "").trim(),
    });
  });

  return map;
}

function letterToOptionText(options: string[], letter: string): string {
  const idx = LETTERS.indexOf(letter);
  if (idx >= 0 && idx < options.length) return options[idx];
  return letter;
}

export type MatemNisParseResult = {
  questions: ParsedQuestion[];
  /** Инфо-абзацы между вопросами (заголовки, пояснения без вариантов). */
  infoBlocks: string[];
  answerKeyCount: number;
};

export function parseMatemNisDetail(data: MathemNisJson): MatemNisParseResult {
  if (Array.isArray(data)) {
    const questions: ParsedQuestion[] = data
      .filter((q) => q.question && q.options && q.options.length > 0)
      .map((q, i) => ({
        id: q.id ?? i + 1,
        question: q.question!,
        options: q.options!,
        correctAnswer: q.correctAnswer ?? "",
        explanation: undefined,
      }));
    return { questions, infoBlocks: [], answerKeyCount: 0 };
  }

  const detail = detailToArray(data);
  const list = buildQuestionsFromDetail(detail);
  const answerKey = buildAnswerKey(detail);
  const infoBlocks: string[] = [];
  const questions: ParsedQuestion[] = [];

  list.forEach((item, index) => {
    const q = item as QuestionItem;
    if (!q.question || !q.options?.length) {
      const plain = (item.text ?? "").replace(/^\d+\s*[.)]\s*/, "").trim();
      if (plain && !EXAM_HEADER_REGEX.test(plain) && !EXAM_HEADER_LONG.test(plain)) {
        infoBlocks.push(plain);
      }
      return;
    }

    const id = q.id ?? index + 1;
    const key = answerKey.get(id);
    const correctAnswer = key
      ? letterToOptionText(q.options, key.letter)
      : (q.correctAnswer ?? "");

    questions.push({
      id,
      question: q.question,
      options: q.options,
      correctAnswer,
      explanation: key?.explanation || undefined,
    });
  });

  return {
    questions,
    infoBlocks,
    answerKeyCount: answerKey.size,
  };
}
