import type { CSSProperties } from "react";

/** Background used for odd (zebra) rows in editable string lists. */
export const STRIPE_BG = "#e5e5e5";

/**
 * Zebra-striping style for a single list row. Alternating rows get a subtle
 * grey background so long lists are easier to scan.
 */
export function stripedRowStyle(index: number): CSSProperties {
  return {
    background: index % 2 === 0 ? STRIPE_BG : "transparent",
    padding: "10px 12px",
  };
}
