import { Select, Space, Typography } from "antd";
import type { FieldProps } from "@rjsf/utils";
import { getUiOptions } from "@rjsf/utils";

interface TagListProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
}

/**
 * Free-form tag input for lists of short values (skills, tools, keywords).
 *
 * A dedicated row per item wastes a whole line on a two-word value, so these
 * lists are entered as tags: type, press Enter (or comma), done.
 */
export function TagList({
  value,
  onChange,
  disabled,
  readonly,
  placeholder,
}: TagListProps) {
  return (
    <Select
      mode="tags"
      value={value}
      open={false}
      suffixIcon={null}
      tokenSeparators={[","]}
      disabled={disabled || readonly}
      placeholder={placeholder ?? "Type a value and press Enter"}
      style={{ width: "100%" }}
      onChange={(next: string[]) =>
        onChange(next.map((item) => item.trim()).filter(Boolean))
      }
    />
  );
}

/**
 * rjsf field wrapper around {@link TagList}. Handles `array | null` schemas
 * (emits null instead of an empty array so the payload stays clean).
 */
export default function TagListField(props: FieldProps) {
  const { formData, onChange, disabled, readonly, fieldPathId, uiSchema, schema } =
    props;
  const options = getUiOptions(uiSchema);
  const title = options.title as string | undefined;
  const nullable = JSON.stringify(schema ?? {}).includes('"null"');
  const value = Array.isArray(formData)
    ? (formData as unknown[]).filter((item): item is string => typeof item === "string")
    : [];

  return (
    <Space direction="vertical" size={4} style={{ width: "100%" }}>
      {title && (
        <Typography.Text style={{ fontSize: 13, color: "#595959" }}>
          {title}
        </Typography.Text>
      )}
      <TagList
        value={value}
        disabled={disabled}
        readonly={readonly}
        placeholder={options.placeholder as string | undefined}
        onChange={(next) =>
          onChange(next.length === 0 && nullable ? null : next, fieldPathId.path)
        }
      />
    </Space>
  );
}
