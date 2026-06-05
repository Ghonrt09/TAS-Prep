/**
 * Вливает решения из «МАТЕМ КАЗ НИШ банк по.json» в МАТЕМ НИШ КАЗ.json
 * Запуск: npx tsx scripts/merge-matem-nish-kaz-explanations.ts [path-to-zip-json]
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { parseLinesFormat } from "../src/lib/parseLinesJson";
import {
  mergeExplanationKeyLines,
  parseNisKazMathGuideSegments,
} from "../src/lib/segmentsToLines";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const defaultGuide = join(ROOT, "tmp-ilovepdf-2/МАТЕМ КАЗ НИШ банк по.json");
const guidePath = process.argv[2] ?? defaultGuide;
const bankPath = join(ROOT, "public/data/МАТЕМ НИШ КАЗ.json");

const guide = JSON.parse(readFileSync(guidePath, "utf8")) as { segments: string[] };
const bank = JSON.parse(readFileSync(bankPath, "utf8")) as { lines: string[] };

const keyLines = parseNisKazMathGuideSegments(guide.segments ?? []);
console.log("parsed key lines:", keyLines.length);

const merged = mergeExplanationKeyLines(bank.lines, keyLines);
writeFileSync(bankPath, JSON.stringify({ lines: merged }, null, 4) + "\n", "utf8");

const check = parseLinesFormat({ lines: merged });
const withExpl = check.questions.filter((q) => q.explanation && q.explanation.length > 30).length;
console.log("questions:", check.questions.length, "with explanation:", withExpl);
if (check.questions[0]?.explanation) {
  console.log("Q1 sample:", check.questions[0].explanation.slice(0, 100) + "…");
}
