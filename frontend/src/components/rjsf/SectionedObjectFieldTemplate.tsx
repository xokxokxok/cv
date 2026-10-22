import { Card, Col, Collapse, Row, Space } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";
import type {
  FormContextType,
  ObjectFieldTemplateProps,
  RJSFSchema,
  StrictRJSFSchema,
  UiSchema,
} from "@rjsf/utils";
import {
  canExpand,
  descriptionId,
  getTemplate,
  getUiOptions,
  buttonId,
} from "@rjsf/utils";
import { SECTION_LABELS } from "./documentSections";

/** Section-level fields that control presentation rather than CV content. */
const APPEARANCE_FIELDS = ["color", "title", "icon"];

type Property = ObjectFieldTemplateProps["properties"][number];

function childType(prop: Property): string | undefined {
  return prop.content.props?.schema?.type as string | undefined;
}

function childUi(uiSchema: UiSchema | undefined, name: string) {
  return getUiOptions((uiSchema as Record<string, UiSchema>)?.[name]);
}

/**
 * Column width for a child field, in Ant Design's 24-column grid.
 *
 * The uiSchema decides it (`ui:options.span`) so a two-digit month never gets
 * the same room as a company name. Without an explicit span, containers and
 * textareas take the full row and everything else takes half of it.
 */
function spanOf(uiSchema: UiSchema | undefined, prop: Property): number {
  const options = childUi(uiSchema, prop.name);
  if (typeof options.span === "number") return options.span;

  const type = childType(prop);
  if (type === "object" || type === "array") return 24;
  if (options.widget === "textarea") return 24;
  return 12;
}

/** Grid of children, each sized by its own span; stacks on small screens. */
function FieldGrid({
  properties,
  uiSchema,
  gutter,
}: {
  properties: Property[];
  uiSchema: UiSchema | undefined;
  gutter: number;
}) {
  return (
    <Row gutter={[gutter, 4]}>
      {properties.map((prop) => (
        <Col key={prop.name} xs={24} md={spanOf(uiSchema, prop)}>
          {prop.content}
        </Col>
      ))}
    </Row>
  );
}

function sectionTitle(
  name: string,
  formData: Record<string, unknown> | undefined,
): string {
  const section = formData?.[name] as { title?: unknown } | undefined;
  if (typeof section?.title === "string" && section.title.trim()) {
    return section.title;
  }
  return (
    SECTION_LABELS[name] ??
    name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

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
  const { rowGutter = 16, activeSection } =
    (registry.formContext as { rowGutter?: number; activeSection?: string }) ?? {};
  const visible = properties.filter((prop) => !prop.hidden);
  const layout = options.layout as string | undefined;
  const ui = uiSchema as UiSchema | undefined;

  // Root: the editor pins one section at a time so the user is never lost in a
  // single giant scroll of every section at once.
  if (path.length === 0) {
    if (activeSection) {
      const active = visible.find((prop) => prop.name === activeSection);
      if (active) {
        return (
          <div id={`${fieldPathId.$id}_${active.name}`}>{active.content}</div>
        );
      }
    }

    return (
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {visible.map((prop) => (
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

  // A top-level section: presentation fields tucked into a collapsed panel so
  // the content itself is what greets the user.
  if (path.length === 1) {
    const appearance = visible.filter((p) => APPEARANCE_FIELDS.includes(p.name));
    const content = visible.filter((p) => !APPEARANCE_FIELDS.includes(p.name));

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
        {appearance.length > 0 && (
          <Collapse
            ghost
            size="small"
            className="cv-appearance"
            style={{ marginBottom: 12 }}
            items={[
              {
                key: "appearance",
                label: (
                  <span style={{ color: "#8c8c8c", fontSize: 13 }}>
                    <BgColorsOutlined style={{ marginRight: 8 }} />
                    Icon, heading &amp; accent color
                  </span>
                ),
                children: (
                  <FieldGrid
                    properties={appearance}
                    uiSchema={ui}
                    gutter={rowGutter}
                  />
                ),
              },
            ]}
          />
        )}
        <FieldGrid properties={content} uiSchema={ui} gutter={rowGutter} />
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

  // Every field on its own full-width row — for bodies made of long text.
  if (layout === "stacked") {
    return (
      <div className={className} id={fieldPathId.$id}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {visible.map((prop) => (
            <div key={prop.name} style={{ width: "100%" }}>
              {prop.content}
            </div>
          ))}
        </Space>
      </div>
    );
  }

  // Default: a grid where each field takes exactly the room its data needs.
  return (
    <div className={className} id={fieldPathId.$id}>
      {optionalDataControl}
      <FieldGrid properties={visible} uiSchema={ui} gutter={rowGutter} />
    </div>
  );
}
