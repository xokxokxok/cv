import type {
  ArrayFieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import { buttonId, getUiOptions } from "@rjsf/utils";
import { Space, Typography } from "antd";

/** Minimal array wrapper: items + add button only — no counters. */
export default function DocumentArrayFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ArrayFieldTemplateProps<T, S, F>) {
  const {
    canAdd,
    className,
    disabled,
    fieldPathId,
    items,
    optionalDataControl,
    onAddClick,
    readonly,
    registry,
    uiSchema,
  } = props;

  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  // Render a heading only when a title is explicitly provided and labels are
  // not disabled (silent arrays set label:false and stay heading-less).
  const title =
    typeof uiOptions.title === "string" ? uiOptions.title : undefined;
  const showTitle = !!title && uiOptions.label !== false;

  return (
    <fieldset className={className} id={fieldPathId.$id}>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        {showTitle && (
          <Typography.Text strong style={{ display: "block" }}>
            {title}
          </Typography.Text>
        )}
        {optionalDataControl}
        <div className="array-item-list">{items}</div>
        {canAdd && (
          <AddButton
            id={buttonId(fieldPathId, "add")}
            className="rjsf-array-item-add"
            disabled={disabled || readonly}
            onClick={onAddClick}
            uiSchema={uiSchema}
            registry={registry}
          />
        )}
      </Space>
    </fieldset>
  );
}
