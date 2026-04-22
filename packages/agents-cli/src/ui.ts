const isTTY = process.stdout.isTTY === true && process.env.NO_COLOR !== "1";

const color = (code: number) => (text: string) =>
  isTTY ? `\x1b[${code}m${text}\x1b[0m` : text;

export const c = {
  dim: color(2),
  bold: color(1),
  red: color(31),
  green: color(32),
  yellow: color(33),
  blue: color(34),
  magenta: color(35),
  cyan: color(36),
};

export const log = {
  info: (msg: string) => console.log(`${c.cyan("i")} ${msg}`),
  success: (msg: string) => console.log(`${c.green("✓")} ${msg}`),
  warn: (msg: string) => console.log(`${c.yellow("!")} ${msg}`),
  error: (msg: string) => console.error(`${c.red("✗")} ${msg}`),
  step: (msg: string) => console.log(`  ${c.dim("→")} ${msg}`),
  title: (msg: string) => console.log(`\n${c.bold(msg)}`),
};

export async function confirm(question: string, defaultYes = true): Promise<boolean> {
  if (!process.stdin.isTTY) return defaultYes;

  process.stdout.write(`${c.cyan("?")} ${question} ${defaultYes ? "[Y/n]" : "[y/N]"} `);

  return new Promise((resolve) => {
    const onData = (chunk: Buffer) => {
      const answer = chunk.toString().trim().toLowerCase();
      process.stdin.off("data", onData);
      process.stdin.pause();
      if (!answer) return resolve(defaultYes);
      resolve(answer === "y" || answer === "yes");
    };
    process.stdin.resume();
    process.stdin.on("data", onData);
  });
}
