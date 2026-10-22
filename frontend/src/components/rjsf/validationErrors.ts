import type { RJSFValidationError } from "@rjsf/utils";
import { formatFieldLabel } from "./formatFieldLabel";

/** ".experience.content.0.title" → ["experience", "content", "0", "title"] */
function pathSegments(error: RJSFValidationError): string[] {
  return (error.property ?? "").split(".").filter(Boolean);
}

/**
 * Top-level document section an error belongs to. Errors on the root object
 * (e.g. a whole section missing) carry the section name in `missingProperty`.
 */
export function errorSection(error: RJSFValidationError): string {
  const [first] = pathSegments(error);
  if (first) return first;
  const params = error.params as { missingProperty?: string } | undefined;
  return params?.missingProperty ?? "";
}

/** Human-readable location inside the section: "Content #2 › Title › Company". */
export function errorLocation(error: RJSFValidationError): string {
  return pathSegments(error)
    .slice(1)
    .map((segment) =>
      /^\d+$/.test(segment) ? `#${Number(segment) + 1}` : formatFieldLabel(segment),
    )
    .join(" › ");
}

export function groupErrorsBySection(
  errors: RJSFValidationError[],
): Record<string, RJSFValidationError[]> {
  const groups: Record<string, RJSFValidationError[]> = {};
  for (const error of errors) {
    const section = errorSection(error);
    (groups[section] ??= []).push(error);
  }
  return groups;
}
