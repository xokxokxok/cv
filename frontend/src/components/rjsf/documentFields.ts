import type { RegistryFieldsType } from "@rjsf/utils";
import EndDateField, { StartPeriodField } from "./PeriodFields";
import ExpertiseContentField from "./ExpertiseContentField";
import TagListField from "./TagListField";

export const documentFields: RegistryFieldsType = {
  EndDateField,
  ExpertiseContentField,
  StartPeriodField,
  TagListField,
};
