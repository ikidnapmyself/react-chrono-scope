import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRangeState } from "../useRangeState";
import { useRelativeRange } from "../useRelativeRange";
import { DEFAULT_TIME_UNITS } from "../../constants";

function setup(opts: { defaultValue?: string; defaultUnit?: "s" | "m" | "h" | "d"; onChange?: (...args: unknown[]) => void } = {}) {
  return renderHook(() => {
    const range = useRangeState({ onChange: opts.onChange });
    const relative = useRelativeRange(range, {
      defaultValue: opts.defaultValue,
      defaultUnit: opts.defaultUnit,
    });
    return { range, relative };
  });
}

describe("useRelativeRange", () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date(2024, 5, 15, 12, 0, 0) }));
  afterEach(() => vi.useRealTimers());

  it("initializes with default value and unit", () => {
    const { result } = setup();
    expect(result.current.relative.value).toBe("5");
    expect(result.current.relative.unit).toBe("m");
  });

  it("uses custom defaults", () => {
    const { result } = setup({ defaultValue: "30", defaultUnit: "h" });
    expect(result.current.relative.value).toBe("30");
    expect(result.current.relative.unit).toBe("h");
  });

  it("exposes default time units", () => {
    const { result } = setup();
    expect(result.current.relative.timeUnits).toBe(DEFAULT_TIME_UNITS);
  });

  it("setValue / setUnit update state", () => {
    const { result } = setup();

    act(() => result.current.relative.setValue("10"));
    expect(result.current.relative.value).toBe("10");

    act(() => result.current.relative.setUnit("h"));
    expect(result.current.relative.unit).toBe("h");
  });

  it("preview returns a date in the past", () => {
    const { result } = setup({ defaultValue: "30", defaultUnit: "m" });
    const now = new Date(2024, 5, 15, 12, 0, 0);
    expect(result.current.relative.preview.getTime()).toBeLessThan(now.getTime());
    // 30 minutes ago
    expect(result.current.relative.preview.getMinutes()).toBe(30);
  });

  it("preview handles invalid value gracefully", () => {
    const { result } = setup();
    act(() => result.current.relative.setValue("abc"));
    // Should return current time for invalid input
    expect(result.current.relative.preview).toBeInstanceOf(Date);
  });

  it("apply updates range, fires onChange, and closes", () => {
    const onChange = vi.fn();
    const { result } = setup({ defaultValue: "15", defaultUnit: "m", onChange });

    act(() => result.current.range.open());
    act(() => result.current.relative.apply());

    expect(result.current.range.isOpen).toBe(false);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ from: expect.any(Date), to: expect.any(Date) }),
      expect.objectContaining({
        source: "relative",
        quickLabel: "Last 15 minutes",
        relativeExpression: "15m",
      }),
    );
  });

  it("apply is no-op for invalid value", () => {
    const onChange = vi.fn();
    const { result } = setup({ onChange });

    act(() => result.current.relative.setValue("abc"));
    act(() => result.current.relative.apply());

    expect(onChange).not.toHaveBeenCalled();
  });

  it("apply is no-op for zero", () => {
    const onChange = vi.fn();
    const { result } = setup({ onChange });

    act(() => result.current.relative.setValue("0"));
    act(() => result.current.relative.apply());

    expect(onChange).not.toHaveBeenCalled();
  });
});
