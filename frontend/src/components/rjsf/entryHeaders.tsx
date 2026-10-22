import { Tag, Typography } from "antd";
import { MONTHS } from "./cvOptions";

type Period = { month?: number | null; year?: number | null } | null | undefined;

function formatPeriod(value: Period): string {
  if (!value || typeof value.year !== "number") return "";
  // value.month is 0-based, so it indexes MONTHS directly.
  const month =
    typeof value.month === "number" && MONTHS[value.month]
      ? `${MONTHS[value.month].label.slice(0, 3)} `
      : "";
  return `${month}${value.year}`;
}

/** "Mar 2021 – Present" style range used in collapsed entry headers. */
export function formatRange(start: Period, end: Period): string {
  const from = formatPeriod(start);
  if (!from) return "";
  return `${from} – ${formatPeriod(end) || "Present"}`;
}

interface EntryHeaderProps {
  title: string;
  subtitle?: string;
  meta?: string;
}

function EntryHeader({ title, subtitle, meta }: EntryHeaderProps) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        width: "100%",
        minWidth: 0,
      }}
    >
      <Typography.Text strong ellipsis style={{ flex: "0 1 auto" }}>
        {title}
      </Typography.Text>
      {subtitle && (
        <Typography.Text type="secondary" ellipsis style={{ flex: "1 1 auto", minWidth: 0 }}>
          {subtitle}
        </Typography.Text>
      )}
      {meta && (
        <Tag
          bordered={false}
          style={{ marginInlineEnd: 0, flex: "none", background: "#f0f0f0" }}
        >
          {meta}
        </Tag>
      )}
    </span>
  );
}

interface JobEntry {
  title?: {
    company?: string;
    job_title?: string;
    start?: Period;
    end?: Period;
  };
}

/** Collapsed header for a Professional Experience entry. */
export function experienceHeader(data: unknown, index: number) {
  const job = (data as JobEntry)?.title ?? {};
  return (
    <EntryHeader
      title={job.company?.trim() || `Role ${index + 1}`}
      subtitle={job.job_title?.trim()}
      meta={formatRange(job.start, job.end)}
    />
  );
}
