/**
 * Парсит JSON из PDF-to-JSON с полем "lines": string[].
 * Вопросы: "1. текст", варианты: "A)", "B)", "C)", "D)", "E)".
 * Ключ ответов: "32. B" или "1.B, 2.C, ..." (КОЛХАР).
 * Поддержка: passage (текст до первого вопроса), вопросы без вариантов (РФМШ).
 */

export type ParsedQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  /** Пояснение из ключа ответов (например, Математика КТЛ рус). */
  explanation?: string;
  passage?: string;
};

/** Блок для поочерёдного вывода: текст для заданий или вопрос (ГЧ КТЛ — текст между вопросами). */
export type BankBlock =
  | { type: "passage"; text: string }
  | { type: "question"; question: ParsedQuestion };

const ANSWER_KEY_REGEX = /^(\d+)\.\s*([A-E])\s*($|[(\s])/;
const QUESTION_START_REGEX = /^\d+\.\s+/;
const OPTION_REGEX = /^[A-E]\)\s*/;

const STOP_PHRASES = /^(КЛЮЧИ|КЛЮЧ\s*$|ОТВЕТЫ|ANSWERS|Часть\s+\d|^\d+\.\s*[A-D]\s*,)/i;
const EXAM_HEADER_REGEX = /^(ПРОБНЫЙ ТЕСТ|БЛОК\s+\d|Рекомендуемое время|^\d+\s*вопросов)/i;
/** Начало нового мәтіна/текста для заданий (Қазақ тілі КШ НИШ, ГЧ КТЛ и т.д.) — не приклеивать к вариантам. */
const NEW_PASSAGE_BLOCK_REGEX = /^\d+[-‑]\s*м[әə]тін\s*:/i;
/** Альтернативный формат: «ТЕКСТ 2:», «ТЕКСТ 3:» (Қазақ тілі РШ НИШ). */
const NEW_PASSAGE_TEKST_REGEX = /^ТЕКСТ\s+\d+\s*:/i;

function isNewPassageStart(trimmed: string): boolean {
  return NEW_PASSAGE_BLOCK_REGEX.test(trimmed) || NEW_PASSAGE_TEKST_REGEX.test(trimmed);
}
const BULK_ANSWER_KEY_REGEX = /(\d+)\.([A-D])/g;

function isAnswerKeyLine(line: string): boolean {
  return ANSWER_KEY_REGEX.test(line.trim());
}

function getAnswerKey(lines: string[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const line of lines) {
    const t = line.trim();
    const m = t.match(ANSWER_KEY_REGEX);
    if (m) {
      const num = parseInt(m[1], 10);
      const letter = m[2].toUpperCase();
      if (num > 0) map.set(num, letter);
    }
  }
  return map;
}

function getBulkAnswerKey(lines: string[]): Map<number, string> | null {
  const map = new Map<number, string>();
  const re = /(\d+)\.([A-D])/g;
  for (const line of lines) {
    if (/\d+\.([A-D])\s*,\s*\d+\.([A-D])/.test(line)) {
      let m;
      re.lastIndex = 0;
      while ((m = re.exec(line)) !== null) {
        map.set(parseInt(m[1], 10), m[2].toUpperCase());
      }
    }
  }
  return map.size > 0 ? map : null;
}

const CYRILLIC_TO_LATIN: Record<string, string> = { А: "A", Б: "B", В: "C", Г: "D", Д: "E", Е: "E" };
function normalizeKeyLetter(s: string): string {
  const u = s.toUpperCase();
  return CYRILLIC_TO_LATIN[u] ?? u;
}

