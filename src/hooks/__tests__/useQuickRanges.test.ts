import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRangeState } from "../useRangeState";
import { useQuickRanges } from "../useQuickRanges";
import { DEFAULT_QUICK_RANGES } from "../../constants";
import type { QuickRange } from "../../types";

function setup(opts: { ranges?: QuickRange[]; defaultLabel?: string; onChange?: (...args: unknown[]) => void } = {}) {
  return renderHook(() => {
    const range = useRangeState({ onChange: opts.onChange });
    const quick = useQuickRanges(range, {
      ranges: opts.ranges,
      defaultLabel: opts.defaultLabel,
    });
    return { range, quick };
  });
}

describe("useQuickRanges", () => {
  it("loads default ranges", () => {
    const { result } = setup();
    expect(result.current.quick.ranges).toBe(DEFAULT_QUICK_RANGES);
    expect(result.current.quick.ranges.length).toBeGreaterThan(0);
  });

  it("uses custom ranges", () => {
    const custom: QuickRange[] = [{ label: "Last 10s", value: 10, unit: "s" }];
    const { result } = setup({ ranges: custom });
    expect(result.current.quick.ranges).toBe(custom);
  });

  it("sets defaultLabel as initial activeLabel", () => {
    const { result } = setup({ defaultLabel: "Last 1 hour" });
    expect(result.current.quick.activeLabel).toBe("Last 1 hour");
  });

  it("activeLabel is null by default", () => {
    const { result } = setup();
    expect(result.current.quick.activeLabel).toBeNull();
  });

  it("filter narrows filteredRanges", () => {
    const { result } = setup();

    act(() => result.current.quick.setFilter("hour"));
    const labels = result.current.quick.filteredRanges.map(r => r.label);
    expect(labels.every(l => l.toLowerCase().includes("hour"))).toBe(true);
    expect(labels.length).toBeGreaterThan(0);
    expect(labels.length).toBeLessThan(DEFAULT_QUICK_RANGES.length);
  });

  it("filter is case-insensitive", () => {
    const { result } = setup();

    act(() => result.current.quick.setFilter("HOUR"));
    expect(result.current.quick.filteredRanges.length).toBeGreaterThan(0);
  });

  it("select updates range, sets activeLabel, clears filter, and closes", () => {
    const onChange = vi.fn();
    const { result } = setup({ onChange });
    const target = DEFAULT_QUICK_RANGES[0]; // "Last 5 minutes"

    // Open and set a filter first
    act(() => result.current.range.open());
    act(() => result.current.quick.setFilter("something"));

    act(() => result.current.quick.select(target));

    expect(result.current.quick.activeLabel).toBe(target.label);
    expect(result.current.quick.filter).toBe("");
    expect(result.current.range.isOpen).toBe(false);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ from: expect.any(Date), to: expect.any(Date) }),
      expect.objectContaining({ source: "quick", quickLabel: target.label }),
    );
  });
});
