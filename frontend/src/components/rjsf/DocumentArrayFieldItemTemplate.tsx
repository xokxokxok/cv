import type {
  ArrayFieldItemTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import { getTemplate, getUiOptions } from "@rjsf/utils";
import { stripedRowStyle } from "./stripes";

/**
 * Separates array entries visually without redundant "Entry 1" headings.
 * - bordered: subtle box per object item
 * - plain: bare input rows (string lists)
 */
export default function DocumentArrayFieldItemTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ArrayFieldItemTemplateProps<T, S, F>) {
  const {
    children,
    buttonsProps,
    hasToolbar,
    index,
    registry,
    uiSchema,
    parentUiSchema,
  } = props;

  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const parentOptions = getUiOptions<T, S, F>(parentUiSchema);
  const itemVariant =
    uiOptions.itemVariant ?? parentOptions.itemVariant ?? "bordered";

  const ArrayFieldItemButtonsTemplate = getTemplate<
    "ArrayFieldItemButtonsTemplate",
    T,
    S,
    F
  >("ArrayFieldItemButtonsTemplate", registry, uiOptions);

  const toolbar = hasToolbar ? (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
      <ArrayFieldItemButtonsTemplate {...buttonsProps} />
    </div>
  ) : null;

  if (itemVariant === "plain") {
    return (
      <div
        style={{
          ...stripedRowStyle(index),
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>{children}</div>
        {toolbar}
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #c5c5c5",
        borderRadius: 8,
        padding: "12px 16px",
        marginBottom: 12,
        background: "#fafafa",
      }}
    >
      {toolbar}
      {children}
    </div>
  );
}
