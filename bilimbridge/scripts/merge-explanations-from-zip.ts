/**
 * Вливает пояснения из PDF-to-JSON (zip) в public/data/*.json
 * Запуск: npx tsx scripts/merge-explanations-from-zip.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import {
  mergeExplanationKeyLines,
  segmentsToExplanationKeyLines,
} from "../src/lib/segmentsToLines";
import { parseLinesFormat } from "../src/lib/parseLinesJson";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ZIP_DIR =
  process.env.ZIP_DIR ??
  "C:\\Users\\Alpha\\AppData\\Local\\Packages\\38833FF26BA1D.UnigramPreview_g9c9v27vpyspw\\LocalState\\3\\documents";

const MERGES: { zipName: string; bankFile: string }[] = [
  {
    zipName: "ilovepdf2-PDF_to_Json (1).zip",
    bankFile: "КОЛХАР НИШ КАЗ.json",
  },
  {
    zipName: "ilovepdf2-PDF_to_Json (1).zip",
    bankFile: "МАТЕМ КТЛ КАЗ.json",
  },
  {
    zipName: "ilovepdf2-PDF_to_Json (1).zip",
    bankFile: "МАТЕМ РФМШ КАЗ.json",
  },
];

const ZIP_FILE_MAP: Record<string, string> = {
  "КОЛХАР НИШ КАЗ.json": "КОЛХАР КАЗ НИШ банк по (1).json",
  "МАТЕМ КТЛ КАЗ.json": "МАТЕМ КАЗ КТЛ банк по (1).json",
  "МАТЕМ РФМШ КАЗ.json": "МАТЕМ КАЗ РФМШ банк по (1).json",
};

function loadZipJson(bankFile: string): { segments: string[] } {
  const inner = ZIP_FILE_MAP[bankFile];
  const extractDir = join(ROOT, "tmp-ilovepdf-extract");
  const path = join(extractDir, inner);
  return JSON.parse(readFileSync(path, "utf8"));
}

function main() {
  for (const { bankFile } of MERGES) {
    const bankPath = join(ROOT, "public/data", bankFile);
    const bank = JSON.parse(readFileSync(bankPath, "utf8")) as {
      lines?: string[];
      segments?: string[];
    };
    if (!bank.lines?.length) {
      console.warn("skip (no lines):", bankFile);
      continue;
    }

    const zip = loadZipJson(bankFile);
    const keyLines = segmentsToExplanationKeyLines(zip.segments ?? []);
    if (!keyLines.length) {
      console.warn("no key lines from zip for", bankFile);
      continue;
    }

    const merged = mergeExplanationKeyLines(bank.lines, keyLines);
    const out = { lines: merged };
    writeFileSync(bankPath, JSON.stringify(out, null, 4) + "\n", "utf8");

    const check = parseLinesFormat(out);
    const expl = check.questions.filter((q) => q.explanation && q.explanation.length > 15).length;
    console.log(bankFile, "questions", check.questions.length, "with explanation", expl);
  }
}

main();
