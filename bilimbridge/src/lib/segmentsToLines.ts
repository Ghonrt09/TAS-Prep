/**
 * Конвертирует PDF-to-JSON с полем "segments" (слова по отдельности)
 * в строки для parseLinesFormat.
 */

const CYRILLIC_OPTION: Record<string, string> = {
  А: "A",
  Б: "B",
  В: "C",
  Г: "D",
  Д: "E",
  Е: "E",
};

export function normalizeOptionLetter(seg: string): string {
  const c = seg.trim().replace(/[\.\)]\s*$/, "").toUpperCase();
  return CYRILLIC_OPTION[c] ?? c;
}

function isOptionSegment(s: string): boolean {
  const t = s.trim();
  return /^[A-EАБВГДЕ][\.\)]$/i.test(t);
}

function isSeparator(s: string): boolean {
  return !s || /^=+$/.test(s);
}

function findKeySectionStart(segments: string[]): number {
  for (let i = 0; i < segments.length - 2; i++) {
    const t = segments[i].trim();
    if (!/^КЛЮЧ$|^KEY$/i.test(t)) continue;
    for (let j = i + 1; j < Math.min(i + 8, segments.length); j++) {
      const num = segments[j]?.trim() ?? "";
      const letter = segments[j + 1]?.trim() ?? "";
      if (/^\d+\.$/.test(num) && /^[A-EАБВГДЕ]$/i.test(letter)) return i;
    }
  }
  for (let i = 0; i < segments.length - 1; i++) {
    const num = segments[i]?.trim() ?? "";
    const letter = segments[i + 1]?.trim() ?? "";
    if (/^\d+\.$/.test(num) && /^[A-EАБВГДЕ]$/i.test(letter)) {
      const prev = segments.slice(Math.max(0, i - 5), i).join(" ");
      if (/КЛЮЧ|KEY|ПОЯСНЕН|ANSWERS/i.test(prev)) return i;
    }
  }
  return -1;
}

