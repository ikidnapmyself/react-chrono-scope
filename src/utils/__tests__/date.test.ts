import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  pad, formatDateTime, formatDateShort, formatRangeLabel,
  applyRelativeTime, getDaysInMonth, getFirstDayOfMonth,
  isSameDay, isDateInRange, clampDate,
  getRangeDuration, shiftRange, scaleRange,
  buildRelativeLabel, generateTicks, cx,
} from "../date";

// ── pad ──────────────────────────────────────────────────────────

describe("pad", () => {
  it("pads single digit", () => expect(pad(5)).toBe("05"));
  it("leaves double digit", () => expect(pad(12)).toBe("12"));
  it("pads zero", () => expect(pad(0)).toBe("00"));
});

// ── formatDateTime ───────────────────────────────────────────────

describe("formatDateTime", () => {
  it("formats a known date", () => {
    const d = new Date(2024, 0, 5, 9, 3, 7); // Jan 5, 2024 09:03:07
    expect(formatDateTime(d)).toBe("2024-01-05 09:03:07");
  });

  it("handles midnight", () => {
    const d = new Date(2024, 11, 31, 0, 0, 0);
    expect(formatDateTime(d)).toBe("2024-12-31 00:00:00");
  });
});

// ── formatDateShort ──────────────────────────────────────────────

describe("formatDateShort", () => {
  it("formats short date", () => {
    const d = new Date(2024, 2, 15, 14, 30); // Mar 15, 2024 14:30
    expect(formatDateShort(d)).toBe("Mar 15, 14:30");
  });
});

// ── formatRangeLabel ─────────────────────────────────────────────

describe("formatRangeLabel", () => {
  it("returns quickLabel if provided", () => {
    const from = new Date();
    const to = new Date();
    expect(formatRangeLabel(from, to, "Last 5 minutes")).toBe("Last 5 minutes");
  });

  it("formats range when no quickLabel", () => {
    const from = new Date(2024, 0, 1, 10, 0);
    const to = new Date(2024, 0, 1, 16, 0);
    expect(formatRangeLabel(from, to, null)).toBe("Jan 1, 10:00 → Jan 1, 16:00");
  });

  it("uses custom formatShort", () => {
    const from = new Date(2024, 0, 1);
    const to = new Date(2024, 0, 2);
    const fmt = (d: Date) => `${d.getDate()}`;
    expect(formatRangeLabel(from, to, null, fmt)).toBe("1 → 2");
  });
});

// ── applyRelativeTime ────────────────────────────────────────────

describe("applyRelativeTime", () => {
  let now: Date;

  beforeEach(() => {
    now = new Date(2024, 5, 15, 12, 0, 0, 0); // Jun 15, 2024 12:00:00
    vi.useFakeTimers({ now });
  });
  afterEach(() => vi.useRealTimers());

  it("subtracts seconds", () => {
    const d = applyRelativeTime(30, "s");
    expect(d.getSeconds()).toBe(30);
    expect(d.getMinutes()).toBe(59);
  });

  it("subtracts minutes", () => {
    const d = applyRelativeTime(15, "m");
    expect(d.getMinutes()).toBe(45);
    expect(d.getHours()).toBe(11);
  });

  it("subtracts hours", () => {
    const d = applyRelativeTime(6, "h");
    expect(d.getHours()).toBe(6);
  });

  it("subtracts days", () => {
    const d = applyRelativeTime(5, "d");
    expect(d.getDate()).toBe(10);
  });

  it("subtracts weeks", () => {
    const d = applyRelativeTime(2, "w");
    expect(d.getDate()).toBe(1);
  });

  it("subtracts months", () => {
    const d = applyRelativeTime(3, "M");
    expect(d.getMonth()).toBe(2); // March
  });

  it("subtracts years", () => {
    const d = applyRelativeTime(2, "y");
    expect(d.getFullYear()).toBe(2022);
  });
});

