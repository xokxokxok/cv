/** Humanize a schema property name and capitalize the first letter. */
export function formatFieldLabel(label: string): string {
  if (!label) return label;

  const humanized = label
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return humanized.charAt(0).toUpperCase() + humanized.slice(1);
}
