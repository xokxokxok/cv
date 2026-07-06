import { Card, Space } from "antd";
import type {
  FormContextType,
  ObjectFieldTemplateProps,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import {
  canExpand,
  descriptionId,
  getTemplate,
  getUiOptions,
  buttonId,
} from "@rjsf/utils";
import DefaultObjectFieldTemplate from "@rjsf/core/lib/components/templates/ObjectFieldTemplate.js";

/** Human-readable labels for CV document top-level sections. */
const SECTION_LABELS: Record<string, string> = {
  engagement: "Engagement",
  contact: "Contact",
  summary: "Professional Summary",
  impact: "Selected Impact",
  expertise: "Core Technical Expertise",
  experience: "Professional Experience",
  education: "Education",
  languages: "Language Skills",
  projects: "Current Technical Projects",
};

function sectionTitle(
  name: string,
  formData: Record<string, unknown> | undefined,
): string {
  const section = formData?.[name];
  if (
    section &&
    typeof section === "object" &&
    section !== null &&
    "title" in section &&
    typeof (section as { title?: unknown }).title === "string" &&
    (section as { title: string }).title.trim()
  ) {
    return (section as { title: string }).title;
  }

  return SECTION_LABELS[name] ?? name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function isRootObject(path: readonly (string | number)[]): boolean {
  return path.length === 0;
}

function isTopLevelSection(path: readonly (string | number)[]): boolean {
  return path.length === 1;
}

/**
 * Renders the root document object as a stack of Ant Design cards (one per
 * top-level key). Nested objects keep the default fieldset layout.
 */
export default function SectionedObjectFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ObjectFieldTemplateProps<T, S, F>) {
  const {
    className,
    description,
    disabled,
    formData,
    fieldPathId,
    onAddProperty,
    optionalDataControl,
    properties,
    readonly,
    registry,
    schema,
    uiSchema,
  } = props;

  const options = getUiOptions<T, S, F>(uiSchema);
  const DescriptionFieldTemplate = getTemplate<
    "DescriptionFieldTemplate",
    T,
    S,
    F
  >("DescriptionFieldTemplate", registry, options);
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  const path = fieldPathId.path;
  const data = formData as Record<string, unknown> | undefined;

  if (isRootObject(path)) {
    return (
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {properties
          .filter((prop) => !prop.hidden)
          .map((prop) => (
            <Card
              key={prop.name}
              id={`${fieldPathId.$id}_${prop.name}`}
              title={sectionTitle(prop.name, data)}
              styles={{ body: { paddingTop: 16 } }}
            >
              {prop.content}
            </Card>
          ))}
      </Space>
    );
  }

  if (isTopLevelSection(path)) {
    return (
      <div className={className} id={fieldPathId.$id}>
        {description && (
          <DescriptionFieldTemplate
            id={descriptionId(fieldPathId)}
            description={description}
            schema={schema}
            uiSchema={uiSchema}
            registry={registry}
          />
        )}
        {optionalDataControl}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {properties
            .filter((prop) => !prop.hidden)
            .map((prop) => (
              <div key={prop.name}>{prop.content}</div>
            ))}
        </Space>
        {canExpand<T, S, F>(schema, uiSchema, formData) && (
          <AddButton
            id={buttonId(fieldPathId, "add")}
            className="rjsf-object-property-expand"
            onClick={onAddProperty}
            disabled={disabled || readonly}
            uiSchema={uiSchema}
            registry={registry}
          />
        )}
      </div>
    );
  }

  return <DefaultObjectFieldTemplate {...props} />;
}
