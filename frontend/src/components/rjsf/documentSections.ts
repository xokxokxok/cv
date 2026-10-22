export interface SectionMeta {
  /** Property key in the document JSON (also the anchor id suffix). */
  key: string;
  /** Human-readable name shown in the navigation and section header. */
  label: string;
  /**
   * Material Symbols name used when the section has no `icon` in the document
   * data. The section's own `icon` always wins (see sectionIconName).
   */
  defaultIcon: string;
  /** One-line explanation of what this section controls on the live CV page. */
  description: string;
}

/**
 * Ordered metadata for every top-level CV section. Drives the editor sidebar
 * navigation and the contextual header so the user always knows *where* they
 * are and *what* part of the public CV they are editing.
 */
export const DOCUMENT_SECTIONS: SectionMeta[] = [
  {
    key: "engagement",
    label: "Engagement",
    defaultIcon: "handshake",
    description:
      "The availability banner and the Engagement / Work authorization / Availability cards at the top of your CV.",
  },
  {
    key: "contact",
    label: "Contact",
    defaultIcon: "contact_mail",
    description:
      "Your contact card — email, WhatsApp, phone, LinkedIn and location.",
  },
  {
    key: "summary",
    label: "Professional Summary",
    defaultIcon: "person",
    description: "The paragraphs shown under “Professional Summary”.",
  },
  {
    key: "impact",
    label: "Selected Impact",
    defaultIcon: "bolt",
    description: "The highlighted bullet points under “Selected Impact”.",
  },
  {
    key: "expertise",
    label: "Core Technical Expertise",
    defaultIcon: "code",
    description:
      "The grouped skill lists under “Core Technical Expertise” (languages, cloud, integrations…).",
  },
  {
    key: "experience",
    label: "Professional Experience",
    defaultIcon: "work_history",
    description: "Your work history — one entry per role, newest first.",
  },
  {
    key: "education",
    label: "Education",
    defaultIcon: "school",
    description: "The entries listed under “Education”.",
  },
  {
    key: "languages",
    label: "Language Skills",
    defaultIcon: "translate",
    description: "The cards under “Language Skills”.",
  },
  {
    key: "projects",
    label: "Current Technical Projects",
    defaultIcon: "rocket_launch",
    description: "The entries under “Current Technical Projects”.",
  },
];

export const SECTION_LABELS: Record<string, string> = Object.fromEntries(
  DOCUMENT_SECTIONS.map((section) => [section.key, section.label]),
);

export const SECTION_MAP: Record<string, SectionMeta> = Object.fromEntries(
  DOCUMENT_SECTIONS.map((section) => [section.key, section]),
);

/**
 * Icon of a section as stored in the document data (`<section>.icon`),
 * falling back to the section's default when it is not set.
 */
export function sectionIconName(key: string, formData: unknown): string {
  const section = (formData as Record<string, { icon?: unknown } | undefined> | null)?.[key];
  const icon = typeof section?.icon === "string" ? section.icon.trim() : "";
  return icon || SECTION_MAP[key]?.defaultIcon || "article";
}
