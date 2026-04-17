export type TemplateVariable = {
  name: string;
  defaultValue?: string;
};

export type TemplateAnalysis = {
  declared: TemplateVariable[];
  missing: string[];
};

const COMPONENT_PATTERNS: RegExp[] = [
  /\b(?:const|let|var)\s+[A-Z]\w*\s*=\s*\(\s*\{([\s\S]*?)\}\s*(?:=\s*\{\s*\}\s*)?\)\s*=>/,
  /\bfunction\s+[A-Z]\w*\s*\(\s*\{([\s\S]*?)\}\s*\)/,
];

const BUILTIN_IDENTIFIERS = new Set<string>([
  // JS globals
  "React",
  "console",
  "Math",
  "Date",
  "JSON",
  "Array",
  "Object",
  "String",
  "Number",
  "Boolean",
  "RegExp",
  "Error",
  "Promise",
  "Symbol",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "undefined",
  "null",
  "true",
  "false",
  "NaN",
  "Infinity",
  "parseInt",
  "parseFloat",
  "isNaN",
  "isFinite",
  "encodeURI",
  "encodeURIComponent",
  "decodeURI",
  "decodeURIComponent",
  // React Email components
  "Html",
  "Head",
  "Body",
  "Container",
  "Section",
  "Row",
  "Column",
  "Text",
  "Heading",
  "Button",
  "Link",
  "Img",
  "Hr",
  "Preview",
  "Font",
  "Tailwind",
  "Markdown",
  "Style",
  "CodeInline",
  "CodeBlock",
  // JS keywords
  "if",
  "else",
  "return",
  "const",
  "let",
  "var",
  "function",
  "new",
  "this",
  "typeof",
  "instanceof",
  "in",
  "of",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "default",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "throw",
  "class",
  "extends",
  "super",
  "static",
  "import",
  "export",
  "from",
  "as",
  "async",
  "await",
  "yield",
  "void",
  "delete",
]);

function splitTopLevel(input: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";

  for (const char of input) {
    if (char === "{" || char === "(" || char === "[") depth++;
    else if (char === "}" || char === ")" || char === "]") depth--;

    if (char === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) parts.push(current);
  return parts;
}

function stripStringLiterals(code: string): string {
  return code
    .replace(/"(?:\\.|[^"\\\n])*"/g, '""')
    .replace(/'(?:\\.|[^'\\\n])*'/g, "''")
    .replace(/`(?:\\.|[^`\\])*`/g, "``");
}

function extractLocalDeclarations(code: string): Set<string> {
  const decls = new Set<string>();
  const regex = /\b(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
    decls.add(match[1]);
  }
  return decls;
}

function extractReferencedIdentifiers(code: string): Set<string> {
  const refs = new Set<string>();
  const stripped = stripStringLiterals(code);
  const regex = /\{\s*([A-Za-z_$][\w$]*)\b(?!\s*:)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(stripped)) !== null) {
    refs.add(match[1]);
  }
  return refs;
}

export function extractTemplateVariables(code: string): TemplateVariable[] {
  if (!code?.trim()) return [];

  let propsBlock: string | null = null;
  for (const pattern of COMPONENT_PATTERNS) {
    const match = code.match(pattern);
    if (match?.[1] !== undefined) {
      propsBlock = match[1];
      break;
    }
  }

  if (propsBlock === null) return [];

  return splitTopLevel(propsBlock)
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed || trimmed.startsWith("...")) return null;

      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) {
        return { name: trimmed };
      }

      const name = trimmed.slice(0, eqIndex).trim();
      const defaultValue = trimmed.slice(eqIndex + 1).trim();
      if (!name) return null;

      return { name, defaultValue };
    })
    .filter((v): v is TemplateVariable => v !== null);
}

export function analyzeTemplateCode(code: string): TemplateAnalysis {
  const declared = extractTemplateVariables(code);
  if (!code?.trim()) {
    return { declared, missing: [] };
  }

  const declaredNames = new Set(declared.map((v) => v.name));
  const locals = extractLocalDeclarations(code);
  const references = extractReferencedIdentifiers(code);

  const missing: string[] = [];
  for (const name of references) {
    if (declaredNames.has(name)) continue;
    if (locals.has(name)) continue;
    if (BUILTIN_IDENTIFIERS.has(name)) continue;
    missing.push(name);
  }

  return { declared, missing: missing.sort() };
}
