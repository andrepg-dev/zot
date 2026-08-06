import { z } from "zod";

const jsIdentifierSchema = z
  .string()
  .min(1)
  .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/, "Variable name must be a valid JS identifier.");

/** A single merge field emitted alongside a generated email. */
export const variableSpecSchema = z.object({
  name: jsIdentifierSchema,
  label: z.string().optional(),
  default: z.string(),
  role: z.enum(["text", "url", "image", "date"]).optional(),
  scope: z.enum(["dynamic", "static"]).default("dynamic"),
});

type VariableRole = NonNullable<z.infer<typeof variableSpecSchema>["role"]>;

/**
 * Tolerant shape for schemas coming off the model or older stored rows, which
 * may use `key` instead of `name` and put anything in `default`.
 */
const rawVariableSpecSchema = z
  .looseObject({
    name: z.string().min(1).optional(),
    key: z.string().min(1).optional(),
    label: z.string().optional(),
    default: z.unknown().optional(),
    role: z.unknown().optional(),
    type: z.enum(["string", "number", "boolean", "url"]).optional(),
    description: z.string().optional(),
    required: z.boolean().optional(),
    scope: z.enum(["dynamic", "static"]).optional(),
  })
  .refine((entry) => entry.name || entry.key, {
    message: "Variable must include name or key.",
  });

export const variableSchemaRootSchema = z.object({
  variables: z.array(variableSpecSchema),
});

export type VariableSpec = z.infer<typeof variableSpecSchema>;
export type VariableSchemaRoot = { variables: VariableSpec[] };

function normalizeLegacyName(name: string): string {
  const safe = name
    .trim()
    .replace(/[^a-zA-Z0-9_$]+/g, " ")
    .split(" ")
    .filter(Boolean);
  if (safe.length === 0) return "value";
  const [first, ...rest] = safe;
  const camel = `${first.toLowerCase()}${rest
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("")}`;
  const prefixed = /^[a-zA-Z_$]/.test(camel) ? camel : `v${camel}`;
  return prefixed.replace(/[^a-zA-Z0-9_$]/g, "");
}

function normalizeVariableName(name: string): string {
  const trimmed = name.trim();
  return jsIdentifierSchema.safeParse(trimmed).success ? trimmed : normalizeLegacyName(trimmed);
}

function stringifyDefault(value: unknown): string {
  if (value === undefined || value === null) return "";
  return typeof value === "string" ? value : String(value);
}

function normalizeVariableRole(role: unknown, type?: string): VariableRole | undefined {
  const value = typeof role === "string" ? role.trim().toLowerCase() : "";
  if (value === "text" || value === "url" || value === "image" || value === "date") {
    return value;
  }

  const hint = value || type || "";
  if (!hint) return undefined;
  if (/url|link|href/.test(hint)) return "url";
  if (/image|photo|picture|avatar|logo/.test(hint)) return "image";
  if (/date|time|day|deadline/.test(hint)) return "date";
  return "text";
}

export function parseVariableSchemaJson(raw: unknown): VariableSchemaRoot {
  const parsed = z
    .union([z.object({ variables: z.array(rawVariableSpecSchema) }), z.array(rawVariableSpecSchema)])
    .parse(raw);
  const entries = Array.isArray(parsed) ? parsed : parsed.variables;
  return {
    variables: entries.map((entry) => {
      if ("name" in entry && entry.name) {
        return variableSpecSchema.parse({
          name: normalizeVariableName(entry.name),
          label: entry.label,
          default: stringifyDefault(entry.default),
          role: normalizeVariableRole(entry.role, entry.type),
          scope: entry.scope ?? "dynamic",
        });
      }
      return variableSpecSchema.parse({
        name: normalizeLegacyName(entry.key ?? "value"),
        label: entry.label ?? entry.description ?? entry.key,
        default: stringifyDefault(entry.default),
        role: normalizeVariableRole(entry.role, entry.type) ?? "text",
        scope: "dynamic",
      });
    }),
  };
}

/**
 * Values passed to the renderer: static variables use their fixed default,
 * dynamic variables render as a `{{name}}` merge tag so the sending platform
 * can replace them per recipient.
 */
export function buildRenderVariables(schema: VariableSchemaRoot): Record<string, string> {
  return Object.fromEntries(
    schema.variables.map((variable) => [
      variable.name,
      variable.scope === "static" ? variable.default : `{{${variable.name}}}`,
    ]),
  );
}

function humanizeVariableName(name: string): string {
  const spaced = name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_$]+/g, " ")
    .trim();
  if (!spaced) return name;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Splits a destructuring block (`a = '1', b = "2"`) into top-level `name = value`
 * entries, respecting string literals so commas inside defaults do not split.
 */
