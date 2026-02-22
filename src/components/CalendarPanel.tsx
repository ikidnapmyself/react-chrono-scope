import React from "react";
import type { CalendarPanelProps } from "../types";
import { resolveClassNames } from "../utils/classnames";
import { cx } from "../utils/date";

export const CalendarPanel: React.FC<CalendarPanelProps> = ({
  calendar: cal,
  label,
  classNames: classNamesOverride,
  renderDay,
}) => {
  const cn = resolveClassNames(undefined, classNamesOverride);

  return (
    <div data-cs="calendar" className={cn.calendar}>
      {label && <div data-cs="calendar-label" className={cn.calendarLabel}>{label}</div>}
      <div data-cs="calendar-header" className={cn.calendarHeader}>
        <button
          type="button"
          data-cs="calendar-nav"
          className={cn.calendarNavButton}
          onClick={cal.prevMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span data-cs="calendar-title" className={cn.calendarTitle}>
          {cal.monthName} {cal.viewYear}
        </span>
        <button
          type="button"
          data-cs="calendar-nav"
          className={cn.calendarNavButton}
          onClick={cal.nextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div data-cs="calendar-week-row" className={cn.calendarWeekRow} style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {cal.weekDays.map(day => (
          <div key={day} data-cs="calendar-week-day" className={cn.calendarWeekDay}>
            {day}
          </div>
        ))}
      </div>
      <div data-cs="calendar-grid" className={cn.calendarGrid} style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {cal.days.map((day, i) => {
          if (day.date === 0) {
            return <div key={`empty-${i}`} data-cs="calendar-day-empty" className={cn.calendarDayEmpty} />;
          }

          const handleSelect = () => cal.selectDay(day.date);

          if (renderDay) {
            return (
              <React.Fragment key={day.date}>
                {renderDay(day, handleSelect, cn)}
              </React.Fragment>
            );
          }

          return (
            <button
              key={day.date}
              type="button"
              data-cs="calendar-day"
              data-today={day.isToday || undefined}
              data-selected={day.isSelected || undefined}
              data-in-range={day.isInRange || undefined}
              data-disabled={day.isDisabled || undefined}
              className={cx(
                cn.calendarDay,
                day.isToday && !day.isSelected && cn.calendarDayToday,
                day.isSelected && cn.calendarDaySelected,
                day.isInRange && !day.isSelected && cn.calendarDayInRange,
                day.isDisabled && cn.calendarDayDisabled,
              )}
              onClick={handleSelect}
              disabled={day.isDisabled}
            >
              {day.date}
            </button>
          );
        })}
      </div>
    </div>
  );
};
