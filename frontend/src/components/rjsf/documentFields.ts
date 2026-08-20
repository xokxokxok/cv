import type { RegistryFieldsType } from "@rjsf/utils";
import EndDateField, { NullableStringArrayField } from "./ExperienceFields";
import ExpertiseContentField from "./ExpertiseContentField";

export const documentFields: RegistryFieldsType = {
  ExpertiseContentField,
  EndDateField,
  NullableStringArrayField,
};
