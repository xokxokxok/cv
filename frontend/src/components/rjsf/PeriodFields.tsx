import type { ReactNode } from "react";
import { InputNumber, Select, Switch, Typography } from "antd";
import type { FieldProps } from "@rjsf/utils";
import { getUiOptions } from "@rjsf/utils";
import { MONTHS } from "./cvOptions";

type Period = { month?: number | null; year?: number | null };

const YEAR_WIDTH = 92;

interface MonthYearProps {
  value: Period;
  onChange: (value: Period) => void;
  disabled?: boolean;
  readonly?: boolean;
}

/** Month picker + four-digit year on a single line. */
function MonthYear({ value, onChange, disabled, readonly }: MonthYearProps) {
  return (
    <span
      style={{ display: "inline-flex", gap: 8, width: "100%", maxWidth: 250 }}
    >
      <Select
        value={typeof value.month === "number" ? value.month : undefined}
        options={MONTHS}
        placeholder="Month"
        allowClear
        disabled={disabled || readonly}
        style={{ flex: "1 1 auto", minWidth: 100 }}
        onChange={(month) => onChange({ ...value, month: month ?? undefined })}
      />
      <InputNumber
        value={typeof value.year === "number" ? value.year : undefined}
        min={1900}
        max={2100}
        controls={false}
        placeholder="Year"
        disabled={disabled || readonly}
        style={{ flex: `0 0 ${YEAR_WIDTH}px`, width: YEAR_WIDTH }}
        onChange={(year) => onChange({ ...value, year: year ?? undefined })}
      />
    </span>
  );
}

/**
 * Object fields do not get a label from rjsf, so these controls render their
 * own — otherwise a bare pair of inputs would float without a caption.
 */
function Labelled({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div style={{ width: "100%" }}>
      {title && (
        <div style={{ marginBottom: 2, lineHeight: "22px" }}>
          <Typography.Text style={{ fontSize: 13, color: "#595959" }}>
            {title}
          </Typography.Text>
        </div>
      )}
      {children}
    </div>
  );
}

/** Start date — replaces the two stacked full-width inputs with one row. */
export function StartPeriodField(props: FieldProps) {
  const { formData, onChange, disabled, readonly, fieldPathId, uiSchema } = props;

  return (
    <Labelled title={getUiOptions(uiSchema).title as string | undefined}>
      <MonthYear
        value={(formData ?? {}) as Period}
        disabled={disabled}
        readonly={readonly}
        onChange={(next) => onChange(next, fieldPathId.path)}
      />
    </Labelled>
  );
}

/**
 * End date — a "Present" switch that collapses the inputs entirely when the
 * role is ongoing, instead of leaving two empty boxes on screen.
 */
export default function EndDateField(props: FieldProps) {
  const { formData, onChange, disabled, readonly, fieldPathId, uiSchema } = props;
  const isPresent = formData == null;
  const period = (formData ?? {}) as Period;
  const presentLabel =
    (getUiOptions(uiSchema).presentLabel as string) ?? "Present";

  return (
    <Labelled title={getUiOptions(uiSchema).title as string | undefined}>
      <span
        style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}
      >
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 8, flex: "none" }}
        >
          <Switch
            size="small"
            checked={isPresent}
            disabled={disabled || readonly}
            onChange={(checked) => onChange(checked ? null : {}, fieldPathId.path)}
          />
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {presentLabel}
          </Typography.Text>
        </span>
        {!isPresent && (
          <MonthYear
            value={period}
            disabled={disabled}
            readonly={readonly}
            onChange={(next) => onChange(next, fieldPathId.path)}
          />
        )}
      </span>
    </Labelled>
  );
}
