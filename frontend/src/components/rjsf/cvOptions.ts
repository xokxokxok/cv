/**
 * Shared option sets for the CV form controls.
 *
 * Every value here mirrors something the published CV template understands
 * (see deploy/public/index.html), so small enum-like fields can be pickers
 * instead of free-text inputs the user has to remember the spelling of.
 */

export interface ColorOption {
  value: string;
  hex: string;
}

/** Accent colors available for an icon badge. */
export const ICON_COLORS: ColorOption[] = [
  { value: "blue", hex: "#4099ff" },
  { value: "green", hex: "#2ed8b6" },
  { value: "indigo", hex: "#448aff" },
  { value: "red", hex: "#ff5370" },
  { value: "purple", hex: "#6f42c1" },
  { value: "teal", hex: "#26c6da" },
  { value: "amber", hex: "#ffb64d" },
  { value: "pink", hex: "#d53a78" },
];

/** Card themes available for a whole section. */
export const SECTION_COLORS: ColorOption[] = [
  { value: "blue", hex: "#4099ff" },
  { value: "gold", hex: "#e3aa00" },
  { value: "pink", hex: "#d53a78" },
  { value: "green", hex: "#076933" },
];

export const COLOR_HEX: Record<string, string> = Object.fromEntries(
  [...ICON_COLORS, ...SECTION_COLORS].map((color) => [color.value, color.hex]),
);

/** Material Symbols names the CV template renders; free text is still allowed. */
export const ICON_NAMES = [
  "work", "badge", "schedule", "mail", "phone_iphone", "link", "location_on",
  "school", "flag", "language", "smart_toy", "code", "cloud", "terminal",
  "rocket_launch", "database", "hub", "verified", "public", "insights",
  "business_center", "menu_book", "translate", "handshake", "bolt", "star",
  "contact_mail", "person", "work_history",
];

/**
 * Months are 0-based (0 = January, 11 = December) everywhere: stored data,
 * this form and deploy/public/index.html.
 */
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
].map((label, index) => ({ value: index, label }));

export const LOCATION_TYPES = ["Remote", "On-site", "Hybrid"];

export const CONTRACT_TYPES = [
  "Full-time", "Part-time", "Freelance", "Internship",
  "Independent contractor", "Independent contractor (1099)",
  "Contractor / Employee", "Co-founder (equity partner)", "Founder",
];

/** Prepend a value that is not part of the canonical list so it stays visible. */
export function withCurrent(list: string[], value?: unknown): string[] {
  const current = typeof value === "string" ? value.trim() : "";
  return current && !list.includes(current) ? [current, ...list] : list;
}
