import { Button, Tooltip } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { IconButtonProps, SubmitButtonProps } from "@rjsf/utils";
import { getUiOptions } from "@rjsf/utils";

/**
 * Quiet toolbar buttons. The stock theme renders a solid red delete button and
 * a full-width blue add bar per array, which visually dominates a long form.
 */
function iconButton(
  icon: React.ReactNode,
  title: string,
  danger = false,
) {
  return function CvIconButton(props: IconButtonProps) {
    const { disabled, onClick, ...rest } = props;
    delete (rest as Record<string, unknown>).uiSchema;
    delete (rest as Record<string, unknown>).registry;
    delete (rest as Record<string, unknown>).iconType;
    return (
      <Tooltip title={title}>
        <Button
          type="text"
          size="small"
          danger={danger}
          icon={icon}
          disabled={disabled}
          onClick={onClick}
          aria-label={title}
        />
      </Tooltip>
    );
  };
}

export const MoveUpButton = iconButton(<ArrowUpOutlined />, "Move up");
export const MoveDownButton = iconButton(<ArrowDownOutlined />, "Move down");
export const RemoveButton = iconButton(<DeleteOutlined />, "Remove", true);
export const CopyButton = iconButton(<PlusOutlined />, "Duplicate");

/** Dashed "Add …" button sized to its label instead of the full row. */
export function AddButton(props: IconButtonProps) {
  const { disabled, onClick, uiSchema } = props;
  const label = (getUiOptions(uiSchema).addLabel as string) ?? "Add item";

  return (
    <Button
      type="dashed"
      size="small"
      icon={<PlusOutlined />}
      disabled={disabled}
      onClick={onClick}
      style={{ marginTop: 4 }}
    >
      {label}
    </Button>
  );
}

/** The editor has its own sticky save button; rjsf must not render one. */
export function SubmitButton(_props: SubmitButtonProps) {
  return null;
}

export const cvButtonTemplates = {
  AddButton,
  CopyButton,
  MoveDownButton,
  MoveUpButton,
  RemoveButton,
  SubmitButton,
};
