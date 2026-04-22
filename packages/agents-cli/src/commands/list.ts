import { listAvailableSkills } from "../registry.js";
import type { CommandContext } from "../types.js";
import { c, log } from "../ui.js";

export async function listCommand(ctx: CommandContext): Promise<void> {
  const skills = await listAvailableSkills({
    registryUrl: ctx.registry,
    localOnly: ctx.localOnly,
  });

  if (skills.length === 0) {
    log.warn("No skills available.");
    return;
  }

  log.title("Available skills");
  for (const s of skills) {
    const source = s.source === "remote" ? c.cyan("[remote]") : c.dim("[bundled]");
    console.log(`  ${c.bold(s.name)} ${c.dim(`v${s.version}`)} ${source}`);
    console.log(`    ${s.description}`);
  }
  console.log();
  log.info("Install one with: npx @zot-core/agents add <name>");
}
