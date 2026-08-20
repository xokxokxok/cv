import type { ComponentType } from "react";
import {
  CodeOutlined,
  ContactsOutlined,
  DeploymentUnitOutlined,
  ProfileOutlined,
  ReadOutlined,
  RocketOutlined,
  SolutionOutlined,
  ThunderboltOutlined,
  TranslationOutlined,
} from "@ant-design/icons";

export interface SectionMeta {
  /** Property key in the document JSON (also the anchor id suffix). */
  key: string;
  /** Human-readable name shown in the navigation and section header. */
  label: string;
  /** Icon used in the navigation menu and section header. */
  icon: ComponentType;
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
    icon: SolutionOutlined,
    description:
      "The availability banner and the Engagement / Work authorization / Availability cards at the top of your CV.",
  },
  {
    key: "contact",
    label: "Contact",
    icon: ContactsOutlined,
    description:
      "Your contact card — email, WhatsApp, phone, LinkedIn and location.",
  },
  {
    key: "summary",
    label: "Professional Summary",
    icon: ProfileOutlined,
    description: "The paragraphs shown under “Professional Summary”.",
  },
  {
    key: "impact",
    label: "Selected Impact",
    icon: ThunderboltOutlined,
    description: "The highlighted bullet points under “Selected Impact”.",
  },
  {
    key: "expertise",
    label: "Core Technical Expertise",
    icon: CodeOutlined,
    description:
      "The grouped skill lists under “Core Technical Expertise” (languages, cloud, integrations…).",
  },
  {
    key: "experience",
    label: "Professional Experience",
    icon: DeploymentUnitOutlined,
    description: "Your work history — one entry per role, newest first.",
  },
  {
    key: "education",
    label: "Education",
    icon: ReadOutlined,
    description: "The entries listed under “Education”.",
  },
  {
    key: "languages",
    label: "Language Skills",
    icon: TranslationOutlined,
    description: "The cards under “Language Skills”.",
  },
  {
    key: "projects",
    label: "Current Technical Projects",
    icon: RocketOutlined,
    description: "The entries under “Current Technical Projects”.",
  },
];

export const SECTION_LABELS: Record<string, string> = Object.fromEntries(
  DOCUMENT_SECTIONS.map((section) => [section.key, section.label]),
);

export const SECTION_MAP: Record<string, SectionMeta> = Object.fromEntries(
  DOCUMENT_SECTIONS.map((section) => [section.key, section]),
);
