import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCalendar } from "../useCalendar";

describe("useCalendar", () => {
  const jan2024 = new Date(2024, 0, 15); // January 15, 2024

  it("initializes to selected date's month/year", () => {
    const { result } = renderHook(() => useCalendar({ selected: jan2024 }));
    expect(result.current.viewYear).toBe(2024);
    expect(result.current.viewMonth).toBe(0);
    expect(result.current.monthName).toBe("January");
  });

  it("generates correct number of days for January 2024", () => {
    const { result } = renderHook(() => useCalendar({ selected: jan2024 }));
    const actualDays = result.current.days.filter(d => d.isCurrentMonth);
    expect(actualDays).toHaveLength(31);
  });

  it("pads empty cells before the first day", () => {
    // Jan 2024 starts on Monday (day 1), so 1 empty cell with weekStartsOn=0
    const { result } = renderHook(() => useCalendar({ selected: jan2024 }));
    const emptyBefore = result.current.days.filter(d => !d.isCurrentMonth);
    expect(emptyBefore.length).toBe(1);
    expect(emptyBefore[0].date).toBe(0);
  });

  it("marks today correctly", () => {
    const today = new Date();
    const { result } = renderHook(() => useCalendar({ selected: today }));
    const todayCell = result.current.days.find(d => d.isToday);
    expect(todayCell).toBeDefined();
    expect(todayCell!.date).toBe(today.getDate());
  });

  it("marks selected day", () => {
    const { result } = renderHook(() => useCalendar({ selected: jan2024 }));
    const selected = result.current.days.find(d => d.isSelected);
    expect(selected).toBeDefined();
    expect(selected!.date).toBe(15);
  });

  it("marks in-range days", () => {
    const start = new Date(2024, 0, 10);
    const end = new Date(2024, 0, 20);
    const { result } = renderHook(() =>
      useCalendar({ selected: jan2024, rangeStart: start, rangeEnd: end })
    );
    const inRange = result.current.days.filter(d => d.isInRange);
    expect(inRange).toHaveLength(11); // 10th through 20th inclusive
  });

  it("disables days outside minDate/maxDate", () => {
    const min = new Date(2024, 0, 10);
    const max = new Date(2024, 0, 20);
    const { result } = renderHook(() =>
      useCalendar({ selected: jan2024, minDate: min, maxDate: max })
    );
    const disabled = result.current.days.filter(d => d.isCurrentMonth && d.isDisabled);
    // Days 1-9 (before min) + 21-31 (after max) = 9 + 11 = 20
    expect(disabled).toHaveLength(20);
  });

  it("prevMonth wraps January → December (year change)", () => {
    const { result } = renderHook(() => useCalendar({ selected: jan2024 }));

    act(() => result.current.prevMonth());
    expect(result.current.viewMonth).toBe(11);
    expect(result.current.viewYear).toBe(2023);
  });

  it("prevMonth decrements non-January month without year change", () => {
    const mar = new Date(2024, 2, 15); // March
    const { result } = renderHook(() => useCalendar({ selected: mar }));

    act(() => result.current.prevMonth());
    expect(result.current.viewMonth).toBe(1); // February
    expect(result.current.viewYear).toBe(2024);
  });

  it("nextMonth navigates to next month", () => {
    const { result } = renderHook(() => useCalendar({ selected: jan2024 }));

    act(() => result.current.nextMonth());
    expect(result.current.viewMonth).toBe(1);
    expect(result.current.viewYear).toBe(2024);
  });

  it("prevMonth wraps December → November", () => {
    const dec = new Date(2024, 11, 15);
    const { result } = renderHook(() => useCalendar({ selected: dec }));

    act(() => result.current.nextMonth());
    expect(result.current.viewMonth).toBe(0);
    expect(result.current.viewYear).toBe(2025);
  });

  it("goToMonth jumps to arbitrary month", () => {
    const { result } = renderHook(() => useCalendar({ selected: jan2024 }));

    act(() => result.current.goToMonth(2025, 6));
    expect(result.current.viewYear).toBe(2025);
    expect(result.current.viewMonth).toBe(6);
    expect(result.current.monthName).toBe("July");
  });

  it("selectDay calls onSelect with correct date", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useCalendar({ selected: jan2024, onSelect }));

    act(() => result.current.selectDay(20));
    expect(onSelect).toHaveBeenCalledTimes(1);
    const selected = onSelect.mock.calls[0][0] as Date;
    expect(selected.getFullYear()).toBe(2024);
    expect(selected.getMonth()).toBe(0);
    expect(selected.getDate()).toBe(20);
  });

  it("selectDay creates date from now when selected is null", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useCalendar({ onSelect }));

    act(() => result.current.selectDay(10));
    expect(onSelect).toHaveBeenCalledTimes(1);
    const selected = onSelect.mock.calls[0][0] as Date;
    expect(selected.getDate()).toBe(10);
  });

  it("selectDay ignores invalid day (0 or negative)", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useCalendar({ selected: jan2024, onSelect }));

    act(() => result.current.selectDay(0));
    act(() => result.current.selectDay(-1));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("weekStartsOn shifts weekDays header", () => {
    const { result } = renderHook(() => useCalendar({ weekStartsOn: 1 }));
    expect(result.current.weekDays[0]).toBe("Mo");
    expect(result.current.weekDays[6]).toBe("Su");
  });

  it("weekStartsOn=0 starts with Sunday", () => {
    const { result } = renderHook(() => useCalendar({ weekStartsOn: 0 }));
    expect(result.current.weekDays[0]).toBe("Su");
  });

  it("handles February leap year (2024)", () => {
    const feb = new Date(2024, 1, 15);
    const { result } = renderHook(() => useCalendar({ selected: feb }));
    const actualDays = result.current.days.filter(d => d.isCurrentMonth);
    expect(actualDays).toHaveLength(29);
  });

  it("handles February non-leap year (2023)", () => {
    const feb = new Date(2023, 1, 15);
    const { result } = renderHook(() => useCalendar({ selected: feb }));
    const actualDays = result.current.days.filter(d => d.isCurrentMonth);
    expect(actualDays).toHaveLength(28);
  });
});
