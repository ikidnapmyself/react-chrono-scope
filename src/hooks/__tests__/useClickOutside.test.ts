import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useClickOutside } from "../useClickOutside";

describe("useClickOutside", () => {
  it("calls callback when clicking outside the ref element", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(callback, true));

    // Create and attach a div to the ref
    const div = document.createElement("div");
    document.body.appendChild(div);
    Object.defineProperty(result.current, "current", { value: div, writable: true });

    // Click outside
    document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(callback).toHaveBeenCalledTimes(1);

    document.body.removeChild(div);
  });

  it("does NOT call callback when clicking inside the ref element", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(callback, true));

    const div = document.createElement("div");
    document.body.appendChild(div);
    Object.defineProperty(result.current, "current", { value: div, writable: true });

    // Click inside
    div.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  it("does NOT register handler when disabled", () => {
    const callback = vi.fn();
    renderHook(() => useClickOutside<HTMLDivElement>(callback, false));

    document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });

  it("returns a ref object", () => {
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(() => {}));
    expect(result.current).toHaveProperty("current");
  });
});