/** Начало блока ключей в файле (рус/каз). */
const KEY_SECTION_START =
  /КЛЮЧИ|^КЛЮЧ\s*$|ОТВЕТЫ|ANSWERS|ЖАУАПТАР|ЖАУАП\s+КІЛТТЕРІ|КІЛТТЕРІ\s*\(|ТҮСІНДІРМЕ/i;

/** Строка ключа: "2.  B" или "2.  B (пояснение...". Пробелы после номера. */
const KEY_LINE_ONLY_REGEX = /^\s*(\d+)\.\s*([A-EАБВГДЕ])\s*$/;
const KEY_LINE_WITH_EXPLANATION_REGEX = /^\s*(\d+)\.\s*([A-EАБВГДЕ])\s*\((.+)$/;

function getAnswerKeyWithExplanations(lines: string[]): Map<number, { letter: string; explanation?: string }> {
  const result = new Map<number, { letter: string; explanation?: string }>();
  const keyStart = lines.findIndex((l) => KEY_SECTION_START.test(l.trim()));
  if (keyStart < 0) return result;

  let currentNum = 0;
  let currentLetter = "";
  let currentExpl: string[] = [];

  function flush() {
    if (currentNum > 0 && currentLetter) {
      const explanation = currentExpl.length > 0 ? currentExpl.join(" ").trim() : undefined;
      result.set(currentNum, { letter: normalizeKeyLetter(currentLetter), explanation });
    }
  }

  for (let i = keyStart + 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const onlyKey = trimmed.match(KEY_LINE_ONLY_REGEX);
    const withExpl = trimmed.match(KEY_LINE_WITH_EXPLANATION_REGEX);

    if (onlyKey) {
      flush();
      currentNum = parseInt(onlyKey[1], 10);
      currentLetter = onlyKey[2];
      currentExpl = [];
      continue;
    }
    if (withExpl) {
      flush();
      currentNum = parseInt(withExpl[1], 10);
      currentLetter = withExpl[2];
      currentExpl = [withExpl[3]];
      continue;
    }
    if (currentNum > 0 && trimmed) {
      currentExpl.push(trimmed);
    }
  }
  flush();
  return result;
}

/** Строка ключа РФМШ только с числовым ответом, чтобы не путать с "1.  $x-5=1..." внутри пояснений. */
const NUMERIC_KEY_LINE_REGEX = /^\s*(\d+)\.\s*(\d+(?:[.,]\d+)?)\s*($|\s*\()/;

function getNumericAnswerKey(lines: string[]): Map<number, string> {
  const result = new Map<number, string>();
  const keyStart = lines.findIndex((l) => KEY_SECTION_START.test(l.trim()));
  if (keyStart < 0) return result;

  for (let i = keyStart + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const m = trimmed.match(NUMERIC_KEY_LINE_REGEX);
    if (!m) continue;
    const num = parseInt(m[1], 10);
    const answer = m[2].replace(",", ".");
    if (num > 0) result.set(num, answer);
  }
  return result;
}

/** РФМШ: ключ + пояснения. Ответ — только число; пояснение — текст в скобках и продолжение. */
function getNumericKeyWithExplanations(lines: string[]): Map<number, { answer: string; explanation?: string }> {
  const result = new Map<number, { answer: string; explanation?: string }>();
  const keyStart = lines.findIndex((l) => KEY_SECTION_START.test(l.trim()));
  if (keyStart < 0) return result;

  let currentNum = 0;
  let currentAnswer = "";
  let currentExpl: string[] = [];
  const keyLineWithParen = /^\s*(\d+)\.\s*(\d+(?:[.,]\d+)?)\s*\((.+)$/;
  const keyLineOnly = /^\s*(\d+)\.\s*(\d+(?:[.,]\d+)?)\s*$/;

  function flush() {
    if (currentNum > 0 && currentAnswer !== "") {
      const explanation = currentExpl.length > 0 ? currentExpl.join(" ").trim() : undefined;
      result.set(currentNum, { answer: currentAnswer.replace(",", "."), explanation });
    }
  }

  for (let i = keyStart + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const withParen = trimmed.match(keyLineWithParen);
    const onlyNum = trimmed.match(keyLineOnly);

    if (withParen) {
      flush();
      currentNum = parseInt(withParen[1], 10);
      currentAnswer = withParen[2].replace(",", ".");
      currentExpl = [withParen[3]];
      continue;
    }
    if (onlyNum) {
      flush();
      currentNum = parseInt(onlyNum[1], 10);
      currentAnswer = onlyNum[2].replace(",", ".");
      currentExpl = [];
      continue;
    }
    if (currentNum > 0 && trimmed) currentExpl.push(trimmed);
  }
  flush();
  return result;
}

function isStopLine(trimmed: string): boolean {
  if (!trimmed) return false;
  if (STOP_PHRASES.test(trimmed)) return true;
  if (/^2-Бөлім:|^2-БӨЛІМ:/i.test(trimmed)) return true;
  return false;
}

export function parseLinesFormat(data: { lines?: string[] }): {
  questions: ParsedQuestion[];
  answerKey: Map<number, string>;
  passage: string;
  blocks: BankBlock[];
} {
  const lines = data.lines ?? [];

  const bulkKey = getBulkAnswerKey(lines);
  const answerKey = bulkKey ?? getAnswerKey(lines);
  const keyWithExplanations = getAnswerKeyWithExplanations(lines);
  const numericKey = getNumericAnswerKey(lines);
  const numericKeyWithExpl = getNumericKeyWithExplanations(lines);

  const isKolhar = lines.some((l) =>
    /САНДЫҚ СИПАТТАМАЛАР|А бағаны|В бағаны|Колонка\s*[АA]|Колонка\s*В/i.test(l)
  );
  if (isKolhar) {
    const out = parseKolharFormat(lines, answerKey);
    return { ...out, blocks: out.passage ? [{ type: "passage", text: out.passage }, ...out.questions.map((q) => ({ type: "question" as const, question: q }))] : out.questions.map((q) => ({ type: "question" as const, question: q })) };
  }

  const passageParts: string[] = [];
  const questions: ParsedQuestion[] = [];
  const blocks: BankBlock[] = [];
  let current: { num: number; questionLines: string[]; options: string[] } | null = null;
  let currentPassageBlock: string[] | null = null;
  const letterToIndex: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
  let foundFirstQuestion = false;

  function pushQuestion(q: ParsedQuestion) {
    questions.push(q);
    blocks.push({ type: "question", question: q });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (isStopLine(trimmed)) break;
    if (isAnswerKeyLine(line)) continue;

    if (QUESTION_START_REGEX.test(trimmed) && !OPTION_REGEX.test(trimmed)) {
      const numMatch = trimmed.match(/^(\d+)\.\s*/);
      const num = numMatch ? parseInt(numMatch[1], 10) : 0;
      if (num > 0) {
        if (currentPassageBlock !== null) {
          const text = currentPassageBlock.filter((l) => l.trim().length > 0).join("\n\n").trim();
          if (text) blocks.push({ type: "passage", text });
          currentPassageBlock = null;
        }
        if (!foundFirstQuestion) {
          foundFirstQuestion = true;
          const kept = passageParts.filter((l) => l.trim().length > 0);
          passageParts.length = 0;
          passageParts.push(...kept);
          const firstPassage = kept.join("\n\n").trim();
          if (firstPassage) blocks.push({ type: "passage", text: firstPassage });
        }
        if (current) {
          const qText = current.questionLines.join(" ").replace(/^\d+\.\s*/, "").trim();
          const hasOptions = current.options.length > 0;
          if (EXAM_HEADER_REGEX.test(qText)) {
            current = null;
          } else if (hasOptions) {
            const correctLetter = answerKey.get(current.num);
            const correctIdx = correctLetter !== undefined ? letterToIndex[correctLetter] : 0;
            const correctAnswer = current.options[correctIdx] ?? current.options[0] ?? "";
            pushQuestion({
              id: current.num,
              question: qText,
              options: current.options,
              correctAnswer,
              explanation: keyWithExplanations.get(current.num)?.explanation,
            });
            current = null;
          } else if (numericKey.has(current.num)) {
            const numEntry = numericKeyWithExpl.get(current.num);
            pushQuestion({
              id: current.num,
              question: qText,
              options: [],
              correctAnswer: numEntry?.answer ?? numericKey.get(current.num) ?? "",
              explanation: numEntry?.explanation ?? keyWithExplanations.get(current.num)?.explanation,
            });
            current = null;
          } else {
            passageParts.push(current.questionLines.join(" ").trim());
            current = null;
          }
        }
        const newQText = trimmed.replace(/^\d+\.\s*/, "").trim();
        if (!EXAM_HEADER_REGEX.test(newQText)) {
          current = {
            num,
            questionLines: [trimmed],
            options: [],
          };
        }
      }
      continue;
    }

    if (!foundFirstQuestion && trimmed) {
      passageParts.push(trimmed);
      continue;
    }

    if (current && current.options.length > 0 && isNewPassageStart(trimmed)) {
      const qText = current.questionLines.join(" ").replace(/^\d+\.\s*/, "").trim();
      if (!EXAM_HEADER_REGEX.test(qText)) {
        const correctLetter = answerKey.get(current.num);
        const correctIdx = correctLetter !== undefined ? letterToIndex[correctLetter] : 0;
        const correctAnswer = current.options[correctIdx] ?? current.options[0] ?? "";
        pushQuestion({
          id: current.num,
          question: qText,
          options: current.options,
          correctAnswer,
          explanation: keyWithExplanations.get(current.num)?.explanation,
        });
      }
      current = null;
      currentPassageBlock = [trimmed];
      continue;
    }

    if (currentPassageBlock !== null && trimmed) {
      currentPassageBlock.push(trimmed);
      continue;
    }
    if (!current && foundFirstQuestion && trimmed) {
      passageParts.push(trimmed);
      continue;
    }

    if (OPTION_REGEX.test(trimmed) && current) {
      const optText = trimmed.replace(OPTION_REGEX, "").trim();
      current.options.push(optText);
      continue;
    }

    if (current && trimmed) {
      if (current.options.length === 0) {
        current.questionLines.push(trimmed);
      } else {
        current.options[current.options.length - 1] += " " + trimmed;
      }
    }
  }

  if (currentPassageBlock !== null) {
    const text = currentPassageBlock.filter((l) => l.trim().length > 0).join("\n\n").trim();
    if (text) blocks.push({ type: "passage", text });
  }

  if (current) {
    const qText = current.questionLines.join(" ").replace(/^\d+\.\s*/, "").trim();
    const hasOptions = current.options.length > 0;
    if (!EXAM_HEADER_REGEX.test(qText) && hasOptions) {
      const correctLetter = answerKey.get(current.num);
      const correctIdx = correctLetter !== undefined ? letterToIndex[correctLetter] : 0;
      const correctAnswer = current.options[correctIdx] ?? current.options[0] ?? "";
      pushQuestion({
        id: current.num,
        question: qText,
        options: current.options,
        correctAnswer,
        explanation: keyWithExplanations.get(current.num)?.explanation,
      });
    } else if (numericKey.has(current.num)) {
      const numEntry = numericKeyWithExpl.get(current.num);
      pushQuestion({
        id: current.num,
        question: qText,
        options: [],
        correctAnswer: numEntry?.answer ?? numericKey.get(current.num) ?? "",
        explanation: numEntry?.explanation ?? keyWithExplanations.get(current.num)?.explanation,
      });
    } else if (!hasOptions) {
      passageParts.push(current.questionLines.join(" ").trim());
    }
  }

  const passage = passageParts.join("\n\n").trim();
  questions.forEach((q, idx) => {
    q.id = idx + 1;
  });
  return { questions, answerKey, passage, blocks };
}

function parseKolharFormat(
  lines: string[],
  answerKey: Map<number, string>
): { questions: ParsedQuestion[]; answerKey: Map<number, string>; passage: string } {
  const isRussianKolhar = lines.some((l) => /Колонка\s*[АA]|Колонка\s*В/i.test(l));
  const passageLines: string[] = [];
  const questions: ParsedQuestion[] = [];
  const digitOnly = /^\d+\s*$/;
  let i = 0;
  while (i < lines.length && !digitOnly.test(lines[i].trim())) {
    if (lines[i].trim()) passageLines.push(lines[i].trim());
    i++;
  }
  let block: string[] = [];
  let num = 0;
  const options = isRussianKolhar
    ? ["Колонка А больше", "Колонка В больше", "Величины равны", "Определить невозможно"]
    : ["А бағаны үлкен", "В бағаны үлкен", "Шамалар тең", "Анықтау мүмкін емес"];
  const letterToOpt: Record<string, string> = { A: options[0], B: options[1], C: options[2], D: options[3] };

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (isStopLine(trimmed) || /\d+\.([A-D])\s*,/.test(trimmed)) break;
    if (digitOnly.test(trimmed)) {
      if (block.length > 0 && num > 0) {
        const correctLetter = answerKey.get(num);
        const correctAnswer = correctLetter ? letterToOpt[correctLetter] ?? options[0] : options[0];
        const colA = isRussianKolhar ? "Колонка А" : "А бағаны";
        const colB = isRussianKolhar ? "Колонка В" : "В бағаны";
        questions.push({
          id: num,
          question:
            colA + ": " + block.slice(0, Math.ceil(block.length / 2)).join(" ") +
            "\n" +
            colB + ": " + block.slice(Math.ceil(block.length / 2)).join(" "),
          options,
          correctAnswer,
        });
      }
      num = parseInt(trimmed, 10);
      block = [];
    } else if (num > 0 && trimmed) {
      block.push(trimmed);
    }
    i++;
  }
  if (block.length > 0 && num > 0) {
    const correctLetter = answerKey.get(num);
    const correctAnswer = correctLetter ? letterToOpt[correctLetter] ?? options[0] : options[0];
    const mid = Math.ceil(block.length / 2);
    const colA = isRussianKolhar ? "Колонка А" : "А бағаны";
    const colB = isRussianKolhar ? "Колонка В" : "В бағаны";
    questions.push({
      id: num,
      question: colA + ": " + block.slice(0, mid).join(" ") + "\n" + colB + ": " + block.slice(mid).join(" "),
      options,
      correctAnswer,
    });
  }

  return {
    questions,
    answerKey,
    passage: passageLines.join("\n").trim(),
  };
}
