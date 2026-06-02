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
/** Строка вида «3. B» в блоке ключей — не путать с вопросом. */
const QUESTION_NUM_REGEX = /^(\d+)\.\s*([A-EА-Е])\b/;
const KEY_SECTION_MARK = /КЛЮЧИ\s+И\s+ПОЯСНЕНИЯ|КЛЮЧИ\s+ОТВЕТОВ|КЛЮЧИ\s+И\s+ПОЯСНЕНИЯМИ/i;
const KEY_ENTRY_RE = /(\d+)\.\s*([A-EА-Е])\s*(?:\(([^)]*)\))?\s*\.?\s*/gi;
const KEY_LETTER_ONLY_RE = /\b([A-EА-Е])\s*\(([^)]*)\)\s*\.?\s*/g;
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

    const page = item.page_id ?? 0;
    if (KEY_SECTION_MARK.test(text)) return;
    if (page >= 10 && QUESTION_NUM_REGEX.test(text)) return;

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

/** Собирает текст блока ключей с конца PDF (страницы 10–12 и т.п.). */
function extractAnswerKeyBlob(detail: DetailItem[]): string {
  const parts: string[] = [];
  let inKey = false;

  for (const item of detail) {
    const text = (item.text ?? "").trim();
    if (!text) continue;

    const page = item.page_id ?? 0;
    const keyIdx = text.search(KEY_SECTION_MARK);

    if (keyIdx >= 0) {
      inKey = true;
      parts.push(text.slice(keyIdx));
      continue;
    }

    if (inKey || page >= 11) {
      parts.push(text);
      inKey = true;
      continue;
    }

    if (page === 10 && /Часть\s+1\s*\(|^\d+\.\s*[A-EА-Е]\s*\(/m.test(text)) {
      parts.push(text);
      inKey = true;
    }
  }

  return parts.join("\n");
}

/** Парсит слепленный блок «3. B (4). … 4. B (48). …» из Матем НИШ РУС. */
function parseAnswerKeyBlob(blob: string): Map<number, { letter: string; explanation: string }> {
  const map = new Map<number, { letter: string; explanation: string }>();
  if (!blob.trim()) return map;

  const partStart = blob.search(/Часть\s+1\s*\(|КЛЮЧИ\s+И\s+ПОЯСНЕНИЯ/i);
  const content = partStart >= 0 ? blob.slice(partStart) : blob;

  const firstNumbered = content.search(/\b3\.\s*[A-EА-Е]\s*[\(.]/i);
  const preamble = firstNumbered > 0 ? content.slice(0, firstNumbered) : "";

  let implicitNum = 1;
  let lm: RegExpExecArray | null;
  KEY_LETTER_ONLY_RE.lastIndex = 0;
  while ((lm = KEY_LETTER_ONLY_RE.exec(preamble)) !== null) {
    const letter = normalizeLetter(lm[1]);
    const short = lm[2].trim();
    const explStart = lm.index + lm[0].length;
    const next = preamble.slice(explStart).search(/\b[A-EА-Е]\s*\(/);
    const explEnd = next >= 0 ? explStart + next : preamble.length;
    let expl = preamble.slice(explStart, explEnd).trim().replace(/^\.\s*/, "");
    if (short) expl = short + (expl ? ". " + expl : "");
    if (!map.has(implicitNum)) {
      map.set(implicitNum, { letter, explanation: expl });
      implicitNum++;
    }
  }

  const hits: { num: number; letter: string; paren?: string; end: number; start: number }[] = [];
  let m: RegExpExecArray | null;
  KEY_ENTRY_RE.lastIndex = 0;
  while ((m = KEY_ENTRY_RE.exec(content)) !== null) {
    const num = parseInt(m[1], 10);
    if (num < 1) continue;
    if (num <= 2 && !m[3] && !/[A-EА-Е]\s*\(/.test(m[0])) continue;
    hits.push({
      num,
      letter: normalizeLetter(m[2]),
      paren: m[3],
      start: m.index,
      end: KEY_ENTRY_RE.lastIndex,
    });
  }

  for (let i = 0; i < hits.length; i++) {
    const h = hits[i];
    const explStart = h.end;
    const explEnd = i + 1 < hits.length ? hits[i + 1].start : content.length;
    let expl = content.slice(explStart, explEnd).trim().replace(/^\.\s*/, "");
    if (h.paren) {
      const tail = expl && !expl.startsWith(h.paren) ? ". " + expl : "";
      expl = h.paren + tail;
    }
    const prev = map.get(h.num);
    if (!prev || expl.length >= (prev.explanation?.length ?? 0)) {
      map.set(h.num, { letter: h.letter, explanation: expl });
    }
  }

  return map;
}

function buildAnswerKey(detail: DetailItem[]): Map<number, { letter: string; explanation: string }> {
  const fromBlob = parseAnswerKeyBlob(extractAnswerKeyBlob(detail));
  if (fromBlob.size >= 10) return fromBlob;

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

  fromBlob.forEach((v, k) => {
    if (!map.has(k) || (v.explanation?.length ?? 0) > (map.get(k)?.explanation?.length ?? 0)) {
      map.set(k, v);
    }
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