export function segmentsToLines(segments: string[]): string[] {
  const lines: string[] = [];
  const keyStart = findKeySectionStart(segments);
  let i = 0;

  while (i < segments.length) {
    if (keyStart >= 0 && i >= keyStart) break;

    while (i < segments.length && isSeparator(segments[i].trim())) i++;
    if (i >= segments.length || (keyStart >= 0 && i >= keyStart)) break;

    const t = segments[i].trim();

    if ((t === "ТЕКСТ" || t === "Text") && i + 1 < segments.length) {
      const next = segments[i + 1].trim();
      if (/^\d+[:.]$/.test(next)) {
        lines.push(`${t} ${next.replace(".", ":")}`);
        i += 2;
        const passage: string[] = [];
        while (i < segments.length && (keyStart < 0 || i < keyStart)) {
          const s = segments[i].trim();
          if (s === "Вопрос" || s === "Question") break;
          if (s === "ТЕКСТ" || s === "Text") break;
          if (/^КЛЮЧ$/i.test(s)) break;
          if (isOptionSegment(s)) break;
          if (/^\d+\.$/.test(s)) {
            const n2 = segments[i + 1]?.trim() ?? "";
            if (!isOptionSegment(n2) && !/^[A-EАБВГДЕ]$/i.test(n2)) break;
          }
          if (isSeparator(s)) {
            i++;
            continue;
          }
          passage.push(s);
          i++;
        }
        if (passage.length) lines.push(passage.join(" "));
        continue;
      }
    }

    if (t === "Вопрос" || t === "Question") {
      i++;
      if (i < segments.length && /^\d+\.$/.test(segments[i].trim())) {
        const num = segments[i].trim();
        i++;
        const qParts = [num.replace(/\.$/, "") + "."];
        while (i < segments.length && (keyStart < 0 || i < keyStart)) {
          const s = segments[i].trim();
          if (isOptionSegment(s)) break;
          if (s === "Вопрос" || s === "Question") break;
          if (s === "ТЕКСТ" || s === "Text") break;
          if (/^КЛЮЧ$/i.test(s)) break;
          if (isSeparator(s)) {
            i++;
            continue;
          }
          qParts.push(s);
          i++;
        }
        lines.push(qParts.join(" "));
        continue;
      }
      continue;
    }

    if (/^\d+\.$/.test(t)) {
      const qParts = [t];
      i++;
      while (i < segments.length && (keyStart < 0 || i < keyStart)) {
        const s = segments[i].trim();
        if (isOptionSegment(s)) break;
        if (s === "Вопрос" || s === "Question") break;
        if (/^КЛЮЧ$/i.test(s)) break;
        if (/^\d+\.$/.test(s)) {
          const n2 = segments[i + 1]?.trim() ?? "";
          if (!isOptionSegment(n2) && !/^[A-EАБВГДЕ]$/i.test(n2)) break;
        }
        if (isSeparator(s)) {
          i++;
          continue;
        }
        qParts.push(s);
        i++;
      }
      lines.push(qParts.join(" "));
      continue;
    }

    if (isOptionSegment(t)) {
      const letter = normalizeOptionLetter(t);
      i++;
      const optParts: string[] = [];
      while (i < segments.length && (keyStart < 0 || i < keyStart)) {
        const s = segments[i].trim();
        if (isOptionSegment(s)) break;
        if (s === "Вопрос" || s === "Question") break;
        if (/^КЛЮЧ$/i.test(s)) break;
        if (/^\d+\.$/.test(s)) {
          const n2 = segments[i + 1]?.trim() ?? "";
          if (!isOptionSegment(n2) && !/^[A-EАБВГДЕ]$/i.test(n2)) break;
        }
        if (isSeparator(s)) {
          i++;
          continue;
        }
        optParts.push(s);
        i++;
      }
      lines.push(`${letter}) ${optParts.join(" ")}`);
      continue;
    }

    const misc: string[] = [t];
    i++;
    while (i < segments.length && (keyStart < 0 || i < keyStart)) {
      const s = segments[i].trim();
      if (s === "Вопрос" || s === "Question") break;
      if (isOptionSegment(s)) break;
      if (s === "ТЕКСТ" || s === "Text") break;
      if (/^КЛЮЧ$/i.test(s)) break;
      if (/^\d+\.$/.test(s)) {
        const n2 = segments[i + 1]?.trim() ?? "";
        if (!isOptionSegment(n2) && !/^[A-EАБВГДЕ]$/i.test(n2)) break;
      }
      if (isSeparator(s)) {
        i++;
        continue;
      }
      misc.push(s);
      i++;
    }
    if (misc.length) lines.push(misc.join(" "));
  }

  if (keyStart >= 0) {
    lines.push("КЛЮЧИ");
    i = keyStart;
    while (i < segments.length) {
      const numSeg = segments[i]?.trim() ?? "";
      if (isSeparator(numSeg)) {
        i++;
        continue;
      }
      if (!/^\d+\.$/.test(numSeg)) {
        if (/^КЛЮЧ|^KEY$/i.test(numSeg)) {
          i++;
          continue;
        }
        i++;
        continue;
      }
      const num = numSeg.replace(".", "");
      i++;
      while (i < segments.length && isSeparator(segments[i]?.trim() ?? "")) i++;
      if (i >= segments.length) break;
      const letterRaw = segments[i]?.trim() ?? "";
      const letterM = letterRaw.match(/^([A-EАБВГДЕ])\.?$/i);
      if (!letterM) break;
      const letter = normalizeOptionLetter(letterM[1] + ")");
      i++;
      if (i < segments.length && (segments[i].trim() === "—" || segments[i].trim() === "-")) i++;
      const explParts: string[] = [];
      while (i < segments.length) {
        const s = segments[i].trim();
        if (/^\d+\.$/.test(s)) break;
        if (isSeparator(s)) {
          i++;
          continue;
        }
        if (/^КЛЮЧ|^KEY$/i.test(s)) break;
        explParts.push(s);
        i++;
      }
      if (explParts.length) {
        lines.push(`${num}. ${letter} — ${explParts.join(" ")}`);
      } else {
        lines.push(`${num}. ${letter}`);
      }
    }
  }

  return lines;
}

/** PDF «банк по» — блок «N-сұрақ» + «Жауабы:» (Матем КТЛ/РФМШ каз). */
export function parseKazGuideSegments(segments: string[]): string[] {
  const keyLines: string[] = [];
  let i = 0;

  while (i < segments.length) {
    const t = segments[i].trim();
    const head = t.match(/^(\d+)-сұрақ\.?$/i);
    if (!head) {
      i++;
      continue;
    }
    const num = parseInt(head[1], 10);
    const explParts: string[] = [];
    i++;

    while (i < segments.length) {
      let s = segments[i].trim();
      if (/^\d+-сұрақ/i.test(s)) break;

      const jaumAt = s.search(/Жауабы\s*:/i);
      if (jaumAt >= 0) {
        if (jaumAt > 0) explParts.push(s.slice(0, jaumAt).trim());
        let tail = s.slice(jaumAt).replace(/^Жауабы\s*:/i, "").trim();
        i++;
        const expl = explParts.join(" ").trim();
        let letter = tail.match(/^([A-EАБВГДЕ])\.?/i)?.[1];
        if (letter) {
          keyLines.push(
            expl
              ? `${num}. ${normalizeOptionLetter(letter + ")")} — ${expl}`
              : `${num}. ${normalizeOptionLetter(letter + ")")}`
          );
          break;
        }
        const ansParts: string[] = tail ? [tail] : [];
        while (i < segments.length) {
          const n = segments[i].trim();
          if (/^\d+-сұрақ/i.test(n) || n === "●") break;
          if (/^Жауабы\s*:/i.test(n)) {
            i++;
            continue;
          }
          ansParts.push(n);
          i++;
          if (ansParts.length >= 1 && /^-?\d+(?:[.,]\d+)?$/.test(ansParts.join("").replace(/\s/g, ""))) break;
        }
        const answer = ansParts.join(" ").trim();
        if (answer) {
          keyLines.push(expl ? `${num}. ${answer} (${expl})` : `${num}. ${answer}`);
        }
        break;
      }

      explParts.push(s);
      i++;
    }
  }

  return keyLines;
}

