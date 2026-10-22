import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { FieldProps } from "@rjsf/utils";
import { Button, Col, Input, Row, Segmented, Space } from "antd";
import { useEffect, useState, type ReactNode } from "react";
import { TagList } from "./TagListField";

type GroupedTopic = {
  title: string;
  content: string[];
};

type ContentKind = "string-array" | "grouped-list" | "grouped-object";

function detectContentKind(value: unknown): ContentKind {
  if (value == null) return "string-array";

  if (Array.isArray(value)) {
    if (value.length === 0) return "string-array";
    const first = value[0];
    if (typeof first === "string") return "string-array";
    if (typeof first === "object" && first !== null && "title" in first) {
      return "grouped-list";
    }
    return "string-array";
  }

  if (typeof value === "object" && "title" in value && "content" in value) {
    return "grouped-object";
  }

  return "string-array";
}

const KIND_OPTIONS = [
  { value: "string-array", label: "Flat list" },
  { value: "grouped-list", label: "Topics" },
  { value: "grouped-object", label: "Single topic" },
] as const;

function emptyValueForKind(kind: ContentKind): unknown {
  switch (kind) {
    case "grouped-list":
      return [{ title: "", content: [] }];
    case "grouped-object":
      return { title: "", content: [] };
    default:
      return [];
  }
}

function panel(children: ReactNode) {
  return (
    <div
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        padding: 12,
        background: "#fafafa",
      }}
    >
      {children}
    </div>
  );
}

interface GroupedListEditorProps {
  value: GroupedTopic[];
  onChange: (value: GroupedTopic[]) => void;
  disabled?: boolean;
  readonly?: boolean;
}

function GroupedListEditor({
  value,
  onChange,
  disabled,
  readonly,
}: GroupedListEditorProps) {
  const groups = value.length > 0 ? value : [{ title: "", content: [] }];

  function updateGroup(index: number, patch: Partial<GroupedTopic>) {
    onChange(groups.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  }

  function removeGroup(index: number) {
    const copy = groups.filter((_, i) => i !== index);
    onChange(copy.length > 0 ? copy : [{ title: "", content: [] }]);
  }

  return (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      {groups.map((group, index) => (
        <div key={index}>
          {panel(
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Row gutter={8} align="middle" wrap={false}>
                <Col flex="auto">
                  <Input
                    value={group.title}
                    disabled={disabled || readonly}
                    onChange={(e) => updateGroup(index, { title: e.target.value })}
                    placeholder="Topic title"
                  />
                </Col>
                {!readonly && (
                  <Col flex="none">
                    <Button
                      danger
                      type="text"
                      size="small"
                      icon={<MinusCircleOutlined />}
                      disabled={disabled || groups.length === 1}
                      onClick={() => removeGroup(index)}
                    />
                  </Col>
                )}
              </Row>
              <TagList
                value={group.content ?? []}
                disabled={disabled}
                readonly={readonly}
                placeholder="Add a skill and press Enter"
                onChange={(content) => updateGroup(index, { content })}
              />
            </Space>,
          )}
        </div>
      ))}
      {!readonly && (
        <Button
          type="dashed"
          size="small"
          icon={<PlusOutlined />}
          disabled={disabled}
          onClick={() => onChange([...groups, { title: "", content: [] }])}
        >
          Add topic
        </Button>
      )}
    </Space>
  );
}

/**
 * Editor for an expertise group's `content`, which the schema allows to be a
 * flat list of skills, a single titled topic, or several titled topics.
 * The segmented control picks the shape; the values are always entered as tags.
 */
export default function ExpertiseContentField(props: FieldProps) {
  const { formData, onChange, disabled, readonly, fieldPathId } = props;
  const detectedKind = detectContentKind(formData);
  const [kind, setKind] = useState<ContentKind>(detectedKind);

  useEffect(() => {
    setKind(detectedKind);
  }, [detectedKind]);

  function emit(value: unknown) {
    onChange(value, fieldPathId.path);
  }

  function switchKind(nextKind: ContentKind) {
    if (nextKind === kind) return;
    setKind(nextKind);
    emit(emptyValueForKind(nextKind));
  }

  const single = (formData ?? {}) as GroupedTopic;

  return (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      {!readonly && (
        <Segmented
          size="small"
          value={kind}
          options={[...KIND_OPTIONS]}
          disabled={disabled}
          onChange={(value) => switchKind(value as ContentKind)}
        />
      )}

      {kind === "string-array" && (
        <TagList
          value={Array.isArray(formData) ? (formData as string[]) : []}
          disabled={disabled}
          readonly={readonly}
          placeholder="Add a skill and press Enter"
          onChange={emit}
        />
      )}

      {kind === "grouped-list" && (
        <GroupedListEditor
          value={Array.isArray(formData) ? (formData as GroupedTopic[]) : []}
          disabled={disabled}
          readonly={readonly}
          onChange={emit}
        />
      )}

      {kind === "grouped-object" &&
        panel(
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Input
              value={single.title ?? ""}
              disabled={disabled || readonly}
              placeholder="Topic title"
              onChange={(e) =>
                emit({ title: e.target.value, content: single.content ?? [] })
              }
            />
            <TagList
              value={single.content ?? []}
              disabled={disabled}
              readonly={readonly}
              placeholder="Add a skill and press Enter"
              onChange={(content) => emit({ title: single.title ?? "", content })}
            />
          </Space>,
        )}
    </Space>
  );
}