// ── getDaysInMonth ───────────────────────────────────────────────

describe("getDaysInMonth", () => {
  it("returns 31 for January", () => expect(getDaysInMonth(2024, 0)).toBe(31));
  it("returns 29 for Feb in leap year", () => expect(getDaysInMonth(2024, 1)).toBe(29));
  it("returns 28 for Feb in non-leap year", () => expect(getDaysInMonth(2023, 1)).toBe(28));
  it("returns 30 for April", () => expect(getDaysInMonth(2024, 3)).toBe(30));
});

// ── getFirstDayOfMonth ───────────────────────────────────────────

describe("getFirstDayOfMonth", () => {
  it("returns correct day for Jan 2024 (Monday = 1)", () => {
    expect(getFirstDayOfMonth(2024, 0)).toBe(1);
  });

  it("returns correct day for Sep 2024 (Sunday = 0)", () => {
    expect(getFirstDayOfMonth(2024, 8)).toBe(0);
  });
});

// ── isSameDay ────────────────────────────────────────────────────

describe("isSameDay", () => {
  it("returns true for same day different times", () => {
    const a = new Date(2024, 0, 15, 10, 0);
    const b = new Date(2024, 0, 15, 23, 59);
    expect(isSameDay(a, b)).toBe(true);
  });

  it("returns false for different days", () => {
    const a = new Date(2024, 0, 15);
    const b = new Date(2024, 0, 16);
    expect(isSameDay(a, b)).toBe(false);
  });
});

// ── isDateInRange ────────────────────────────────────────────────

describe("isDateInRange", () => {
  const start = new Date(2024, 0, 10);
  const end = new Date(2024, 0, 20);

  it("returns true for date within range", () => {
    expect(isDateInRange(new Date(2024, 0, 15), start, end)).toBe(true);
  });

  it("returns true for start boundary", () => {
    expect(isDateInRange(new Date(2024, 0, 10, 14, 0), start, end)).toBe(true);
  });

  it("returns true for end boundary", () => {
    expect(isDateInRange(new Date(2024, 0, 20, 14, 0), start, end)).toBe(true);
  });

  it("returns false for date before range", () => {
    expect(isDateInRange(new Date(2024, 0, 9), start, end)).toBe(false);
  });

  it("returns false for date after range", () => {
    expect(isDateInRange(new Date(2024, 0, 21), start, end)).toBe(false);
  });
});

// ── clampDate ────────────────────────────────────────────────────

describe("clampDate", () => {
  it("returns date as-is when within bounds", () => {
    const d = new Date(2024, 5, 15);
    const result = clampDate(d, new Date(2024, 0, 1), new Date(2024, 11, 31));
    expect(result.getTime()).toBe(d.getTime());
  });

  it("clamps to min", () => {
    const min = new Date(2024, 0, 1);
    const result = clampDate(new Date(2023, 11, 31), min);
    expect(result.getTime()).toBe(min.getTime());
  });

  it("clamps to max", () => {
    const max = new Date(2024, 11, 31);
    const result = clampDate(new Date(2025, 0, 1), undefined, max);
    expect(result.getTime()).toBe(max.getTime());
  });

  it("returns same date when no bounds", () => {
    const d = new Date(2024, 5, 15);
    expect(clampDate(d).getTime()).toBe(d.getTime());
  });
});

// ── getRangeDuration ─────────────────────────────────────────────

describe("getRangeDuration", () => {
  it("returns millisecond diff", () => {
    const from = new Date(2024, 0, 1, 0, 0);
    const to = new Date(2024, 0, 1, 1, 0); // 1 hour later
    expect(getRangeDuration({ from, to })).toBe(3600_000);
  });
});

// ── shiftRange ───────────────────────────────────────────────────