/** Колхар НИШ каз — «1.» «Жауабы:» «B.» + пояснение. */
export function parseKolharKazGuideSegments(segments: string[]): string[] {
  const keyLines: string[] = [];
  let i = 0;

  while (i < segments.length) {
    const t = segments[i].trim();
    const numMatch = t.match(/^(\d+)\.$/);
    if (!numMatch) {
      i++;
      continue;
    }
    const num = parseInt(numMatch[1], 10);
    i++;
    if (i < segments.length && /^Жауабы\s*:?$/i.test(segments[i].trim())) i++;

    if (i >= segments.length) break;
    const letterSeg = segments[i].trim();
    const letterM = letterSeg.match(/^([A-DА-Д])\.?$/i);
    if (!letterM) continue;
    const letter = normalizeOptionLetter(letterM[1] + ")");
    i++;

    const explParts: string[] = [];
    while (i < segments.length) {
      const s = segments[i].trim();
      if (s === "●" || /^\d+\.$/.test(s)) break;
      if (/^Жауабы\s*:?$/i.test(s)) break;
      explParts.push(s);
      i++;
    }

    const expl = explParts.join(" ").trim();
    keyLines.push(expl ? `${num}. ${letter} — ${expl}` : `${num}. ${letter}`);
  }

  return keyLines;
}

/** Заголовок блока ключей (не «Жауапты» внутри формулировки задания). */
const KEY_HEADER = /^(КЛЮЧ|ЖАУАПТАР|ЖАУАП\s+КІЛТ|KEY\s*\(|КЛЮЧИ\s+И\s+ПОЯСНЕНИЯ)/i;
const KEY_HEADER_INLINE = /^(КЛЮЧИ|КЛЮЧ\s+ОТВЕТОВ|ЖАУАП\s+КІЛТТЕРІ)/i;

/** Строки ключа с пояснениями из segments (только ключи или гайд N-сұрақ). */
export function segmentsToExplanationKeyLines(segments: string[]): string[] {
  if (
    segments.some((s) => /^Пояснения$/i.test(s.trim())) &&
    segments.some((s) => /^Жауабы\s*:?$/i.test(s.trim()))
  ) {
    return parseKolharKazGuideSegments(segments);
  }
  if (segments.some((s) => /^\d+-сұрақ/i.test(s.trim()))) {
    return parseKazGuideSegments(segments);
  }
  const lines = segmentsToLines(segments);
  const keyIdx = lines.findIndex((l) => KEY_HEADER.test(l.trim()));
  if (keyIdx >= 0) {
    return lines.slice(keyIdx + 1).filter((l) => {
      const t = l.trim();
      return t && /^\d+\.\s*[A-EА-Е]/i.test(t);
    });
  }
  return lines.filter((l) => /^\d+\.\s*[A-EА-ЕА-Я]/i.test(l.trim()));
}

/** Подменяет блок ключей в lines-файле на развёрнутые пояснения. */
export function mergeExplanationKeyLines(
  existingLines: string[],
  explanationKeyLines: string[]
): string[] {
  if (!explanationKeyLines.length) return existingLines;

  let keyIdx = existingLines.findIndex((l) => {
    const t = l.trim();
    return KEY_HEADER.test(t) || KEY_HEADER_INLINE.test(t);
  });
  if (keyIdx < 0) {
    keyIdx = existingLines.findIndex((l) => /\d+\.[A-D]\s*,\s*\d+\./i.test(l));
  }
  if (keyIdx < 0) {
    keyIdx = existingLines.findIndex((l) => /^2-Б[өoһ]лім:/i.test(l.trim()) && /\(1.?60\)/i.test(l));
  }
  const headerLine = keyIdx >= 0 ? existingLines[keyIdx].trim() : "";
  const header = KEY_HEADER.test(headerLine) || KEY_HEADER_INLINE.test(headerLine)
    ? headerLine
    : "КЛЮЧИ И ПОЯСНЕНИЯ";
  const body = existingLines.slice(0, keyIdx >= 0 ? keyIdx : existingLines.length);

  while (body.length > 0 && !body[body.length - 1].trim()) body.pop();

  return [...body, header, ...explanationKeyLines, ""];
}

export function bankJsonToLines(data: { lines?: string[]; segments?: string[] }): string[] {
  if (data.lines?.length) return data.lines;
  if (data.segments?.length) return segmentsToLines(data.segments);
  return [];
}
