import { Card, Col, Collapse, Row, Space } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";
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
import { SECTION_LABELS } from "./documentSections";

/** Section-level fields that control presentation rather than CV content. */
const APPEARANCE_FIELDS = ["color", "title", "icon"];

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

  return (
    SECTION_LABELS[name] ??
    name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function isRootObject(path: readonly (string | number)[]): boolean {
  return path.length === 0;
}

function isTopLevelSection(path: readonly (string | number)[]): boolean {
  return path.length === 1;
}

function childType(prop: ObjectFieldTemplateProps["properties"][number]): string | undefined {
  return prop.content.props?.schema?.type as string | undefined;
}

function inlineSpan(count: number, index: number): number {
  if (count <= 1) return 24;
  if (count === 2) return 12;
  if (count === 3) return 8;
  return index === count - 1 ? 24 : 8;
}

function InlineObjectLayout<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  properties,
  rowGutter,
}: {
  properties: ObjectFieldTemplateProps<T, S, F>["properties"];
  rowGutter: number;
}) {
  const visible = properties.filter((prop) => !prop.hidden);

  return (
    <Row gutter={rowGutter}>
      {visible.map((prop, index) => (
        <Col key={prop.name} span={inlineSpan(visible.length, index)}>
          {prop.content}
        </Col>
      ))}
    </Row>
  );
}

/** Icon + title on one row, content full width below. */
function ListEntryLayout<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  properties,
  rowGutter,
}: {
  properties: ObjectFieldTemplateProps<T, S, F>["properties"];
  rowGutter: number;
}) {
  const byName = Object.fromEntries(
    properties.filter((p) => !p.hidden).map((p) => [p.name, p]),
  );
  const icon = byName.icon;
  const title = byName.title;
  const content = byName.content;
  const rest = properties.filter(
    (p) => !p.hidden && !["icon", "title", "content"].includes(p.name),
  );

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {(icon || title) && (
        <Row gutter={rowGutter} align="top">
          {icon && (
            <Col xs={24} md={10}>
              {icon.content}
            </Col>
          )}
          {title && (
            <Col xs={24} md={icon ? 14 : 24}>
              {title.content}
            </Col>
          )}
        </Row>
      )}
      {content && <div>{content.content}</div>}
      {rest.length > 0 && (
        <Row gutter={rowGutter}>
          {rest.map((prop) => (
            <Col key={prop.name} span={24}>
              {prop.content}
            </Col>
          ))}
        </Row>
      )}
    </Space>
  );
}

