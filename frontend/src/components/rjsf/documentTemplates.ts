import DocumentArrayFieldItemTemplate from "./DocumentArrayFieldItemTemplate";
import DocumentArrayFieldTemplate from "./DocumentArrayFieldTemplate";
import DocumentFieldTemplate from "./DocumentFieldTemplate";
import SectionedObjectFieldTemplate from "./SectionedObjectFieldTemplate";

export const documentTemplates = {
  FieldTemplate: DocumentFieldTemplate,
  ObjectFieldTemplate: SectionedObjectFieldTemplate,
  ArrayFieldTemplate: DocumentArrayFieldTemplate,
  ArrayFieldItemTemplate: DocumentArrayFieldItemTemplate,
};

export const documentFormContext = {
  labelAlign: "left" as const,
  rowGutter: 16,
  colSpan: 12,
  descriptionLocation: "below" as const,
};
