import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRangeState } from "../useRangeState";

describe("useRangeState", () => {
  it("initializes with default from (6h ago) and to (now)", () => {
    const { result } = renderHook(() => useRangeState());
    const now = Date.now();
    const sixHoursMs = 6 * 3600_000;
    // "from" should be roughly 6h before now (within 1s tolerance)
    expect(Math.abs(result.current.from.getTime() - (now - sixHoursMs))).toBeLessThan(1000);
    expect(Math.abs(result.current.to.getTime() - now)).toBeLessThan(1000);
  });

  it("uses custom defaultFrom / defaultTo", () => {
    const from = new Date(2024, 0, 1);
    const to = new Date(2024, 0, 2);
    const { result } = renderHook(() => useRangeState({ defaultFrom: from, defaultTo: to }));
    expect(result.current.from.getTime()).toBe(from.getTime());
    expect(result.current.to.getTime()).toBe(to.getTime());
  });

  it("setFrom / setTo update state", () => {
    const { result } = renderHook(() => useRangeState());
    const newFrom = new Date(2024, 5, 1);
    const newTo = new Date(2024, 5, 2);

    act(() => result.current.setFrom(newFrom));
    expect(result.current.from.getTime()).toBe(newFrom.getTime());

    act(() => result.current.setTo(newTo));
    expect(result.current.to.getTime()).toBe(newTo.getTime());
  });

  it("setRange updates both dates and label", () => {
    const { result } = renderHook(() => useRangeState());
    const from = new Date(2024, 3, 1);
    const to = new Date(2024, 3, 10);

    act(() => result.current.setRange({ from, to }, "Custom"));
    expect(result.current.from.getTime()).toBe(from.getTime());
    expect(result.current.to.getTime()).toBe(to.getTime());
    expect(result.current.displayLabel).toBe("Custom");
  });

  it("open / close / toggle control isOpen", () => {
    const { result } = renderHook(() => useRangeState());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it("formattedFrom / formattedTo use formatDateTime by default", () => {
    const from = new Date(2024, 0, 5, 9, 3, 7);
    const to = new Date(2024, 0, 5, 15, 30, 0);
    const { result } = renderHook(() => useRangeState({ defaultFrom: from, defaultTo: to }));
    expect(result.current.formattedFrom).toBe("2024-01-05 09:03:07");
    expect(result.current.formattedTo).toBe("2024-01-05 15:30:00");
  });

  it("uses custom formatDate", () => {
    const from = new Date(2024, 0, 1);
    const to = new Date(2024, 0, 2);
    const { result } = renderHook(() =>
      useRangeState({ defaultFrom: from, defaultTo: to, formatDate: (d) => `day-${d.getDate()}` })
    );
    expect(result.current.formattedFrom).toBe("day-1");
    expect(result.current.formattedTo).toBe("day-2");
  });

  it("clampToLimits clamps setFrom / setTo to min/max", () => {
    const min = new Date(2024, 0, 5);
    const max = new Date(2024, 0, 25);
    const { result } = renderHook(() =>
      useRangeState({ defaultFrom: new Date(2024, 0, 10), defaultTo: new Date(2024, 0, 20), clampToLimits: true, minDate: min, maxDate: max })
    );

    act(() => result.current.setFrom(new Date(2024, 0, 1))); // before min
    expect(result.current.from.getTime()).toBe(min.getTime());

    act(() => result.current.setTo(new Date(2024, 0, 30))); // after max
    expect(result.current.to.getTime()).toBe(max.getTime());
  });

  it("fireChange invokes onChange", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useRangeState({ onChange }));
    const from = new Date(2024, 0, 1);
    const to = new Date(2024, 0, 2);

    act(() => result.current.fireChange(from, to, { source: "quick", quickLabel: "test" }));
    expect(onChange).toHaveBeenCalledWith(
      { from, to },
      { source: "quick", quickLabel: "test" },
    );
  });

  it("displayLabel falls back to formatted range when no label set", () => {
    const from = new Date(2024, 0, 1, 10, 0);
    const to = new Date(2024, 0, 1, 16, 0);
    const { result } = renderHook(() => useRangeState({ defaultFrom: from, defaultTo: to }));
    expect(result.current.displayLabel).toBe("Jan 1, 10:00 → Jan 1, 16:00");
  });
});
