/** Single source for every page, the token downloads and `npm run check`. */

export const brand = {
  name: "RJM Laird",
  person: "Ryan Laird",
  version: "1.0",
  year: 2026,
  mainSite: "https://rjmlaird.co.uk",
  description:
    "Ryan Laird is an astrophysicist, science communicator and strategist working across space, sustainability and technology.",
} as const;

export type Swatch = {
  id: string;
  name: string;
  token: string;
  hex: string;
  role: string;
  usage: string;
};

export const surfaces: Swatch[] = [
  { id: "ink", name: "Ink", token: "--ink", hex: "#0B0F1A", role: "Page background", usage: "The default canvas. Also the text colour on teal, amber and other bright fills." },
  { id: "ink2", name: "Ink 2", token: "--ink2", hex: "#0F1520", role: "Alternate section background", usage: "Alternating bands on long pages, so sections separate without a border." },
  { id: "card", name: "Card", token: "--card", hex: "#141B29", role: "Raised surface", usage: "Cards, panels, code blocks and inputs." },
  { id: "lift", name: "Lift", token: "--lift", hex: "#1A2236", role: "Hover and pressed surface", usage: "Hover, focus-within and selected states on cards and rows." },
];

export const text: Swatch[] = [
  { id: "w", name: "Warm White", token: "--w", hex: "#EDEAE3", role: "Headings and primary text", usage: "Headings, key labels and body text in dark mode. The brand's off-white; use it instead of pure white." },
  { id: "mb", name: "Mist", token: "--mb", hex: "#9AA4B8", role: "Secondary text", usage: "Body copy beneath headings, captions and descriptions. 4.5:1 or better on every surface." },
  { id: "m", name: "Haze", token: "--m", hex: "#8A98B2", role: "Muted text", usage: "Metadata and de-emphasised labels. Avoid on very small text over Lift." },
];

export type Accent = Swatch & { dim: string; border: string; dimToken: string; borderToken: string };

export const accents: Accent[] = [
  { id: "teal", name: "Teal", token: "--teal", hex: "#00C2A8", dim: "rgba(0,194,168,.13)", border: "rgba(0,194,168,.26)", dimToken: "--td", borderToken: "--tb", role: "Primary accent", usage: "Links, buttons, the “Laird” in the wordmark, active navigation and the focus-adjacent highlight. The brand's signature." },
  { id: "amber", name: "Amber", token: "--amber", hex: "#F5A623", dim: "rgba(245,166,35,.11)", border: "rgba(245,166,35,.26)", dimToken: "--ad", borderToken: "--ab", role: "Credentials and warmth", usage: "Post-nominals and credential lines, the “paused” status, and the lead accent on the space theme." },
  { id: "violet", name: "Violet", token: "--violet", hex: "#A78BFA", dim: "rgba(167,139,250,.11)", border: "rgba(167,139,250,.26)", dimToken: "--vd", borderToken: "--vb", role: "Science and education", usage: "Science and education content, and secondary highlights alongside teal." },
  { id: "coral", name: "Coral", token: "--coral", hex: "#FF8080", dim: "rgba(255,128,128,.11)", border: "rgba(255,128,128,.3)", dimToken: "--cd", borderToken: "--cb", role: "Attention", usage: "Blocked status, warnings and errors. Always paired with a word or icon." },
  { id: "green", name: "Green", token: "--green", hex: "#4ADE80", dim: "rgba(74,222,128,.11)", border: "rgba(74,222,128,.26)", dimToken: "--gd", borderToken: "--gb", role: "Positive and complete", usage: "Done status, success messages and environment or sustainability content." },
  { id: "sky", name: "Sky", token: "--sky", hex: "#38BDF8", dim: "rgba(56,189,248,.11)", border: "rgba(56,189,248,.26)", dimToken: "--sd", borderToken: "--sb", role: "Technology and planned", usage: "Technology content and the “planned” status." },
];

export const lines = [
  { name: "Border", token: "--bd", value: "rgba(255,255,255,.11)", usage: "Hairlines between rows, around cards and under the nav." },
  { name: "Border strong", token: "--bm", value: "rgba(255,255,255,.2)", usage: "Outlined buttons, input borders and hover borders." },
  { name: "Focus", token: "--focus", value: "#7FE6D4", usage: "The 3px focus ring, on every interactive element." },
];

/** Roles that already exist in the live site's CSS. */
export const statusRoles = [
  { label: "Planned", colour: "sky", hex: "#38BDF8" },
  { label: "In progress", colour: "teal", hex: "#00C2A8" },
  { label: "Blocked", colour: "coral", hex: "#FF8080" },
  { label: "Paused", colour: "amber", hex: "#F5A623" },
  { label: "Done", colour: "green", hex: "#4ADE80" },
] as const;

