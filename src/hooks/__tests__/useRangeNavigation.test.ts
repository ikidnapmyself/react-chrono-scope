import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRangeState } from "../useRangeState";
import { useRangeNavigation } from "../useRangeNavigation";

function setup(from: Date, to: Date, onChange?: (...args: unknown[]) => void) {
  return renderHook(() => {
    const range = useRangeState({ defaultFrom: from, defaultTo: to, onChange });
    const nav = useRangeNavigation(range);
    return { range, nav };
  });
}

describe("useRangeNavigation", () => {
  // 4-hour range: 10:00 → 14:00
  const from = new Date(2024, 0, 15, 10, 0, 0, 0);
  const to = new Date(2024, 0, 15, 14, 0, 0, 0);
  const rangeDurationMs = 4 * 3600_000;

  it("shiftBack moves range back by half duration", () => {
    const onChange = vi.fn();
    const { result } = setup(from, to, onChange);

    act(() => result.current.nav.shiftBack());

    // Half of 4h = 2h. So from=08:00, to=12:00
    expect(result.current.range.from.getHours()).toBe(8);
    expect(result.current.range.to.getHours()).toBe(12);
    expect(onChange).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ source: "shift" }),
    );
  });

  it("shiftForward moves range forward by half duration", () => {
    const { result } = setup(from, to);

    act(() => result.current.nav.shiftForward());

    // Half of 4h = 2h. So from=12:00, to=16:00
    expect(result.current.range.from.getHours()).toBe(12);
    expect(result.current.range.to.getHours()).toBe(16);
  });

  it("shiftBack then shiftForward returns to original", () => {
    const { result } = setup(from, to);

    act(() => result.current.nav.shiftBack());
    act(() => result.current.nav.shiftForward());

    expect(result.current.range.from.getTime()).toBe(from.getTime());
    expect(result.current.range.to.getTime()).toBe(to.getTime());
  });

  it("zoomOut doubles the range (centered)", () => {
    const onChange = vi.fn();
    const { result } = setup(from, to, onChange);

    act(() => result.current.nav.zoomOut());

    const newDuration = result.current.range.to.getTime() - result.current.range.from.getTime();
    expect(newDuration).toBe(rangeDurationMs * 2);
    expect(onChange).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ source: "zoom" }),
    );
  });

  it("zoomIn halves the range (centered)", () => {
    const { result } = setup(from, to);

    act(() => result.current.nav.zoomIn());

    const newDuration = result.current.range.to.getTime() - result.current.range.from.getTime();
    expect(newDuration).toBe(rangeDurationMs / 2);
  });

  it("zoomIn preserves center", () => {
    const { result } = setup(from, to);
    const midBefore = (from.getTime() + to.getTime()) / 2;

    act(() => result.current.nav.zoomIn());

    const midAfter = (result.current.range.from.getTime() + result.current.range.to.getTime()) / 2;
    expect(midAfter).toBe(midBefore);
  });

  it("zoomIn prevents inversion (no-op when range is zero)", () => {
    const same = new Date(2024, 0, 1, 12, 0, 0, 0);
    const { result } = setup(same, same);

    act(() => result.current.nav.zoomIn());

    // Should remain unchanged — diff is 0, so nt <= nf
    expect(result.current.range.from.getTime()).toBe(same.getTime());
    expect(result.current.range.to.getTime()).toBe(same.getTime());
  });
});
