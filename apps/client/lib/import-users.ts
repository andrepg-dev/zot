import type { BulkImportWaitListUserItem } from "@/actions/wait-list/wait-list-user.actions";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ImportRowError = { value: string; reason: string };

export type ParsedImport = {
  valid: BulkImportWaitListUserItem[];
  invalid: ImportRowError[];
};

export function parsePastedEmails(input: string): ParsedImport {
  const valid: BulkImportWaitListUserItem[] = [];
  const invalid: ImportRowError[] = [];
  const seen = new Set<string>();

  const tokens = input
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  for (const token of tokens) {
    const email = token.toLowerCase();
    if (seen.has(email)) continue;
    seen.add(email);

    if (!EMAIL_REGEX.test(email)) {
      invalid.push({ value: token, reason: "Invalid email" });
      continue;
    }
    valid.push({ email });
  }

  return { valid, invalid };
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

const RESERVED_KEYS = new Set(["email", "name"]);

export function parseCsv(text: string): ParsedImport {
  const valid: BulkImportWaitListUserItem[] = [];
  const invalid: ImportRowError[] = [];
  const seen = new Set<string>();

  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) return { valid, invalid };

  const headerCells = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const hasHeader = headerCells.includes("email");

  let headers: string[];
  let dataLines: string[];

  if (hasHeader) {
    headers = headerCells;
    dataLines = lines.slice(1);
  } else {
    headers = ["email"];
    dataLines = lines;
  }

  const emailIdx = headers.indexOf("email");
  const nameIdx = headers.indexOf("name");

  for (const line of dataLines) {
    const cells = splitCsvLine(line);
    const rawEmail = (cells[emailIdx] ?? "").trim();
    if (!rawEmail) continue;

    const email = rawEmail.toLowerCase();
    if (seen.has(email)) continue;
    seen.add(email);

    if (!EMAIL_REGEX.test(email)) {
      invalid.push({ value: rawEmail, reason: "Invalid email" });
      continue;
    }

    const item: BulkImportWaitListUserItem = { email };
    if (nameIdx >= 0 && cells[nameIdx]) item.name = cells[nameIdx];

    const metadata: Record<string, string> = {};
    headers.forEach((h, idx) => {
      if (RESERVED_KEYS.has(h)) return;
      const v = cells[idx];
      if (v != null && v !== "") metadata[h] = v;
    });
    if (Object.keys(metadata).length > 0) item.metadata = metadata;

    valid.push(item);
  }

  return { valid, invalid };
}
