// Generates every logo asset as outlined SVG (no font dependency) plus PNG renders,
// the favicon and the social preview image.   Run: npm run logos
//
// Wordmark: "RJM" in Warm White + "Laird" in Teal, Space Grotesk 700, +0.04em tracking,
// matching the nav on rjmlaird.co.uk. The orbit mark is new: it follows the rotating
// rings in the site's hero.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public/assets/logos");
mkdirSync(out, { recursive: true });

const load = (p) => {
  const b = readFileSync(join(root, "node_modules/@fontsource/space-grotesk/files", p));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const bold = load("space-grotesk-latin-700-normal.woff");
const medium = load("space-grotesk-latin-500-normal.woff");

const INK = "#0B0F1A", WHITE = "#EDEAE3", TEAL = "#00C2A8";
const colourways = {
  "colour-on-dark": { fg: WHITE, accent: TEAL },   // for Ink and other dark backgrounds
  ink: { fg: INK, accent: INK },                    // for light backgrounds
  white: { fg: WHITE, accent: WHITE },              // one-colour, on dark or photographic backgrounds
};

const f = (n) => +n.toFixed(2);

/** The orbit mark in a 120 × 120 box. */
function mark({ fg, accent }, small = false) {
  const c = 60;
  const R = small ? 46 : 52, sw = small ? 11 : 5;
  const ang = (-40 * Math.PI) / 180;
  const px = c + R * Math.cos(ang), py = c + R * Math.sin(ang);
  const pr = small ? 15 : 9, cut = pr + (small ? 6 : 5);
  const inner = small
    ? `<circle cx="${c}" cy="${c}" r="12" fill="${accent}"/>`
    : `<circle cx="${c}" cy="${c}" r="31" fill="none" stroke="${accent}" stroke-width="${sw}"/><circle cx="${c}" cy="${c}" r="6" fill="${fg}"/>`;
  return `<defs><mask id="gap"><rect width="120" height="120" fill="#fff"/><circle cx="${f(px)}" cy="${f(py)}" r="${cut}" fill="#000"/></mask></defs>
<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${fg}" stroke-width="${sw}" mask="url(#gap)"/>
${inner}
<circle cx="${f(px)}" cy="${f(py)}" r="${pr}" fill="${accent}"/>`;
}

const TRACK = 0.04;

/** Wordmark outlines, baseline at y = 0, starting at x = 0. */
function wordmark({ fg, accent }, size) {
  const opts = { letterSpacing: TRACK, kerning: true };
  const a = bold.getPath("RJM", 0, 0, size, opts);
  const adv = bold.getAdvanceWidth("RJM", size, opts);
  const b = bold.getPath("Laird", adv, 0, size, opts);
  const bb1 = a.getBoundingBox(), bb2 = b.getBoundingBox();
  const width = Math.max(bb1.x2, bb2.x2) - Math.min(bb1.x1, bb2.x1);
  const x0 = Math.min(bb1.x1, bb2.x1);
  const cap = (bold.tables.os2.sCapHeight / bold.unitsPerEm) * size;
  return {
    width, x0, cap,
    svg: `<path d="${a.toPathData(2)}" fill="${fg}"/><path d="${b.toPathData(2)}" fill="${accent}"/>`,
  };
}

const SIZE = 64;       // wordmark font size inside the 120-unit mark box
const GAP = 30;        // mark → wordmark gap

function lockup(kind, cw) {
  const wm = wordmark(cw, SIZE);
  const cap = wm.cap;
  if (kind === "mark") {
    return { w: 120, h: 120, body: mark(cw), x: cap };
  }
  if (kind === "wordmark") {
    // Height = cap height + descender-free box; "RJMLaird" has no descenders except none, so cap box is tight.
    return {
      w: f(wm.width), h: f(cap),
      body: `<g transform="translate(${f(-wm.x0)} ${f(cap)})">${wm.svg}</g>`,
      x: cap,
    };
  }
  if (kind === "horizontal") {
    const w = 120 + GAP + wm.width;
    const base = 60 + cap / 2;
    return {
      w: f(w), h: 120,
      body: `${mark(cw)}<g transform="translate(${f(120 + GAP - wm.x0)} ${f(base)})">${wm.svg}</g>`,
      x: cap,
    };
  }
  // stacked
  const gap = 26;
  const w = Math.max(120, wm.width);
  const h = 120 + gap + cap;
  return {
    w: f(w), h: f(h),
    body: `<g transform="translate(${f((w - 120) / 2)} 0)">${mark(cw)}</g><g transform="translate(${f((w - wm.width) / 2 - wm.x0)} ${f(120 + gap + cap)})">${wm.svg}</g>`,
    x: cap,
  };
}

const svgDoc = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const meta = {};
const kinds = ["horizontal", "stacked", "wordmark", "mark"];
for (const kind of kinds) {
  for (const [cwName, cw] of Object.entries(colourways)) {
    const l = lockup(kind, cw);
    const name = `rjmlaird-${kind}-${cwName}`;
    writeFileSync(join(out, `${name}.svg`), svgDoc(l.w, l.h, l.body, "RJM Laird"));
    // PNG: 1200 wide (512 for the square mark), transparent background
    const width = kind === "mark" ? 512 : 1200;
    await sharp(Buffer.from(svgDoc(l.w, l.h, l.body, "RJM Laird")), { density: 384 })
      .resize({ width })
      .png()
      .toFile(join(out, `${name}.png`));
    meta[kind] ??= { w: l.w, h: l.h, capRatio: f(l.x / l.h) };
  }
}
writeFileSync(join(root, "src/data/logos.generated.json"), JSON.stringify(meta, null, 2) + "\n");

// Favicon: simplified mark (heavier strokes survive 16px) on a rounded Ink tile.
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="26" fill="${INK}"/><g transform="translate(4 4)">${mark({ fg: WHITE, accent: TEAL }, true)}</g></svg>\n`;
writeFileSync(join(root, "public/favicon.svg"), fav);
await sharp(Buffer.from(fav), { density: 300 }).resize(180, 180).png().toFile(join(root, "public/apple-touch-icon.png"));

// Social preview image, 1200 × 630.
const textPath = (font, str, x, y, size, fill, track = 0) =>
  `<path d="${font.getPath(str, x, y, size, { letterSpacing: track, kerning: true }).toPathData(2)}" fill="${fill}"/>`;
const hero = lockup("horizontal", colourways["colour-on-dark"]);
const scale = 1.55;
const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<rect width="1200" height="630" fill="${INK}"/>
<g transform="translate(80 ${f(330 - (hero.h * scale) / 2)}) scale(${scale})">${hero.body}</g>
${textPath(bold, "BRAND PORTAL", 80, 140, 26, TEAL, 0.22)}
<rect x="80" y="452" width="1040" height="1" fill="#fff" fill-opacity=".14"/>
${textPath(medium, "Precise, plain and curious.", 80, 520, 40, WHITE, -0.01)}
${textPath(medium, "brand.rjmlaird.co.uk", 80, 575, 24, "#9AA4B8")}
</svg>\n`;
writeFileSync(join(root, "public/og.svg"), og);
await sharp(Buffer.from(og), { density: 96 }).resize(1200, 630).png().toFile(join(root, "public/og.png"));

console.log(`wrote ${kinds.length * 3} SVG + PNG logos, favicon, apple-touch-icon, og image`);
console.log(JSON.stringify(meta));