/** Education / project entry: icon+title row, then remaining fields. */
function EntryLayout<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  properties,
  rowGutter,
}: {
  properties: ObjectFieldTemplateProps<T, S, F>["properties"];
  rowGutter: number;
}) {
  const visible = properties.filter((prop) => !prop.hidden);
  const byName = Object.fromEntries(visible.map((p) => [p.name, p]));
  const icon = byName.icon;
  const title = byName.title;
  const firstRow = [icon, title].filter(Boolean);
  const rest = visible.filter(
    (p) => !["icon", "title"].includes(p.name),
  );

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {firstRow.length > 0 && (
        <Row gutter={rowGutter} align="top">
          {icon && (
            <Col xs={24} md={10}>
              {icon.content}
            </Col>
          )}
          {title && (
            <Col xs={24} md={icon ? 14 : 24}>
              {title.content}
            </Col>
          )}
        </Row>
      )}
      {rest.map((prop) => {
        const type = childType(prop);
        const span =
          type === "object" || type === "array" || prop.name === "end"
            ? 24
            : 12;
        return (
          <Row key={prop.name} gutter={rowGutter}>
            <Col span={span}>{prop.content}</Col>
          </Row>
        );
      })}
    </Space>
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
    (registry.formContext as { rowGutter?: number; activeSection?: string }) ??
    {};
  const visible = properties.filter((prop) => !prop.hidden);
  const layout = options.layout as string | undefined;

  if (isRootObject(path)) {
    // When the editor pins a single section, render only that one so the user
    // is never lost in a giant scroll of every section at once. The surrounding
    // card + contextual header is provided by the editor page.
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

  if (isTopLevelSection(path)) {
    const appearanceProps = visible.filter((prop) =>
      APPEARANCE_FIELDS.includes(prop.name),
    );
    const contentProps = visible.filter(
      (prop) => !APPEARANCE_FIELDS.includes(prop.name),
    );

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
        {appearanceProps.length > 0 && (
          <Collapse
            ghost
            size="small"
            defaultActiveKey={["appearance"]}
            style={{ marginBottom: 8 }}
            items={[
              {
                key: "appearance",
                label: (
                  <span style={{ color: "#8c8c8c" }}>
                    <BgColorsOutlined style={{ marginRight: 8 }} />
                    Heading &amp; accent color (optional)
                  </span>
                ),
                children: (
                  <Row gutter={rowGutter}>
                    {appearanceProps.map((prop) => (
                      <Col key={prop.name} span={12}>
                        {prop.content}
                      </Col>
                    ))}
                  </Row>
                ),
              },
            ]}
          />
        )}
        <Row gutter={rowGutter}>
          {contentProps.map((prop) => {
            const type = childType(prop);
            const span =
              type === "object" || type === "array" || prop.name === "content"
                ? 24
                : 12;

            return (
              <Col key={prop.name} span={span}>
                {prop.content}
              </Col>
            );
          })}
        </Row>
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

  if (layout === "listEntry") {
    return (
      <div className={className} id={fieldPathId.$id}>
        <ListEntryLayout properties={properties} rowGutter={rowGutter} />
      </div>
    );
  }

  if (layout === "entry") {
    return (
      <div className={className} id={fieldPathId.$id}>
        <EntryLayout properties={properties} rowGutter={rowGutter} />
      </div>
    );
  }

  if (layout === "experienceRole") {
    const byName = Object.fromEntries(visible.map((p) => [p.name, p]));
    return (
      <div className={className} id={fieldPathId.$id}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {byName.title && <div>{byName.title.content}</div>}
          {byName.content && <div>{byName.content.content}</div>}
        </Space>
      </div>
    );
  }

  if (layout === "stacked") {
    return (
      <div className={className} id={fieldPathId.$id}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {visible.map((prop) => (
            <div key={prop.name} style={{ width: "100%" }}>
              {prop.content}
            </div>
          ))}
        </Space>
      </div>
    );
  }

  if (layout === "experienceJob") {
    const byName = Object.fromEntries(visible.map((p) => [p.name, p]));
    return (
      <div className={className} id={fieldPathId.$id}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {(byName.company || byName.job_title) && (
            <Row gutter={rowGutter}>
              {byName.company && (
                <Col xs={24} md={12}>
                  {byName.company.content}
                </Col>
              )}
              {byName.job_title && (
                <Col xs={24} md={12}>
                  {byName.job_title.content}
                </Col>
              )}
            </Row>
          )}
          {byName.start && <div>{byName.start.content}</div>}
          {byName.end && <div>{byName.end.content}</div>}
          {byName.location && <div>{byName.location.content}</div>}
          {(byName.location_type || byName.contract_type) && (
            <Row gutter={rowGutter}>
              {byName.location_type && (
                <Col xs={24} md={12}>
                  {byName.location_type.content}
                </Col>
              )}
              {byName.contract_type && (
                <Col xs={24} md={12}>
                  {byName.contract_type.content}
                </Col>
              )}
            </Row>
          )}
        </Space>
      </div>
    );
  }

  if (options.inline === true) {
    return (
      <div className={className} id={fieldPathId.$id}>
        <InlineObjectLayout properties={properties} rowGutter={rowGutter} />
      </div>
    );
  }

  return (
    <div className={className} id={fieldPathId.$id}>
      {optionalDataControl}
      <Row gutter={rowGutter}>
        {visible.map((prop) => {
          const type = childType(prop);
          const span =
            type === "object" || type === "array" ? 24 : 12;
          return (
            <Col key={prop.name} span={span}>
              {prop.content}
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
