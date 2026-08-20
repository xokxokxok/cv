import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { FieldProps } from "@rjsf/utils";
import { getUiOptions } from "@rjsf/utils";
import {
  Button,
  Checkbox,
  Col,
  Input,
  InputNumber,
  Row,
  Space,
  Typography,
} from "antd";
import { stripedRowStyle } from "./stripes";

type Period = { month?: number; year?: number };

interface StringListEditorProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  readonly?: boolean;
  addLabel?: string;
}

/** Shared plain string list — no per-item labels. */
export function StringListEditor({
  value,
  onChange,
  disabled,
  readonly,
  addLabel = "Add item",
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
    <div style={{ width: "100%" }}>
      <div style={{ borderRadius: 6, overflow: "hidden" }}>
        {items.map((item, index) => (
          <div key={index} style={stripedRowStyle(index)}>
            <Row gutter={8} align="middle" wrap={false}>
              <Col flex="auto">
                <Input
                  value={item}
                  disabled={disabled || readonly}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder={`Item ${index + 1}`}
                />
              </Col>
              {!readonly && (
                <Col flex="none">
                  <Button
                    danger
                    type="text"
                    icon={<MinusCircleOutlined />}
                    disabled={disabled || items.length === 1}
                    onClick={() => removeItem(index)}
                  />
                </Col>
              )}
            </Row>
          </div>
        ))}
      </div>
      {!readonly && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          disabled={disabled}
          onClick={addItem}
          block
          style={{ marginTop: 8 }}
        >
          {addLabel}
        </Button>
      )}
    </div>
  );
}

/** End date (month/year) or null when still employed. Replaces anyOf object|null. */
export default function EndDateField(props: FieldProps) {
  const { formData, onChange, disabled, readonly, fieldPathId } = props;
  const isPresent = formData == null;
  const period = (formData ?? {}) as Period;

  function emit(value: Period | null) {
    onChange(value, fieldPathId.path);
  }

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      {!readonly && (
        <Checkbox
          checked={isPresent}
          disabled={disabled}
          onChange={(e) =>
            emit(e.target.checked ? null : { month: undefined, year: undefined })
          }
        >
          Present (no end date)
        </Checkbox>
      )}
      {!isPresent && (
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <InputNumber
              style={{ width: "100%" }}
              placeholder="End month"
              min={1}
              max={12}
              value={period.month}
              disabled={disabled || readonly}
              onChange={(month) => emit({ ...period, month: month ?? undefined })}
            />
          </Col>
          <Col xs={24} sm={12}>
            <InputNumber
              style={{ width: "100%" }}
              placeholder="End year"
              min={1900}
              max={2100}
              value={period.year}
              disabled={disabled || readonly}
              onChange={(year) => emit({ ...period, year: year ?? undefined })}
            />
          </Col>
        </Row>
      )}
    </Space>
  );
}

/** String array editor; accepts null from schema and treats it as empty list. */
export function NullableStringArrayField(props: FieldProps) {
  const { formData, onChange, disabled, readonly, fieldPathId, uiSchema } =
    props;
  const value = Array.isArray(formData) ? (formData as string[]) : [];
  const title = getUiOptions(uiSchema).title as string | undefined;

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      {title && (
        <Typography.Text strong style={{ display: "block" }}>
          {title}
        </Typography.Text>
      )}
      <StringListEditor
        value={value.length > 0 ? value : [""]}
        disabled={disabled}
        readonly={readonly}
        onChange={(next) => {
          const cleaned = next.filter((item) => item.trim() !== "");
          onChange(cleaned.length > 0 ? cleaned : null, fieldPathId.path);
        }}
      />
    </Space>
  );
}
