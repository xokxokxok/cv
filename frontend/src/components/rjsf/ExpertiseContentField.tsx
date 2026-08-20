import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { FieldProps } from "@rjsf/utils";
import { Button, Col, Input, Row, Segmented, Space } from "antd";
import { useEffect, useState, type ReactNode } from "react";
import { StringListEditor } from "./ExperienceFields";

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

  if (
    typeof value === "object" &&
    "title" in value &&
    "content" in value
  ) {
    return "grouped-object";
  }

  return "string-array";
}

const KIND_OPTIONS = [
  { value: "string-array", label: "List" },
  { value: "grouped-list", label: "Topics" },
  { value: "grouped-object", label: "Single topic" },
] as const;

function emptyValueForKind(kind: ContentKind): unknown {
  switch (kind) {
    case "grouped-list":
      return [{ title: "", content: [""] }];
    case "grouped-object":
      return { title: "", content: [""] };
    default:
      return [""];
  }
}

function bordered(children: ReactNode) {
  return (
    <div
      style={{
        border: "1px solid #c5c5c5",
        borderRadius: 8,
        padding: "12px 16px",
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
  const groups = value.length > 0 ? value : [{ title: "", content: [""] }];

  function updateGroup(index: number, patch: Partial<GroupedTopic>) {
    onChange(groups.map((group, i) => (i === index ? { ...group, ...patch } : group)));
  }

  function addGroup() {
    onChange([...groups, { title: "", content: [""] }]);
  }

  function removeGroup(index: number) {
    const copy = groups.filter((_, i) => i !== index);
    onChange(copy.length > 0 ? copy : [{ title: "", content: [""] }]);
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {groups.map((group, index) => (
        <div key={index}>
          {bordered(
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
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
                      icon={<MinusCircleOutlined />}
                      disabled={disabled || groups.length === 1}
                      onClick={() => removeGroup(index)}
                    />
                  </Col>
                )}
              </Row>
              <StringListEditor
                value={group.content}
                disabled={disabled}
                readonly={readonly}
                onChange={(content) => updateGroup(index, { content })}
              />
            </Space>,
          )}
        </div>
      ))}
      {!readonly && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          disabled={disabled}
          onClick={addGroup}
          block
        >
          Add topic
        </Button>
      )}
    </Space>
  );
}

/**
 * Custom editor for expertise group `content` (anyOf: string[] | grouped object | grouped list in data).
 * Must set ui:fieldReplacesAnyOrOneOf so rjsf does not also render the anyOf branch UI.
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

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {!readonly && (
        <Segmented
          value={kind}
          options={[...KIND_OPTIONS]}
          disabled={disabled}
          onChange={(value) => switchKind(value as ContentKind)}
        />
      )}

      {kind === "string-array" && (
        <StringListEditor
          value={Array.isArray(formData) ? (formData as string[]) : [""]}
          disabled={disabled}
          readonly={readonly}
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

      {kind === "grouped-object" && (
        bordered(
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Input
              value={(formData as GroupedTopic)?.title ?? ""}
              disabled={disabled || readonly}
              placeholder="Topic title"
              onChange={(e) =>
                emit({
                  title: e.target.value,
                  content: (formData as GroupedTopic)?.content ?? [""],
                })
              }
            />
            <StringListEditor
              value={(formData as GroupedTopic)?.content ?? [""]}
              disabled={disabled}
              readonly={readonly}
              onChange={(content) =>
                emit({
                  title: (formData as GroupedTopic)?.title ?? "",
                  content,
                })
              }
            />
          </Space>,
        )
      )}
    </Space>
  );
}
