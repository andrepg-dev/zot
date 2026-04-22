export type AgentTarget = "claude" | "cursor" | "copilot" | "agents-md";

export const ALL_TARGETS: AgentTarget[] = ["claude", "cursor", "copilot", "agents-md"];

export interface CommandContext {
  cwd: string;
  targets: string[] | undefined;
  yes: boolean;
  force: boolean;
  registry?: string | undefined;
  localOnly: boolean;
}

export interface SkillManifest {
  name: string;
  version: string;
  description: string;
  source: "bundled" | "remote";
}

export interface LoadedSkill extends SkillManifest {
  /** Full SKILL.md content (with its own frontmatter). */
  content: string;
}

export interface InstallResult {
  target: AgentTarget;
  path: string;
  action: "created" | "updated" | "skipped" | "overwritten";
}