export const topicRoles = [
  { label: "Space", colour: "amber", hex: "#F5A623" },
  { label: "Energy", colour: "green", hex: "#4ADE80" },
  { label: "Technology", colour: "sky", hex: "#38BDF8" },
  { label: "Science", colour: "violet", hex: "#A78BFA" },
  { label: "Projects", colour: "teal", hex: "#00C2A8" },
] as const;

/** Colours outside the core palette, used only for contrast comparisons. */
export const extras = { white: "#FFFFFF" } as const;

/** Pairs the brand relies on. `check` fails the build if any drops below `min`. */
export const safePairs: { fg: string; bg: string; use: string; min: number }[] = [
  { fg: "#EDEAE3", bg: "#0B0F1A", use: "Headings and body on Ink", min: 7 },
  { fg: "#EDEAE3", bg: "#141B29", use: "Headings and body on Card", min: 7 },
  { fg: "#EDEAE3", bg: "#1A2236", use: "Headings and body on Lift", min: 7 },
  { fg: "#9AA4B8", bg: "#0B0F1A", use: "Secondary text on Ink", min: 4.5 },
  { fg: "#9AA4B8", bg: "#141B29", use: "Secondary text on Card", min: 4.5 },
  { fg: "#9AA4B8", bg: "#1A2236", use: "Secondary text on Lift", min: 4.5 },
  { fg: "#8A98B2", bg: "#0B0F1A", use: "Muted text on Ink", min: 4.5 },
  { fg: "#8A98B2", bg: "#141B29", use: "Muted text on Card", min: 4.5 },
  { fg: "#00C2A8", bg: "#0B0F1A", use: "Teal text and links on Ink", min: 4.5 },
  { fg: "#00C2A8", bg: "#141B29", use: "Teal text and links on Card", min: 4.5 },
  { fg: "#F5A623", bg: "#0B0F1A", use: "Amber text on Ink", min: 4.5 },
  { fg: "#A78BFA", bg: "#0B0F1A", use: "Violet text on Ink", min: 4.5 },
  { fg: "#FF8080", bg: "#0B0F1A", use: "Coral text on Ink", min: 4.5 },
  { fg: "#4ADE80", bg: "#0B0F1A", use: "Green text on Ink", min: 4.5 },
  { fg: "#38BDF8", bg: "#0B0F1A", use: "Sky text on Ink", min: 4.5 },
  { fg: "#0B0F1A", bg: "#00C2A8", use: "Ink on a teal button", min: 4.5 },
  { fg: "#7FE6D4", bg: "#0B0F1A", use: "Focus ring against Ink (graphic, 3:1)", min: 3 },
];

/** Figures printed in the Accessibility Guidance PDF, re-checked by `npm run check`. */
export const pdfClaims = [
  { fg: "#0B0F1A", bg: "#EDEAE3", printed: 15.93 },
  { fg: "#0B0F1A", bg: "#00C2A8", printed: 8.46 },
  { fg: "#00C2A8", bg: "#EDEAE3", printed: 1.88 },
  { fg: "#0B0F1A", bg: "#FFFFFF", printed: 18.47 },
] as const;

export const nav = [
  { label: "Logo", href: "/logo/" },
  { label: "Colours", href: "/colours/" },
  { label: "Typography", href: "/typography/" },
  { label: "Visual language", href: "/visual-language/" },
  { label: "Applications", href: "/applications/" },
  { label: "Accessibility", href: "/accessibility/" },
  { label: "Downloads", href: "/downloads/" },
  { label: "Developers", href: "/developers/" },
] as const;

export const siteFamily = [
  { name: "rjmlaird.co.uk", href: "https://rjmlaird.co.uk", role: "Home, services and writing", theme: "Teal accent" },
  { name: "cv.rjmlaird.co.uk", href: "https://cv.rjmlaird.co.uk", role: "Curriculum vitae and ATS view", theme: "Teal accent" },
  { name: "space.rjmlaird.co.uk", href: "https://space.rjmlaird.co.uk", role: "Astronomy and space satellite site", theme: "Amber accent (data-theme=\"space\")" },
  { name: "*.labs.rjmlaird.co.uk", href: "https://mechanics.labs.rjmlaird.co.uk", role: "Interactive physics and astronomy labs", theme: "Teal accent" },
  { name: "brand.rjmlaird.co.uk", href: "https://brand.rjmlaird.co.uk", role: "This portal", theme: "Teal accent" },
] as const;
