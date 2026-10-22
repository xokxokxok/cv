import type { ReactNode } from "react";
import { AutoComplete, InputNumber, Select } from "antd";
import type { WidgetProps } from "@rjsf/utils";
import {
  COLOR_HEX,
  CONTRACT_TYPES,
  ICON_COLORS,
  ICON_NAMES,
  LOCATION_TYPES,
  MONTHS,
  SECTION_COLORS,
  withCurrent,
  type ColorOption,
} from "./cvOptions";

/** Small round chip previewing an accent color. */
export function Swatch({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: COLOR_HEX[color] ?? color,
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)",
        flex: "none",
      }}
    />
  );
}

/** Material Symbols glyph — the same font the published CV uses. */
export function GlyphPreview({ name }: { name: string }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontSize: 18, lineHeight: "18px", color: "#595959", flex: "none" }}
    >
      {name}
    </span>
  );
}

/**
 * Material Symbols glyph at any size, inheriting the surrounding color.
 * Accepts `className` so containers like antd's Menu can add their icon class.
 */
export function MaterialIcon({
  name,
  size = 16,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={["material-symbols-outlined", className].filter(Boolean).join(" ")}
      aria-hidden
      style={{ fontSize: size, lineHeight: 1, width: size, overflow: "hidden" }}
    >
      {name}
    </span>
  );
}

function row(children: ReactNode) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {children}
    </span>
  );
}

function colorOptions(palette: ColorOption[], value: unknown) {
  return withCurrent(palette.map((c) => c.value), value).map((name) => ({
    value: name,
    label: row(
      <>
        <Swatch color={name} />
        {name}
      </>,
    ),
  }));
}

function useColorWidget(palette: ColorOption[]) {
  return function ColorSelect(props: WidgetProps) {
    const { value, onChange, disabled, readonly, placeholder } = props;
    return (
      <Select
        value={value || undefined}
        options={colorOptions(palette, value)}
        disabled={disabled || readonly}
        placeholder={placeholder ?? "Color"}
        style={{ width: "100%" }}
        onChange={(next) => onChange(next)}
        allowClear
      />
    );
  };
}

/** Accent color for an icon badge. */
export const ColorWidget = useColorWidget(ICON_COLORS);

/** Card theme for a whole section. */
export const ThemeColorWidget = useColorWidget(SECTION_COLORS);

/** Material Symbols icon name — suggestions plus free text. */
export function IconNameWidget(props: WidgetProps) {
  const { value, onChange, disabled, readonly, placeholder } = props;
  const options = withCurrent(ICON_NAMES, value).map((name) => ({
    value: name,
    label: row(
      <>
        <GlyphPreview name={name} />
        {name}
      </>,
    ),
  }));

  return (
    <AutoComplete
      value={value ?? ""}
      options={options}
      disabled={disabled || readonly}
      placeholder={placeholder ?? "Icon"}
      style={{ width: "100%" }}
      filterOption={(input, option) =>
        String(option?.value ?? "").includes(input.toLowerCase())
      }
      onChange={(next) => onChange(next || undefined)}
    />
  );
}

/**
 * Section icon — a select over the known Material Symbols (with preview).
 * The chosen icon is shown in the editor's section menu, the section header
 * and the published CV.
 */
export function SectionIconWidget(props: WidgetProps) {
  const { value, onChange, disabled, readonly, placeholder } = props;
  const options = withCurrent(ICON_NAMES, value).map((name) => ({
    value: name,
    label: row(
      <>
        <GlyphPreview name={name} />
        {name}
      </>,
    ),
  }));

  return (
    <Select
      value={value || undefined}
      options={options}
      showSearch
      filterOption={(input, option) =>
        String(option?.value ?? "").includes(input.toLowerCase())
      }
      disabled={disabled || readonly}
      placeholder={placeholder ?? "Icon"}
      style={{ width: "100%" }}
      onChange={(next) => onChange(next || undefined)}
      allowClear
    />
  );
}

/** Month picker — names instead of a bare number the user has to guess. */
export function MonthWidget(props: WidgetProps) {
  const { value, onChange, disabled, readonly, placeholder } = props;
  return (
    <Select
      value={typeof value === "number" ? value : undefined}
      options={MONTHS}
      disabled={disabled || readonly}
      placeholder={placeholder ?? "Month"}
      style={{ width: "100%" }}
      onChange={(next) => onChange(next ?? undefined)}
      allowClear
    />
  );
}

/** Four-digit year — sized for four digits, not for a paragraph. */
export function YearWidget(props: WidgetProps) {
  const { value, onChange, disabled, readonly, placeholder } = props;
  return (
    <InputNumber
      value={typeof value === "number" ? value : undefined}
      min={1900}
      max={2100}
      controls={false}
      disabled={disabled || readonly}
      placeholder={placeholder ?? "Year"}
      style={{ width: "100%" }}
      onChange={(next) => onChange(next ?? undefined)}
    />
  );
}

function suggestionWidget(list: string[], fallbackPlaceholder: string) {
  return function SuggestionSelect(props: WidgetProps) {
    const { value, onChange, disabled, readonly, placeholder } = props;
    return (
      <AutoComplete
        value={value ?? ""}
        options={withCurrent(list, value).map((item) => ({ value: item }))}
        disabled={disabled || readonly}
        placeholder={placeholder ?? fallbackPlaceholder}
        style={{ width: "100%" }}
        filterOption={(input, option) =>
          String(option?.value ?? "").toLowerCase().includes(input.toLowerCase())
        }
        onChange={(next) => onChange(next || undefined)}
      />
    );
  };
}

export const LocationTypeWidget = suggestionWidget(LOCATION_TYPES, "Remote");
export const ContractTypeWidget = suggestionWidget(CONTRACT_TYPES, "Full-time");
