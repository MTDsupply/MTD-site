// Fails the build if banned claim words appear in site copy or SVGs.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const BANNED = [
  /\bbiodegradable\b/i,
  /\bmarine\b/i,
  /\bocean\b/i,
  /\blandfill\b/i,
  /\bmunicipal\b/i,
  /\bgreen bins?\b/i,
  /\beco\b/i,
  /\beco-/i,
  /\bplanet[- ]friendly\b/i,
];
const ROOTS = ["src", "public"];
const EXT = new Set([".ts", ".tsx", ".svg", ".md", ".sql"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if ([...EXT].some((e) => p.endsWith(e))) out.push(p);
  }
  return out;
}

let failures = 0;
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const re of BANNED) {
        if (re.test(line)) {
          failures++;
          console.error(`${file}:${i + 1}: banned word ${re} → ${line.trim()}`);
        }
      }
    });
  }
}
if (failures) {
  console.error(`\nCopy lint failed: ${failures} occurrence(s). See the claims rules in docs/brand-card.md.`);
  process.exit(1);
}
console.log("Copy lint passed: no banned claim words.");
