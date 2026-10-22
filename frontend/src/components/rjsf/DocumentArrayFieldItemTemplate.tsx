import type {
  ArrayFieldItemTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import { getTemplate, getUiOptions } from "@rjsf/utils";

/**
 * Chrome for a single array entry.
 *
 * - `plain`    — bare row (long text items).
 * - `compact`  — narrow inline cell (short values).
 * - `collapse` — no card of its own; the accordion panel already frames it.
 * - default    — soft card with a hover toolbar.
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
    <span className="cv-item-toolbar" style={{ flex: "none" }}>
      <ArrayFieldItemButtonsTemplate {...buttonsProps} />
    </span>
  ) : null;

  if (itemVariant === "compact") {
    return (
      <div style={{ display: "flex", alignItems: "center", flex: "0 1 210px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        {toolbar}
      </div>
    );
  }

  if (itemVariant === "collapse") {
    return (
      <div className="cv-collapse-item">
        {children}
        {toolbar && <div className="cv-entry-actions">{toolbar}</div>}
      </div>
    );
  }

  if (itemVariant === "plain") {
    return (
      <div
        className="cv-plain-item"
        style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0" }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        {toolbar}
      </div>
    );
  }

  return (
    <div className="cv-entry-card">
      {toolbar && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>{toolbar}</div>
      )}
      {children}
    </div>
  );
}
