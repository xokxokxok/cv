import type {
  FieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import { getTemplate, getUiOptions } from "@rjsf/utils";
import { Form } from "antd";
import { formatFieldLabel } from "./formatFieldLabel";

const VERTICAL_LABEL_COL = { span: 24 };
const VERTICAL_WRAPPER_COL = { span: 24 };

export default function DocumentFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: FieldTemplateProps<T, S, F>) {
  const {
    children,
    description,
    displayLabel,
    errors,
    help,
    rawHelp,
    hidden,
    id,
    label,
    rawErrors,
    rawDescription,
    registry,
    required,
    schema,
    uiSchema,
  } = props;

  const { formContext } = registry;
  const {
    colon,
    labelCol = VERTICAL_LABEL_COL,
    wrapperCol = VERTICAL_WRAPPER_COL,
    wrapperStyle,
    descriptionLocation = "below",
  } = formContext ?? {};

  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate<
    "WrapIfAdditionalTemplate",
    T,
    S,
    F
  >("WrapIfAdditionalTemplate", registry, uiOptions);

  if (hidden) {
    return <div className="rjsf-field-hidden">{children}</div>;
  }

  const hideLabel = uiOptions.label === false;
  const isCheckbox = uiOptions.widget === "checkbox";
  const showLabel = displayLabel && !isCheckbox && !hideLabel;

  if (!showLabel) {
    return (
      <WrapIfAdditionalTemplate {...props}>
        <div style={wrapperStyle}>{children}</div>
      </WrapIfAdditionalTemplate>
    );
  }

  const descriptionNode = rawDescription ? description : undefined;
  const descriptionProps: Record<string, unknown> = {};
  if (descriptionLocation === "tooltip") {
    descriptionProps.tooltip = descriptionNode;
  } else {
    descriptionProps.extra = descriptionNode;
  }

  const formattedLabel =
    typeof uiOptions.title === "string"
      ? uiOptions.title
      : formatFieldLabel(label);

  return (
    <WrapIfAdditionalTemplate {...props}>
      <Form.Item
        colon={colon}
        hasFeedback={schema.type !== "array" && schema.type !== "object"}
        help={
          (!!rawHelp && help) ||
          (rawErrors?.length ? errors : undefined)
        }
        htmlFor={id}
        label={formattedLabel}
        labelCol={labelCol}
        required={required}
        style={wrapperStyle}
        validateStatus={rawErrors?.length ? "error" : undefined}
        wrapperCol={wrapperCol}
        {...descriptionProps}
      >
        {children}
      </Form.Item>
    </WrapIfAdditionalTemplate>
  );
}
