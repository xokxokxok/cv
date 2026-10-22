import DocumentArrayFieldItemTemplate from "./DocumentArrayFieldItemTemplate";
import DocumentArrayFieldTemplate from "./DocumentArrayFieldTemplate";
import DocumentFieldTemplate from "./DocumentFieldTemplate";
import SectionedObjectFieldTemplate from "./SectionedObjectFieldTemplate";
import { cvButtonTemplates } from "./CvButtons";
import {
  ColorWidget,
  ContractTypeWidget,
  IconNameWidget,
  LocationTypeWidget,
  MonthWidget,
  SectionIconWidget,
  ThemeColorWidget,
  YearWidget,
} from "./CvWidgets";

export const documentTemplates = {
  FieldTemplate: DocumentFieldTemplate,
  ObjectFieldTemplate: SectionedObjectFieldTemplate,
  ArrayFieldTemplate: DocumentArrayFieldTemplate,
  ArrayFieldItemTemplate: DocumentArrayFieldItemTemplate,
  ButtonTemplates: cvButtonTemplates,
};

/** Purpose-built controls for the small, enum-like fields in the CV schema. */
export const documentWidgets = {
  ColorWidget,
  ContractTypeWidget,
  IconNameWidget,
  LocationTypeWidget,
  MonthWidget,
  SectionIconWidget,
  ThemeColorWidget,
  YearWidget,
};

export const documentFormContext = {
  labelAlign: "left" as const,
  rowGutter: 16,
  descriptionLocation: "below" as const,
  wrapperStyle: { marginBottom: 12 },
};
