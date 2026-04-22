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
  step: (msg: string) => console.log(`  ${c.dim("→")} ${msg}`),
  title: (msg: string) => console.log(`\n${c.bold(msg)}`),
};
