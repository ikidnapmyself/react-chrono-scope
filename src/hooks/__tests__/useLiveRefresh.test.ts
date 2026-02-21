import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRangeState } from "../useRangeState";
import { useLiveRefresh } from "../useLiveRefresh";

function setup(opts: { interval?: number; onToggle?: (v: boolean) => void; refreshFn?: () => { from: Date; to: Date } } = {}) {
  return renderHook(() => {
    const range = useRangeState();
    const live = useLiveRefresh(range, opts);
    return { range, live };
  });
}

describe("useLiveRefresh", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts with isLive = false", () => {
    const { result } = setup();
    expect(result.current.live.isLive).toBe(false);
  });

  it("toggle flips isLive", () => {
    const { result } = setup();

    act(() => result.current.live.toggle());
    expect(result.current.live.isLive).toBe(true);

    act(() => result.current.live.toggle());
    expect(result.current.live.isLive).toBe(false);
  });

  it("toggle calls onToggle callback", () => {
    const onToggle = vi.fn();
    const { result } = setup({ onToggle });

    act(() => result.current.live.toggle());
    expect(onToggle).toHaveBeenCalledWith(true);

    act(() => result.current.live.toggle());
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("setLive sets explicit value", () => {
    const onToggle = vi.fn();
    const { result } = setup({ onToggle });

    act(() => result.current.live.setLive(true));
    expect(result.current.live.isLive).toBe(true);
    expect(onToggle).toHaveBeenCalledWith(true);

    act(() => result.current.live.setLive(false));
    expect(result.current.live.isLive).toBe(false);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("calls refreshFn on interval when live", () => {
    const from = new Date(2024, 0, 1);
    const to = new Date(2024, 0, 2);
    const refreshFn = vi.fn(() => ({ from, to }));
    const { result } = setup({ interval: 1000, refreshFn });

    act(() => result.current.live.toggle()); // turn on

    expect(refreshFn).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1000));
    expect(refreshFn).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(1000));
    expect(refreshFn).toHaveBeenCalledTimes(2);
  });

  it("stops calling refreshFn when toggled off", () => {
    const refreshFn = vi.fn(() => ({ from: new Date(), to: new Date() }));
    const { result } = setup({ interval: 1000, refreshFn });

    act(() => result.current.live.toggle()); // on
    act(() => vi.advanceTimersByTime(1000));
    expect(refreshFn).toHaveBeenCalledTimes(1);

    act(() => result.current.live.toggle()); // off
    act(() => vi.advanceTimersByTime(5000));
    expect(refreshFn).toHaveBeenCalledTimes(1); // no more calls
  });

  it("does not start interval when no refreshFn", () => {
    const { result } = setup({ interval: 1000 });

    act(() => result.current.live.toggle());
    // No error, just no interval — nothing to assert except no crash
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.live.isLive).toBe(true);
  });
});
