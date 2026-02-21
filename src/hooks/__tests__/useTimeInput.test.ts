import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimeInput } from "../useTimeInput";

describe("useTimeInput", () => {
  // Base date: Jan 15, 2024 at 14:30:45
  const base = new Date(2024, 0, 15, 14, 30, 45);

  it("falls back to current date when value is null", () => {
    const { result } = renderHook(() => useTimeInput());
    // Should return valid time strings from Date.now()
    expect(result.current.hours).toMatch(/^\d{2}$/);
    expect(result.current.minutes).toMatch(/^\d{2}$/);
    expect(result.current.seconds).toMatch(/^\d{2}$/);
  });

  describe("24-hour format", () => {
    it("returns padded hours/minutes/seconds", () => {
      const { result } = renderHook(() => useTimeInput({ value: base }));
      expect(result.current.hours).toBe("14");
      expect(result.current.minutes).toBe("30");
      expect(result.current.seconds).toBe("45");
    });

    it("pads single digit hours", () => {
      const d = new Date(2024, 0, 1, 3, 5, 7);
      const { result } = renderHook(() => useTimeInput({ value: d }));
      expect(result.current.hours).toBe("03");
      expect(result.current.minutes).toBe("05");
      expect(result.current.seconds).toBe("07");
    });

    it("setHours updates the date", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useTimeInput({ value: base, onChange }));

      act(() => result.current.setHours("20"));
      expect(onChange).toHaveBeenCalledTimes(1);
      const updated = onChange.mock.calls[0][0] as Date;
      expect(updated.getHours()).toBe(20);
    });

    it("setHours rejects out-of-range (24h)", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useTimeInput({ value: base, onChange }));

      act(() => result.current.setHours("25"));
      expect(onChange).not.toHaveBeenCalled();

      act(() => result.current.setHours("-1"));
      expect(onChange).not.toHaveBeenCalled();
    });

    it("setHours rejects NaN", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useTimeInput({ value: base, onChange }));

      act(() => result.current.setHours("abc"));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("12-hour format", () => {
    it("displays 12-hour format", () => {
      const { result } = renderHook(() => useTimeInput({ value: base, hourFormat: 12 }));
      expect(result.current.hours).toBe("02"); // 14 → 2 PM
      expect(result.current.period).toBe("PM");
    });

    it("displays 12 for noon", () => {
      const noon = new Date(2024, 0, 1, 12, 0, 0);
      const { result } = renderHook(() => useTimeInput({ value: noon, hourFormat: 12 }));
      expect(result.current.hours).toBe("12");
      expect(result.current.period).toBe("PM");
    });

    it("displays 12 for midnight", () => {
      const midnight = new Date(2024, 0, 1, 0, 0, 0);
      const { result } = renderHook(() => useTimeInput({ value: midnight, hourFormat: 12 }));
      expect(result.current.hours).toBe("12");
      expect(result.current.period).toBe("AM");
    });

    it("setHours in 12-hour format (PM)", () => {
      const onChange = vi.fn();
      // 14:30 = 2:30 PM
      const { result } = renderHook(() => useTimeInput({ value: base, onChange, hourFormat: 12 }));

      act(() => result.current.setHours("5")); // 5 PM = 17
      const updated = onChange.mock.calls[0][0] as Date;
      expect(updated.getHours()).toBe(17);
    });

    it("setHours 12 PM = 12:00", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useTimeInput({ value: base, onChange, hourFormat: 12 }));

      act(() => result.current.setHours("12")); // 12 PM = 12
      const updated = onChange.mock.calls[0][0] as Date;
      expect(updated.getHours()).toBe(12);
    });

    it("setHours 12 AM = 0:00", () => {
      const onChange = vi.fn();
      const morning = new Date(2024, 0, 1, 3, 0, 0); // 3 AM
      const { result } = renderHook(() => useTimeInput({ value: morning, onChange, hourFormat: 12 }));

      act(() => result.current.setHours("12")); // 12 AM = 0
      const updated = onChange.mock.calls[0][0] as Date;
      expect(updated.getHours()).toBe(0);
    });

    it("setPeriod AM → PM", () => {
      const onChange = vi.fn();
      const morning = new Date(2024, 0, 1, 9, 0, 0); // 9 AM
      const { result } = renderHook(() => useTimeInput({ value: morning, onChange, hourFormat: 12 }));

      act(() => result.current.setPeriod("PM"));
      const updated = onChange.mock.calls[0][0] as Date;
      expect(updated.getHours()).toBe(21); // 9 + 12
    });

    it("setPeriod PM → AM", () => {
      const onChange = vi.fn();
      // base is 14:30 PM
      const { result } = renderHook(() => useTimeInput({ value: base, onChange, hourFormat: 12 }));

      act(() => result.current.setPeriod("AM"));
      const updated = onChange.mock.calls[0][0] as Date;
      expect(updated.getHours()).toBe(2); // 14 - 12
    });

    it("setPeriod is no-op in 24h format", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useTimeInput({ value: base, onChange, hourFormat: 24 }));

      act(() => result.current.setPeriod("AM"));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("setMinutes / setSeconds", () => {
    it("setMinutes updates", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useTimeInput({ value: base, onChange }));

      act(() => result.current.setMinutes("15"));
      expect((onChange.mock.calls[0][0] as Date).getMinutes()).toBe(15);
    });

    it("setMinutes rejects out-of-range", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useTimeInput({ value: base, onChange }));

      act(() => result.current.setMinutes("60"));
      expect(onChange).not.toHaveBeenCalled();
    });

    it("setSeconds updates", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useTimeInput({ value: base, onChange }));

      act(() => result.current.setSeconds("30"));
      expect((onChange.mock.calls[0][0] as Date).getSeconds()).toBe(30);
    });
  });

  describe("increment / decrement", () => {
    it("incrementHours wraps 23 → 0", () => {
      const onChange = vi.fn();
      const d = new Date(2024, 0, 1, 23, 0, 0);
      const { result } = renderHook(() => useTimeInput({ value: d, onChange }));

      act(() => result.current.incrementHours());
      expect((onChange.mock.calls[0][0] as Date).getHours()).toBe(0);
    });

    it("decrementHours wraps 0 → 23", () => {
      const onChange = vi.fn();
      const d = new Date(2024, 0, 1, 0, 0, 0);
      const { result } = renderHook(() => useTimeInput({ value: d, onChange }));

      act(() => result.current.decrementHours());
      expect((onChange.mock.calls[0][0] as Date).getHours()).toBe(23);
    });

    it("incrementMinutes wraps 59 → 0", () => {
      const onChange = vi.fn();
      const d = new Date(2024, 0, 1, 10, 59, 0);
      const { result } = renderHook(() => useTimeInput({ value: d, onChange }));

      act(() => result.current.incrementMinutes());
      expect((onChange.mock.calls[0][0] as Date).getMinutes()).toBe(0);
    });

    it("decrementMinutes wraps 0 → 59", () => {
      const onChange = vi.fn();
      const d = new Date(2024, 0, 1, 10, 0, 0);
      const { result } = renderHook(() => useTimeInput({ value: d, onChange }));

      act(() => result.current.decrementMinutes());
      expect((onChange.mock.calls[0][0] as Date).getMinutes()).toBe(59);
    });

    it("incrementSeconds wraps 59 → 0", () => {
      const onChange = vi.fn();
      const d = new Date(2024, 0, 1, 10, 0, 59);
      const { result } = renderHook(() => useTimeInput({ value: d, onChange }));

      act(() => result.current.incrementSeconds());
      expect((onChange.mock.calls[0][0] as Date).getSeconds()).toBe(0);
    });

    it("decrementSeconds wraps 0 → 59", () => {
      const onChange = vi.fn();
      const d = new Date(2024, 0, 1, 10, 0, 0);
      const { result } = renderHook(() => useTimeInput({ value: d, onChange }));

      act(() => result.current.decrementSeconds());
      expect((onChange.mock.calls[0][0] as Date).getSeconds()).toBe(59);
    });
  });
});
