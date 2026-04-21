#!/usr/bin/env node
// Mock fetch, then run the CLI's create-waitlist flow against our in-memory API.
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname);
const pkgRoot = path.resolve(here, "..");
const tmp = path.join(pkgRoot, ".e2e-create-mock");

await fs.rm(tmp, { recursive: true, force: true });
await fs.mkdir(tmp, { recursive: true });
await fs.writeFile(path.join(tmp, ".env.local"), "ZOT_API_KEY=zot_live_mock\n");

// A tiny Node script that patches global fetch and imports the CLI.
const runner = `
globalThis.fetch = async (url, init) => {
  if (String(url).endsWith("/v1/wait-list") && init?.method === "POST") {
    const body = JSON.parse(init.body);
    return new Response(
      JSON.stringify({
        _id: "wl_mock_123",
        name: body.name,
        sendEmailToNewSignup: body.sendEmailToNewSignup,
        isAvailable: true,
        user_id: "user_mock",
        createdAt: "2026-04-21T17:00:00.000Z",
        updatedAt: "2026-04-21T17:00:00.000Z",
      }),
      { status: 201, headers: { "content-type": "application/json" } }
    );
  }
  return new Response("not mocked", { status: 500 });
};
await import(${JSON.stringify(path.join(pkgRoot, "dist/cli.js"))});
`;

const args = [
  "--input-type=module",
  "-e",
  runner,
  "--",
  "create",
  "waitlist",
  "--name",
  "Mock Waitlist",
  "--cwd",
  tmp,
  "--write-env",
  ".env.local",
  "--public",
];

// Forward argv to the imported CLI by setting process.argv before the dynamic import.
// Easiest: pass them after `--` and rewrite argv inside the runner.
const args2 = [
  "--input-type=module",
  "-e",
  `process.argv = [process.argv[0], "cli-runner", "create", "waitlist", "--name", "Mock Waitlist", "--cwd", ${JSON.stringify(tmp)}, "--write-env", ".env.local", "--public"]; ${runner}`,
];

await new Promise((resolve, reject) => {
  const child = spawn("node", args2, { stdio: "inherit" });
  child.on("exit", (code) => (code === 0 ? resolve(undefined) : reject(new Error(`exit ${code}`))));
});

console.log("\n--- .env.local after run ---");
console.log(await fs.readFile(path.join(tmp, ".env.local"), "utf8"));
