import { useState, useMemo, useCallback } from "react";
import type { UseCalendarOptions, UseCalendarReturn, CalendarDay } from "../types";
import { MONTHS, WEEK_DAYS } from "../constants";
import { getDaysInMonth, getFirstDayOfMonth, isSameDay, isDateInRange } from "../utils/date";

export function useCalendar(options: UseCalendarOptions = {}): UseCalendarReturn {
  const {
    selected = null, onSelect, rangeStart = null, rangeEnd = null,
    minDate, maxDate, weekStartsOn = 0,
  } = options;

  const [viewYear, setViewYear] = useState(() => (selected || new Date()).getFullYear());
  const [viewMonth, setViewMonth] = useState(() => (selected || new Date()).getMonth());
  const today = useMemo(() => new Date(), []);
  const monthName = MONTHS[viewMonth];

  const weekDays = useMemo(() => {
    const shifted: string[] = [];
    for (let i = 0; i < 7; i++) shifted.push(WEEK_DAYS[(i + weekStartsOn) % 7]);
    return shifted;
  }, [weekStartsOn]);

  const days = useMemo<CalendarDay[]>(() => {
    const dim = getDaysInMonth(viewYear, viewMonth);
    let firstDay = getFirstDayOfMonth(viewYear, viewMonth) - weekStartsOn;
    if (firstDay < 0) firstDay += 7;
    const result: CalendarDay[] = [];

    for (let i = 0; i < firstDay; i++) {
      result.push({ date: 0, isCurrentMonth: false, isToday: false, isSelected: false, isInRange: false, isDisabled: true });
    }

    for (let d = 1; d <= dim; d++) {
      const cellDate = new Date(viewYear, viewMonth, d);
      let isDisabled = false;
      if (minDate) { const m = new Date(minDate); m.setHours(0,0,0,0); if (cellDate < m) isDisabled = true; }
      if (maxDate) { const m = new Date(maxDate); m.setHours(23,59,59,999); if (cellDate > m) isDisabled = true; }
      result.push({
        date: d, isCurrentMonth: true,
        isToday: isSameDay(cellDate, today),
        isSelected: selected ? isSameDay(cellDate, selected) : false,
        isInRange: rangeStart && rangeEnd ? isDateInRange(cellDate, rangeStart, rangeEnd) : false,
        isDisabled,
      });
    }
    return result;
  }, [viewYear, viewMonth, selected, rangeStart, rangeEnd, minDate, maxDate, today, weekStartsOn]);

  const prevMonth = useCallback(() => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }, [viewMonth]);

  const nextMonth = useCallback(() => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }, [viewMonth]);

  const goToMonth = useCallback((year: number, month: number) => {
    setViewYear(year); setViewMonth(month);
  }, []);

  const selectDay = useCallback((day: number) => {
    if (day <= 0 || !onSelect) return;
    const d = selected ? new Date(selected) : new Date();
    d.setFullYear(viewYear, viewMonth, day);
    onSelect(d);
  }, [selected, viewYear, viewMonth, onSelect]);

  return { viewYear, viewMonth, monthName, days, weekDays, prevMonth, nextMonth, goToMonth, selectDay };
}
