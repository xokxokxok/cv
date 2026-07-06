import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { FieldProps } from "@rjsf/utils";
import { Button, Input, Select, Space, Typography } from "antd";

type GroupedTopic = {
  title: string;
  content: string[];
};

type ContentKind = "string-array" | "grouped-list" | "grouped-object";

function detectContentKind(value: unknown): ContentKind {
  if (value == null) return "string-array";

  if (Array.isArray(value)) {
    if (value.length === 0) return "string-array";
    if (typeof value[0] === "string") return "string-array";
    if (
      typeof value[0] === "object" &&
      value[0] !== null &&
      "title" in value[0]
    ) {
      return "grouped-list";
    }
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    "content" in value
  ) {
    return "grouped-object";
  }

  return "string-array";
}

const KIND_OPTIONS = [
  { value: "string-array", label: "Plain list (strings)" },
  { value: "grouped-list", label: "Grouped topics (title + list)" },
  { value: "grouped-object", label: "Single group (title + list)" },
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

interface StringListEditorProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  readonly?: boolean;
}

function StringListEditor({
  value,
  onChange,
  disabled,
  readonly,
}: StringListEditorProps) {
  const items = value.length > 0 ? value : [""];

  function updateItem(index: number, next: string) {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  }

  function addItem() {
    onChange([...items, ""]);
  }

  function removeItem(index: number) {
    const copy = items.filter((_, i) => i !== index);
    onChange(copy.length > 0 ? copy : [""]);
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {items.map((item, index) => (
        <Space key={index} align="start" style={{ width: "100%" }}>
          <Input
            value={item}
            disabled={disabled || readonly}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`Item ${index + 1}`}
          />
          {!readonly && (
            <Button
              danger
              type="text"
              icon={<MinusCircleOutlined />}
              disabled={disabled || items.length === 1}
              onClick={() => removeItem(index)}
            />
          )}
        </Space>
      ))}
      {!readonly && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          disabled={disabled}
          onClick={addItem}
          block
        >
          Add item
        </Button>
      )}
    </Space>
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
    const copy = groups.map((group, i) =>
      i === index ? { ...group, ...patch } : group,
    );
    onChange(copy);
  }

  function addGroup() {
    onChange([...groups, { title: "", content: [""] }]);
  }

  function removeGroup(index: number) {
    const copy = groups.filter((_, i) => i !== index);
    onChange(copy.length > 0 ? copy : [{ title: "", content: [""] }]);
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {groups.map((group, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            padding: 16,
            background: "#fafafa",
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space align="start" style={{ width: "100%" }}>
              <Input
                value={group.title}
                disabled={disabled || readonly}
                onChange={(e) => updateGroup(index, { title: e.target.value })}
                placeholder="Group title"
                style={{ flex: 1 }}
              />
              {!readonly && (
                <Button
                  danger
                  type="text"
                  icon={<MinusCircleOutlined />}
                  disabled={disabled || groups.length === 1}
                  onClick={() => removeGroup(index)}
                />
              )}
            </Space>
            <StringListEditor
              value={group.content}
              disabled={disabled}
              readonly={readonly}
              onChange={(content) => updateGroup(index, { content })}
            />
          </Space>
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
          Add group
        </Button>
      )}
    </Space>
  );
}

/**
 * Handles expertise `content` values that may be a string array, a list of
 * grouped topics, or a single grouped object (schema anyOf + nested data).
 */
export default function ExpertiseContentField(props: FieldProps) {
  const { formData, onChange, disabled, readonly, fieldPathId } = props;
  const kind = detectContentKind(formData);

  function switchKind(nextKind: ContentKind) {
    if (nextKind === kind) return;
    onChange(emptyValueForKind(nextKind), fieldPathId.path);
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {!readonly && (
        <Select
          value={kind}
          options={[...KIND_OPTIONS]}
          disabled={disabled}
          onChange={switchKind}
          style={{ maxWidth: 360 }}
        />
      )}

      {kind === "string-array" && (
        <StringListEditor
          value={Array.isArray(formData) ? (formData as string[]) : [""]}
          disabled={disabled}
          readonly={readonly}
          onChange={(value) => onChange(value, fieldPathId.path)}
        />
      )}

      {kind === "grouped-list" && (
        <GroupedListEditor
          value={
            Array.isArray(formData) ? (formData as GroupedTopic[]) : []
          }
          disabled={disabled}
          readonly={readonly}
          onChange={(value) => onChange(value, fieldPathId.path)}
        />
      )}

      {kind === "grouped-object" && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            value={(formData as GroupedTopic)?.title ?? ""}
            disabled={disabled || readonly}
            placeholder="Group title"
            onChange={(e) =>
              onChange(
                {
                  ...(formData as GroupedTopic),
                  title: e.target.value,
                  content: (formData as GroupedTopic)?.content ?? [""],
                },
                fieldPathId.path,
              )
            }
          />
          <Typography.Text type="secondary">Items</Typography.Text>
          <StringListEditor
            value={(formData as GroupedTopic)?.content ?? [""]}
            disabled={disabled}
            readonly={readonly}
            onChange={(content) =>
              onChange(
                {
                  ...(formData as GroupedTopic),
                  title: (formData as GroupedTopic)?.title ?? "",
                  content,
                },
                fieldPathId.path,
              )
            }
          />
        </Space>
      )}
    </Space>
  );
}
