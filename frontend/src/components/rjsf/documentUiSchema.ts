import type { UiSchema } from "@rjsf/utils";
import { experienceHeader } from "./entryHeaders";

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

/**
 * Layout conventions used below
 * -----------------------------
 * `ui:options.span` sizes a field in Ant Design's 24-column grid, so a month
 * or a colour never occupies the same width as a company name. Spans in each
 * group are chosen to add up to 24 so fields line up in clean rows.
 */

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

/** Multiline item used inside long-form bullet lists. */
const multilineItem: UiSchema = {
  ...hidden,
  "ui:widget": "textarea",
  "ui:options": { label: false, rows: 2 },
};

/** Unlabelled list of paragraphs. */
const plainTextareaArray: UiSchema = {
  ...hidden,
  "ui:options": { label: false, itemVariant: "plain", addLabel: "Add paragraph" },
  items: multilineItem,
};

/** Labelled list of paragraphs. */
const labeledTextareaArray: UiSchema = {
  "ui:options": { itemVariant: "plain", addLabel: "Add item" },
  items: multilineItem,
};

/** Short values entered as tags rather than one input per line. */
const tagArray: UiSchema = {
  "ui:field": "TagListField",
  "ui:fieldReplacesAnyOrOneOf": true,
  ...hidden,
};

/** Icon glyph + accent colour, side by side. */
const iconInline: UiSchema = {
  ...hidden,
  "ui:options": { label: false },
  "ui:order": ["name", "color"],
  name: { "ui:title": "Icon", "ui:widget": "IconNameWidget", "ui:options": { span: 13 } },
  color: { "ui:title": "Color", "ui:widget": "ColorWidget", "ui:options": { span: 11 } },
};

/** Month + year on one line. */
const startPeriod: UiSchema = {
  "ui:title": "Started",
  "ui:field": "StartPeriodField",
  "ui:fieldReplacesAnyOrOneOf": true,
};

const endPeriod: UiSchema = {
  "ui:title": "Ended",
  "ui:field": "EndDateField",
  "ui:fieldReplacesAnyOrOneOf": true,
};

/**
 * Section icon + accent colour + heading, shown in the collapsed appearance
 * panel. The icon is a Material Symbols name (see SectionIconWidget).
 */
const sectionMeta: UiSchema = {
  ...hidden,
  "ui:order": ["icon", "color", "title", "content"],
  icon: {
    "ui:title": "Icon",
    "ui:widget": "SectionIconWidget",
    "ui:options": { span: 8 },
  },
  color: {
    "ui:title": "Card theme",
    "ui:widget": "ThemeColorWidget",
    "ui:options": { span: 6 },
  },
  title: { "ui:title": "Heading", "ui:options": { span: 10 } },
};

/** icon + title on one row, then a single-line value. */
const listEntryItem: UiSchema = {
  ...hidden,
  "ui:options": { label: false },
  "ui:order": ["icon", "title", "content"],
  icon: { ...iconInline, "ui:options": { label: false, span: 9 } },
  title: { "ui:title": "Label", "ui:options": { span: 15 } },
  content: { "ui:title": "Value", "ui:options": { span: 24 } },
};

const listEntriesArray: UiSchema = {
  ...silentArray,
  "ui:options": { label: false, itemVariant: "bordered", addLabel: "Add card" },
  items: listEntryItem,
};

/** Job identity: two rows of fields sized to their content. */
const experienceJobFields: UiSchema = {
  ...hidden,
  "ui:options": { label: false },
  "ui:order": [
    "company",
    "job_title",
    "start",
    "end",
    "location_type",
    "location",
    "contract_type",
  ],
  company: { "ui:title": "Company", "ui:options": { span: 10 } },
  job_title: { "ui:title": "Job title", "ui:options": { span: 14 } },
  start: { ...startPeriod, "ui:options": { span: 7 } },
  end: { ...endPeriod, "ui:options": { span: 10 } },
  location_type: {
    "ui:title": "Location type",
    "ui:widget": "LocationTypeWidget",
    "ui:options": { span: 7 },
  },
  location: {
    ...hidden,
    "ui:options": { label: false, span: 17 },
    "ui:order": ["city", "state", "country"],
    city: { "ui:title": "City", "ui:options": { span: 10 } },
    state: { "ui:title": "State", "ui:options": { span: 7 } },
    country: { "ui:title": "Country", "ui:options": { span: 7 } },
  },
  contract_type: {
    "ui:title": "Contract",
    "ui:widget": "ContractTypeWidget",
    "ui:options": { span: 7 },
  },
};

