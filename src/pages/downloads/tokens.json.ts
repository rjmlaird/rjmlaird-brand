import { surfaces, text, accents, lines, brand } from "../../data/brand";

const color = (s: { token: string; hex: string; name: string; role: string }) => ({
  value: s.hex,
  token: s.token,
  name: s.name,
  role: s.role,
});

export const GET = () => {
  const data = {
    $description: `${brand.name} brand tokens v${brand.version}. Generated from brand.rjmlaird.co.uk.`,
    color: {
      surface: Object.fromEntries(surfaces.map((s) => [s.id, color(s)])),
      text: Object.fromEntries(text.map((s) => [s.id, color(s)])),
      accent: Object.fromEntries(
        accents.map((a) => [a.id, { ...color(a), tint: { value: a.dim, token: a.dimToken }, border: { value: a.border, token: a.borderToken } }]),
      ),
      line: Object.fromEntries(lines.map((l) => [l.token.replace("--", ""), { value: l.value, token: l.token, name: l.name }])),
    },
    font: {
      display: '"Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif',
      body: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
      mono: '"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
    },
    layout: { contentMax: "1320px", radius: "6px", navHeight: "3.5rem" },
  };
  return new Response(JSON.stringify(data, null, 2) + "\n", {
    headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" },
  });
};
