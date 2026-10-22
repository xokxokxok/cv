import type { ReactNode } from "react";
import type {
  ArrayFieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import { buttonId, getUiOptions } from "@rjsf/utils";
import { Collapse, Space, Typography } from "antd";

type ItemHeader = (data: unknown, index: number) => ReactNode;

/**
 * Array wrapper with three presentations, chosen via `ui:options.itemVariant`:
 *
 * - `compact`  — short values flow side by side instead of one row each.
 * - `collapse` — long entries become an accordion so the section reads as a
 *                short list of headings rather than an endless form.
 * - default    — items stacked as-is.
 */
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
    formData,
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

  const variant = uiOptions.itemVariant as string | undefined;
  const itemHeader = uiOptions.itemHeader as ItemHeader | undefined;
  const entries = Array.isArray(formData) ? (formData as unknown[]) : [];

  // A heading is rendered only when explicitly provided; silent arrays set
  // label:false and stay heading-less.
  const title = typeof uiOptions.title === "string" ? uiOptions.title : undefined;
  const showTitle = !!title && uiOptions.label !== false;

  const addButton = canAdd ? (
    <AddButton
      id={buttonId(fieldPathId, "add")}
      className="rjsf-array-item-add"
      disabled={disabled || readonly}
      onClick={onAddClick}
      uiSchema={uiSchema}
      registry={registry}
    />
  ) : null;

  let body: ReactNode;

  if (variant === "collapse" && items.length > 0) {
    body = (
      <Collapse
        accordion
        size="small"
        className="cv-entry-collapse"
        items={items.map((item, index) => ({
          key: String(index),
          label: itemHeader?.(entries[index], index) ?? `Entry ${index + 1}`,
          children: item,
        }))}
      />
    );
  } else if (variant === "compact") {
    body = (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{items}</div>
    );
  } else {
    body = <div className="array-item-list">{items}</div>;
  }

  return (
    <fieldset className={className} id={fieldPathId.$id}>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        {showTitle && (
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {title}
          </Typography.Text>
        )}
        {optionalDataControl}
        {body}
        {addButton}
      </Space>
    </fieldset>
  );
}
