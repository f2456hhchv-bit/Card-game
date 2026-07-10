/** Small formatting helpers shared by the UI and renderer. */

const SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];

/** Format a large number with short-scale suffixes (1.2K, 3.40M, ...). */
export function formatNumber(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs < 1000) return sign + Math.floor(abs).toString();
  const tier = Math.min(SUFFIXES.length - 1, Math.floor(Math.log10(abs) / 3));
  const scaled = abs / Math.pow(1000, tier);
  const digits = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
  return `${sign}${scaled.toFixed(digits)}${SUFFIXES[tier]}`;
}

/** Format seconds as H:MM:SS (or M:SS when under an hour). */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
  }
  return `${m}:${r.toString().padStart(2, "0")}`;
}

/** Format a 0..1 fraction as a whole-number percentage string. */
export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}
