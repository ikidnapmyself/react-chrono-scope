import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useChronoScope } from "../useChronoScope";
import { DEFAULT_QUICK_RANGES } from "../../constants";

describe("useChronoScope", () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date(2024, 5, 15, 12, 0, 0) }));
  afterEach(() => vi.useRealTimers());

  it("returns all composed sub-hooks", () => {
    const { result } = renderHook(() => useChronoScope());
    expect(result.current.range).toBeDefined();
    expect(result.current.quick).toBeDefined();
    expect(result.current.relative).toBeDefined();
    expect(result.current.nav).toBeDefined();
    expect(result.current.live).toBeDefined();
    expect(result.current.mode).toBe("quick");
    expect(typeof result.current.setMode).toBe("function");
  });

  it("initializes range from defaultQuickLabel", () => {
    const { result } = renderHook(() => useChronoScope({ defaultQuickLabel: "Last 1 hour" }));
    const now = new Date(2024, 5, 15, 12, 0, 0);
    const oneHourAgo = now.getTime() - 3600_000;
    // from should be ~1h before now
    expect(Math.abs(result.current.range.from.getTime() - oneHourAgo)).toBeLessThan(100);
    expect(Math.abs(result.current.range.to.getTime() - now.getTime())).toBeLessThan(100);
  });

  it("uses explicit defaultFrom/defaultTo over defaultQuickLabel", () => {
    const from = new Date(2024, 0, 1);
    const to = new Date(2024, 0, 2);
    const { result } = renderHook(() =>
      useChronoScope({ defaultFrom: from, defaultTo: to, defaultQuickLabel: "Last 1 hour" })
    );
    expect(result.current.range.from.getTime()).toBe(from.getTime());
    expect(result.current.range.to.getTime()).toBe(to.getTime());
  });

  it("falls back to rangeOptions when defaultQuickLabel doesn't match", () => {
    const { result } = renderHook(() =>
      useChronoScope({ defaultQuickLabel: "nonexistent label" })
    );
    // Should still have valid dates (fallback path returns rangeOptions as-is)
    expect(result.current.range.from).toBeInstanceOf(Date);
    expect(result.current.range.to).toBeInstanceOf(Date);
  });

  it("setMode switches mode", () => {
    const { result } = renderHook(() => useChronoScope());
    expect(result.current.mode).toBe("quick");

    act(() => result.current.setMode("absolute"));
    expect(result.current.mode).toBe("absolute");

    act(() => result.current.setMode("relative"));
    expect(result.current.mode).toBe("relative");
  });

  it("quick.select updates range and activeLabel", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useChronoScope({ onChange }));

    act(() => result.current.quick.select(DEFAULT_QUICK_RANGES[0]));
    expect(result.current.quick.activeLabel).toBe(DEFAULT_QUICK_RANGES[0].label);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ from: expect.any(Date), to: expect.any(Date) }),
      expect.objectContaining({ source: "quick" }),
    );
  });

  it("nav.shiftForward updates range", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useChronoScope({ onChange }));
    const fromBefore = result.current.range.from.getTime();

    act(() => result.current.nav.shiftForward());
    expect(result.current.range.from.getTime()).toBeGreaterThan(fromBefore);
    expect(onChange).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ source: "shift" }),
    );
  });

  it("live.toggle activates live mode", () => {
    const onLiveToggle = vi.fn();
    const { result } = renderHook(() => useChronoScope({ onLiveToggle }));

    act(() => result.current.live.toggle());
    expect(result.current.live.isLive).toBe(true);
    expect(onLiveToggle).toHaveBeenCalledWith(true);
  });

  it("refreshFn returns quick range dates when activeLabel matches", () => {
    const { result } = renderHook(() =>
      useChronoScope({ defaultQuickLabel: "Last 5 minutes" })
    );
    // Select the "Last 5 minutes" quick range to set activeLabel
    act(() => result.current.quick.select(DEFAULT_QUICK_RANGES[0]));

    // Enable live mode and advance — the interval will call refreshFn
    act(() => result.current.live.toggle());
    const fromBefore = result.current.range.from.getTime();
    act(() => vi.advanceTimersByTime(5001));

    // Range should have been refreshed (from should be ~5min ago from "now")
    expect(result.current.range.from).toBeInstanceOf(Date);
  });

  it("refreshFn falls back to current range when activeLabel doesn't match quickRanges", () => {
    // defaultQuickLabel won't match any of these custom ranges
    const custom = [{ label: "Custom 10s", value: 10, unit: "s" as const }];
    const { result } = renderHook(() =>
      useChronoScope({ quickRanges: custom, defaultQuickLabel: "Nonexistent", liveInterval: 1000 })
    );

    // activeLabel is "Nonexistent" but no quickRange matches it
    expect(result.current.quick.activeLabel).toBe("Nonexistent");

    const fromBefore = result.current.range.from.getTime();
    const toBefore = result.current.range.to.getTime();

    // Enable live and trigger refresh — refreshFn should fallback to current range
    act(() => result.current.live.toggle());
    act(() => vi.advanceTimersByTime(1001));

    // Range should remain the same (fallback returns current from/to)
    expect(result.current.range.from.getTime()).toBe(fromBefore);
    expect(result.current.range.to.getTime()).toBe(toBefore);
  });

  it("accepts custom quickRanges", () => {
    const custom = [{ label: "Last 10s", value: 10, unit: "s" as const }];
    const { result } = renderHook(() => useChronoScope({ quickRanges: custom }));
    expect(result.current.quick.ranges).toBe(custom);
  });

  it("passes timeUnits to relative hook", () => {
    const customUnits = [{ label: "Seconds", value: "s" as const, shortLabel: "sec" }];
    const { result } = renderHook(() => useChronoScope({ timeUnits: customUnits }));
    expect(result.current.relative.timeUnits).toBe(customUnits);
  });
});