/** What the role actually involved — long text, so full-width rows. */
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
  activities: { "ui:title": "Activities", ...labeledTextareaArray },
  stack: {
    ...hidden,
    "ui:options": { label: false },
    "ui:order": ["languages_and_libs", "others"],
    languages_and_libs: {
      ...tagArray,
      "ui:options": { label: false, span: 12, title: "Languages and libraries" },
    },
    others: {
      ...tagArray,
      "ui:options": { label: false, span: 12, title: "Other tools" },
    },
  },
};

const experienceEntry: UiSchema = {
  ...hidden,
  "ui:options": { label: false, itemVariant: "collapse" },
  "ui:order": ["title", "content"],
  title: experienceJobFields,
  content: experienceRoleBody,
};

const educationEntry: UiSchema = {
  ...hidden,
  "ui:options": { label: false },
  "ui:order": ["icon", "title", "description", "start", "end"],
  icon: { ...iconInline, "ui:options": { label: false, span: 9 } },
  title: { "ui:title": "Institution", "ui:options": { span: 15 } },
  description: {
    "ui:title": "Description",
    "ui:widget": "textarea",
    "ui:options": { rows: 2, span: 24 },
  },
  start: { ...startPeriod, "ui:options": { span: 9 } },
  end: { ...endPeriod, "ui:options": { span: 15 } },
};

const projectEntry: UiSchema = {
  ...hidden,
  "ui:options": { label: false },
  "ui:order": ["icon", "title", "content"],
  icon: { ...iconInline, "ui:options": { label: false, span: 9 } },
  title: { "ui:title": "Project", "ui:options": { span: 15 } },
  content: { "ui:title": "Characteristics", ...labeledTextareaArray },
};

const expertiseEntry: UiSchema = {
  ...hidden,
  "ui:options": { label: false },
  "ui:order": ["title", "content"],
  title: { "ui:title": "Group", "ui:options": { span: 24 } },
  content: {
    "ui:field": "ExpertiseContentField",
    "ui:fieldReplacesAnyOrOneOf": true,
    ...hidden,
    "ui:options": { label: false, span: 24 },
  },
};

export const documentUiSchema: UiSchema = {
  "ui:order": [...DOCUMENT_SECTION_KEYS],
  "ui:submitButtonOptions": { norender: true },

  engagement: { ...hidden, ...sectionMeta, content: listEntriesArray },
  contact: { ...hidden, ...sectionMeta, content: listEntriesArray },
  languages: { ...hidden, ...sectionMeta, content: listEntriesArray },
  summary: { ...hidden, ...sectionMeta, content: plainTextareaArray },
  impact: { ...hidden, ...sectionMeta, content: plainTextareaArray },
  expertise: {
    ...hidden,
    ...sectionMeta,
    content: {
      ...silentArray,
      "ui:options": { label: false, itemVariant: "bordered", addLabel: "Add group" },
      items: expertiseEntry,
    },
  },
  experience: {
    ...hidden,
    ...sectionMeta,
    content: {
      ...silentArray,
      "ui:options": {
        label: false,
        itemVariant: "collapse",
        itemHeader: experienceHeader,
        addLabel: "Add role",
      },
      items: experienceEntry,
    },
  },
  education: {
    ...hidden,
    ...sectionMeta,
    content: {
      ...silentArray,
      "ui:options": {
        label: false,
        itemVariant: "bordered",
        addLabel: "Add education",
      },
      items: educationEntry,
    },
  },
  projects: {
    ...hidden,
    ...sectionMeta,
    content: {
      ...silentArray,
      "ui:options": {
        label: false,
        itemVariant: "bordered",
        addLabel: "Add project",
      },
      items: projectEntry,
    },
  },
};