describe("shiftRange", () => {
  it("shifts both dates by given ms", () => {
    const from = new Date(2024, 0, 1, 10, 0);
    const to = new Date(2024, 0, 1, 12, 0);
    const shifted = shiftRange({ from, to }, 3600_000); // +1h
    expect(shifted.from.getHours()).toBe(11);
    expect(shifted.to.getHours()).toBe(13);
  });

  it("preserves range duration", () => {
    const range = { from: new Date(2024, 0, 1), to: new Date(2024, 0, 2) };
    const shifted = shiftRange(range, 86400_000);
    expect(getRangeDuration(shifted)).toBe(getRangeDuration(range));
  });
});

// ── scaleRange ───────────────────────────────────────────────────

describe("scaleRange", () => {
  it("doubles range with factor 2", () => {
    const from = new Date(2024, 0, 1, 10, 0);
    const to = new Date(2024, 0, 1, 12, 0);
    const scaled = scaleRange({ from, to }, 2);
    expect(getRangeDuration(scaled)).toBe(4 * 3600_000);
  });

  it("halves range with factor 0.5", () => {
    const from = new Date(2024, 0, 1, 10, 0);
    const to = new Date(2024, 0, 1, 14, 0);
    const scaled = scaleRange({ from, to }, 0.5);
    expect(getRangeDuration(scaled)).toBe(2 * 3600_000);
  });

  it("preserves midpoint", () => {
    const from = new Date(2024, 0, 1, 10, 0);
    const to = new Date(2024, 0, 1, 14, 0);
    const mid = (from.getTime() + to.getTime()) / 2;
    const scaled = scaleRange({ from, to }, 2);
    const scaledMid = (scaled.from.getTime() + scaled.to.getTime()) / 2;
    expect(scaledMid).toBe(mid);
  });
});

// ── buildRelativeLabel ───────────────────────────────────────────

describe("buildRelativeLabel", () => {
  it("builds label for minutes", () => {
    expect(buildRelativeLabel(5, "m")).toBe("Last 5 minutes");
  });

  it("builds label for hours", () => {
    expect(buildRelativeLabel(3, "h")).toBe("Last 3 hours");
  });

  it("builds label for days", () => {
    expect(buildRelativeLabel(7, "d")).toBe("Last 7 days");
  });

  it("falls back to raw unit when not found in DEFAULT_TIME_UNITS", () => {
    // Cast to bypass TS — simulates an unknown unit at runtime
    expect(buildRelativeLabel(3, "x" as never)).toBe("Last 3 x");
  });
});

// ── generateTicks ────────────────────────────────────────────────

describe("generateTicks", () => {
  it("generates correct number of ticks", () => {
    const from = new Date(2024, 0, 1, 0, 0);
    const to = new Date(2024, 0, 1, 4, 0);
    const ticks = generateTicks(from, to, 5);
    expect(ticks).toHaveLength(5);
  });

  it("first tick matches from, last matches to", () => {
    const from = new Date(2024, 0, 1, 0, 0);
    const to = new Date(2024, 0, 1, 4, 0);
    const ticks = generateTicks(from, to, 5);
    expect(ticks[0].getTime()).toBe(from.getTime());
    expect(ticks[4].getTime()).toBe(to.getTime());
  });

  it("ticks are evenly spaced", () => {
    const from = new Date(2024, 0, 1, 0, 0);
    const to = new Date(2024, 0, 1, 4, 0);
    const ticks = generateTicks(from, to, 5);
    const gap = ticks[1].getTime() - ticks[0].getTime();
    for (let i = 2; i < ticks.length; i++) {
      expect(ticks[i].getTime() - ticks[i - 1].getTime()).toBe(gap);
    }
  });
});

// ── cx ───────────────────────────────────────────────────────────

describe("cx", () => {
  it("joins truthy strings", () => {
    expect(cx("a", "b", "c")).toBe("a b c");
  });

  it("filters falsy values", () => {
    expect(cx("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string for no args", () => {
    expect(cx()).toBe("");
  });
});
