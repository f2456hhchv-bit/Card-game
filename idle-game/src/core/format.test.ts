import { describe, it, expect } from "vitest";
import { formatNumber, formatDuration, formatPercent } from "./format";

describe("formatNumber", () => {
  it("shows small numbers plainly", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(999)).toBe("999");
  });

  it("applies short-scale suffixes above 1000", () => {
    expect(formatNumber(1000)).toBe("1.00K");
    expect(formatNumber(1_500_000)).toBe("1.50M");
    expect(formatNumber(999_000)).toBe("999K");
  });

  it("preserves sign", () => {
    expect(formatNumber(-2500)).toBe("-2.50K");
  });
});

describe("formatDuration", () => {
  it("formats under an hour as M:SS", () => {
    expect(formatDuration(65)).toBe("1:05");
  });

  it("formats an hour or more as H:MM:SS", () => {
    expect(formatDuration(3661)).toBe("1:01:01");
  });
});

describe("formatPercent", () => {
  it("rounds to a whole percentage", () => {
    expect(formatPercent(0.256)).toBe("26%");
  });
});
