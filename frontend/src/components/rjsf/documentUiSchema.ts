import type { UiSchema } from "@rjsf/utils";

/** Top-level section keys in display order (matches CV schema). */
export const DOCUMENT_SECTION_KEYS = [
  "engagement",
  "contact",
  "summary",
  "impact",
  "expertise",
  "experience",
  "education",
  "languages",
  "projects",
] as const;

/** uiSchema tweaks: section order and hide duplicate titles inside cards. */
export const documentUiSchema: UiSchema = {
  "ui:order": [...DOCUMENT_SECTION_KEYS],
  "ui:submitButtonOptions": { norender: true },
  ...Object.fromEntries(
    DOCUMENT_SECTION_KEYS.map((key) => [
      key,
      {
        "ui:title": false,
        "ui:label": false,
        "ui:options": { label: false },
      },
    ]),
  ),
  expertise: {
    "ui:title": false,
    "ui:label": false,
    "ui:options": { label: false },
    content: {
      items: {
        content: {
          "ui:field": "ExpertiseContentField",
          "ui:options": { label: false },
        },
      },
    },
  },
};
