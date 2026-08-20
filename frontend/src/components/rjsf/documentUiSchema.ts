import type { UiSchema } from "@rjsf/utils";

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

/** Hide field / object chrome (no legend, no Form.Item label). */
const hidden = {
  "ui:label": false,
  "ui:options": { label: false },
} as unknown as UiSchema;

/** Array without a section heading or entry counter. */
const silentArray: UiSchema = {
  ...hidden,
  "ui:options": { label: false, itemVariant: "bordered" },
};

/** Multiline (textarea) string item for long-form list entries. */
const multilineItem: UiSchema = {
  ...hidden,
  "ui:widget": "textarea",
  "ui:options": { label: false, rows: 3 },
};

/** Plain array of multiline textareas, no per-item label (long paragraphs). */
const plainTextareaArray: UiSchema = {
  ...hidden,
  "ui:options": { label: false, itemVariant: "plain" },
  items: multilineItem,
};

/** Labeled plain array of multiline textareas (long-form bullet lists). */
const labeledTextareaArray: UiSchema = {
  "ui:options": { itemVariant: "plain" },
  items: multilineItem,
};

/** Icon name + color on the same row — no "Icon" wrapper. */
const iconInline: UiSchema = {
  ...hidden,
  "ui:options": { inline: true, label: false },
  "ui:order": ["name", "color"],
  name: { "ui:title": "Icon" },
  color: { "ui:title": "Color" },
};

const periodInline: UiSchema = {
  ...hidden,
  "ui:options": { inline: true, label: false },
  "ui:order": ["month", "year"],
  month: { "ui:title": "Month" },
  year: { "ui:title": "Year" },
};

const locationInline: UiSchema = {
  ...hidden,
  "ui:options": { inline: true, label: false },
  "ui:order": ["city", "state", "country"],
  city: { "ui:title": "City" },
  state: { "ui:title": "State" },
  country: { "ui:title": "Country" },
};

const listEntryItem: UiSchema = {
  ...hidden,
  "ui:options": { layout: "listEntry", label: false },
  "ui:order": ["icon", "title", "content"],
  icon: iconInline,
  title: { "ui:title": "Title" },
  content: {
    "ui:title": "Content",
    "ui:widget": "textarea",
    "ui:options": { rows: 2 },
  },
};

const listEntriesArray: UiSchema = {
  ...silentArray,
  items: listEntryItem,
};

const sectionMeta: UiSchema = {
  ...hidden,
  "ui:order": ["color", "title", "icon", "content"],
  color: { "ui:title": "Color" },
  title: { "ui:title": "Title" },
  icon: iconInline,
};

/** Array items without per-item labels; optional section label via ui:title. */
const labeledPlainArray: UiSchema = {
  "ui:options": { itemVariant: "plain" },
  items: hidden,
};

const experienceJobFields: UiSchema = {
  "ui:options": { layout: "experienceJob" },
  "ui:order": [
    "company",
    "job_title",
    "start",
    "end",
    "location",
    "location_type",
    "contract_type",
  ],
  company: { "ui:title": "Company" },
  job_title: { "ui:title": "Job title" },
  start: {
    ...periodInline,
    month: { "ui:title": "Start month" },
    year: { "ui:title": "Start year" },
  },
  end: {
    "ui:title": "End date",
    "ui:field": "EndDateField",
    "ui:fieldReplacesAnyOrOneOf": true,
  },
  location: locationInline,
  location_type: { "ui:title": "Location type" },
  contract_type: { "ui:title": "Contract type" },
};

const experienceRoleBody: UiSchema = {
  "ui:options": { layout: "stacked" },
  "ui:order": ["context", "role", "activities", "stack"],
  context: {
    "ui:title": "Context",
    "ui:widget": "textarea",
    "ui:options": { rows: 2 },
  },
  role: {
    "ui:title": "Role",
    "ui:widget": "textarea",
    "ui:options": { rows: 3 },
  },
  activities: {
    "ui:title": "Activities",
    ...labeledTextareaArray,
  },
  stack: {
    "ui:options": { layout: "stacked" },
    "ui:order": ["languages_and_libs", "others"],
    languages_and_libs: {
      "ui:title": "Languages and libraries",
      ...labeledPlainArray,
    },
    others: {
      "ui:title": "Other tools",
      "ui:field": "NullableStringArrayField",
      "ui:fieldReplacesAnyOrOneOf": true,
    },
  },
};

const experienceEntry: UiSchema = {
  ...hidden,
  "ui:options": { layout: "experienceRole", label: false, itemVariant: "bordered" },
  title: experienceJobFields,
  content: experienceRoleBody,
};

const educationEntry: UiSchema = {
  ...hidden,
  "ui:options": { layout: "entry", label: false },
  "ui:order": ["icon", "title", "description", "start", "end"],
  icon: iconInline,
  title: { "ui:title": "Institution" },
  description: {
    "ui:title": "Description",
    "ui:widget": "textarea",
    "ui:options": { rows: 2 },
  },
  start: {
    ...periodInline,
    month: { "ui:title": "Start month" },
    year: { "ui:title": "Start year" },
  },
  end: {
    "ui:title": "End date",
    "ui:field": "EndDateField",
    "ui:fieldReplacesAnyOrOneOf": true,
  },
};

const projectEntry: UiSchema = {
  ...hidden,
  "ui:options": { layout: "entry", label: false },
  "ui:order": ["icon", "title", "content"],
  icon: iconInline,
  title: { "ui:title": "Title" },
  content: {
    "ui:title": "Characteristics",
    ...labeledTextareaArray,
  },
};

const expertiseEntry: UiSchema = {
  ...hidden,
  "ui:order": ["title", "content"],
  title: { "ui:title": "Group" },
  content: {
    "ui:field": "ExpertiseContentField",
    "ui:fieldReplacesAnyOrOneOf": true,
    ...hidden,
  },
};

export const documentUiSchema: UiSchema = {
  "ui:order": [...DOCUMENT_SECTION_KEYS],
  "ui:submitButtonOptions": { norender: true },

  engagement: {
    ...hidden,
    ...sectionMeta,
    content: listEntriesArray,
  },
  contact: {
    ...hidden,
    ...sectionMeta,
    content: listEntriesArray,
  },
  summary: {
    ...hidden,
    ...sectionMeta,
    content: plainTextareaArray,
  },
  impact: {
    ...hidden,
    ...sectionMeta,
    content: plainTextareaArray,
  },
  expertise: {
    ...hidden,
    ...sectionMeta,
    content: {
      ...silentArray,
      items: expertiseEntry,
    },
  },
  experience: {
    ...hidden,
    ...sectionMeta,
    content: {
      ...silentArray,
      items: experienceEntry,
    },
  },
  education: {
    ...hidden,
    ...sectionMeta,
    content: {
      ...silentArray,
      items: educationEntry,
    },
  },
  languages: {
    ...hidden,
    ...sectionMeta,
    content: listEntriesArray,
  },
  projects: {
    ...hidden,
    ...sectionMeta,
    content: {
      ...silentArray,
      items: projectEntry,
    },
  },
};