function splitTopLevelProps(block: string): string[] {
  const entries: string[] = [];
  let current = "";
  let depth = 0;
  let quote: string | null = null;
  for (let i = 0; i < block.length; i += 1) {
    const char = block[i];
    if (quote) {
      current += char;
      if (char === "\\") {
        current += block[i + 1] ?? "";
        i += 1;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      current += char;
      continue;
    }
    if (char === "(" || char === "{" || char === "[") depth += 1;
    if (char === ")" || char === "}" || char === "]") depth -= 1;
    if (char === "," && depth === 0) {
      entries.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) entries.push(current);
  return entries;
}

function parseStringLiteral(value: string): string | null {
  const trimmed = value.trim();
  const quote = trimmed[0];
  if (quote !== "'" && quote !== '"' && quote !== "`") return null;
  if (trimmed[trimmed.length - 1] !== quote) return null;
  return trimmed
    .slice(1, -1)
    .replace(/\\(['"`\\])/g, "$1")
    .replace(/\\n/g, "\n");
}

/**
 * Fallback variable extraction for templates with no stored schema. Reads the
 * `Email = ({ name = 'default', ... } = {}) =>` destructured props and maps each
 * string default to a `static` variable, so rendered output is unchanged while
 * the values become editable. Roles are inferred from the name.
 */
export function extractVariableSchemaFromComponent(componentCode: string): VariableSchemaRoot {
  const match = componentCode.match(/\(\s*\{([\s\S]*?)\}\s*(?:=\s*\{\}\s*)?\)\s*=>/);
  if (!match) return { variables: [] };
  const variables: VariableSpec[] = [];
  const seen = new Set<string>();
  for (const entry of splitTopLevelProps(match[1])) {
    const eq = entry.indexOf("=");
    if (eq === -1) continue;
    const rawName = entry.slice(0, eq).trim();
    if (!jsIdentifierSchema.safeParse(rawName).success || seen.has(rawName)) continue;
    const defaultValue = parseStringLiteral(entry.slice(eq + 1));
    if (defaultValue === null) continue;
    seen.add(rawName);
    variables.push(
      variableSpecSchema.parse({
        name: rawName,
        label: humanizeVariableName(rawName),
        default: defaultValue,
        role: normalizeVariableRole(rawName) ?? "text",
        scope: "static",
      }),
    );
  }
  return { variables };
}

/**
 * Re-applies user-set variable values onto the schema emitted after an AI edit.
 * Panel-edited values live only in the stored schema, so the model tends to
 * re-emit the original code defaults and silently discard them (for example an
 * uploaded logo). A user override is carried forward unless the model
 * deliberately emitted a new value of its own.
 */
export function mergeUserVariableOverrides(
  emitted: VariableSchemaRoot,
  baseComponentCode: string,
  baseVariableSchema: unknown,
): VariableSchemaRoot {
  let userSchema: VariableSchemaRoot;
  try {
    userSchema = parseVariableSchemaJson(baseVariableSchema);
  } catch {
    return emitted;
  }
  const codeDefaults = new Map(
    extractVariableSchemaFromComponent(baseComponentCode).variables.map((variable) => [
      variable.name,
      variable.default,
    ]),
  );
  const userVariables = new Map(userSchema.variables.map((variable) => [variable.name, variable]));
  return {
    variables: emitted.variables.map((variable) => {
      const user = userVariables.get(variable.name);
      if (!user) return variable;
      const codeDefault = codeDefaults.get(variable.name);
      const userOverrode = codeDefault !== undefined && user.default !== codeDefault;
      if (!userOverrode) return variable;
      const modelChangedIntentionally =
        variable.default.trim() !== "" &&
        variable.default !== codeDefault &&
        variable.default !== user.default;
      if (modelChangedIntentionally) return variable;
      return { ...variable, default: user.default, scope: user.scope };
    }),
  };
}

/** Tool activity surfaced in the chat timeline while the model works. */
export const emailChatToolCallPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  detail: z.string().optional(),
  summary: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type EmailChatToolCallPayload = z.infer<typeof emailChatToolCallPayloadSchema>;

/**
 * Design skills the user can attach to a prompt. A skill is an opt-in design
 * recipe (an advanced layout technique, or a curated font pairing). Attaching
 * one loads its full recipe into the first request instead of leaving the model
 * to decide whether to fetch it.
 */
export const skillKindSchema = z.enum(["technique", "font"]);
export type SkillKind = z.infer<typeof skillKindSchema>;

export const skillDtoSchema = z.object({
  name: z.string(),
  kind: skillKindSchema,
  label: z.string(),
  summary: z.string(),
  example: z.string(),
});

export type SkillDto = z.infer<typeof skillDtoSchema>;

export const skillListSchema = z.array(skillDtoSchema);

/** Roles a stored generation chat message can take. */
export const emailChatRoleSchema = z.enum(["USER", "ASSISTANT"]);
export type EmailChatRole = z.infer<typeof emailChatRoleSchema>;

/** Message kinds rendered differently in the chat timeline. */
export const emailChatKindSchema = z.enum(["MESSAGE", "TOOL_CALL", "ERROR"]);
export type EmailChatKind = z.infer<typeof emailChatKindSchema>;

/** What triggered a generation run. */
export const generationRunKindSchema = z.enum(["GENERATE", "EDIT", "REGENERATE"]);
export type GenerationRunKind = z.infer<typeof generationRunKindSchema>;

export const generationRunStatusSchema = z.enum([
  "PENDING",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "ABORTED",
]);
export type GenerationRunStatus = z.infer<typeof generationRunStatusSchema>;
