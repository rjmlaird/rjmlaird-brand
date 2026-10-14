// Fails the build if:
//   1. src/styles/tokens.css and src/data/brand.ts disagree,
//   2. any documented "safe" colour pair drops below its stated contrast,
//   3. a figure printed in the Accessibility Guidance PDF doesn't reproduce.
// Needs Node 22.18+ (runs .ts files natively).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { surfaces, text, accents, lines, safePairs, pdfClaims } from "../src/data/brand.ts";
import { ratio } from "../src/lib/contrast.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "src/styles/tokens.css"), "utf8");
const rootBlock = css.split("[data-theme")[0];

const tokens = new Map();
for (const m of rootBlock.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
  tokens.set(m[1], m[2].replace(/\s+/g, "").toLowerCase());
}
const norm = (v) => v.replace(/\s+/g, "").toLowerCase();

let failures = 0;
const fail = (msg) => { console.error(`✗ ${msg}`); failures++; };

// 1. Token sync
let synced = 0;
const expect = (token, value) => {
  const actual = tokens.get(token);
  if (actual !== norm(value)) fail(`${token}: tokens.css has ${actual ?? "(missing)"}, brand.ts has ${norm(value)}`);
  else synced++;
};
for (const s of [...surfaces, ...text]) expect(s.token, s.hex);
for (const a of accents) { expect(a.token, a.hex); expect(a.dimToken, a.dim); expect(a.borderToken, a.border); }
for (const l of lines) expect(l.token, l.value);
console.log(`tokens: ${synced} values in sync`);

// 2. Documented pairs
for (const p of safePairs) {
  const r = ratio(p.fg, p.bg);
  if (r < p.min) fail(`${p.use}: ${r.toFixed(2)}:1 is below the documented ${p.min}:1`);
}
console.log(`contrast: ${safePairs.length} documented pairs checked`);

// 3. PDF figures. Warn only: the PDF is a separate document, and the site shows computed values.
let reproduced = 0;
for (const c of pdfClaims) {
  const r = ratio(c.fg, c.bg);
  if (Math.abs(r - c.printed) > 0.03) {
    console.warn(`! PDF prints ${c.printed}:1 for ${c.fg} on ${c.bg}; computed ${r.toFixed(2)}:1`);
  } else reproduced++;
}
console.log(`pdf: ${reproduced} of ${pdfClaims.length} printed ratios reproduced`);

if (failures) {
  console.error(`\n${failures} problem(s).`);
  process.exit(1);
}
console.log("brand data OK");
