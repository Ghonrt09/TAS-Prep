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

export function bankJsonToLines(data: { lines?: string[]; segments?: string[] }): string[] {
  if (data.lines?.length) return data.lines;
  if (data.segments?.length) return segmentsToLines(data.segments);
  return [];
}
