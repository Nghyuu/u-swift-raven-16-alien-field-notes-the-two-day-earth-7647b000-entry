import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(join(dir, "entry.txt"), "utf8");
const line = raw.replace(/\r?\n$/, "");
if (!line) {
  throw new Error("entry.txt must not be empty");
}
if (line.includes("\n") || line.includes("\r")) {
  throw new Error("entry.txt must be exactly one line");
}
const count = [...line].length;
if (count < 1 || count > 200) {
  throw new Error(`entry must be 1-200 code points, got ${count}`);
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, raw);
const written = readFileSync(target, "utf8");
if (written !== raw) {
  throw new Error("output entry.txt does not match the source entry.txt");
}
console.log(`Wrote entry (${count} code points) to ${target}`);
