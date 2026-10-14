/** WCAG 2.x relative luminance and contrast ratio, computed from hex. */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ratio(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** "#RRGGBB" → "0, 194, 168" */
export function rgbString(hex: string): string {
  return hexToRgb(hex).join(", ");
}

/** Alpha-composite `rgba(r,g,b,a)` over an opaque hex background; returns "#RRGGBB". */
export function blend(rgba: string, bgHex: string): string {
  const m = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (!m) throw new Error(`blend: cannot parse ${rgba}`);
  const a = m[4] === undefined ? 1 : parseFloat(m[4]);
  const fg = [+m[1], +m[2], +m[3]];
  const bg = hexToRgb(bgHex);
  const out = fg.map((v, i) => Math.round(v * a + bg[i] * (1 - a)));
  return "#" + out.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export type Grade ="AAA" | "AA" | "AA large" | "Fail";

/** AAA ≥ 7, AA ≥ 4.5, AA large text and graphics ≥ 3, otherwise Fail. */
export function grade(r: number): Grade {
  if (r >= 7) return "AAA";
  if (r >= 4.5) return "AA";
  if (r >= 3) return "AA large";
  return "Fail";
}

/** Two decimals, rounded down so a reported pass is never rounded up from a fail. */
export function fmt(r: number): string {
  return (Math.floor(r * 100) / 100).toFixed(2);
}
