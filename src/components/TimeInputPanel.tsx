import React from "react";
import type { TimeInputPanelProps } from "../types";
import { resolveClassNames } from "../utils/classnames";

export const TimeInputPanel: React.FC<TimeInputPanelProps> = ({
  time,
  label,
  classNames: classNamesOverride,
  hourFormat = 24,
  showSeconds = true,
}) => {
  const cn = resolveClassNames(undefined, classNamesOverride);

  return (
    <div data-cs="time-input" className={cn.timeInput}>
      {label && <span data-cs="time-input-label" className={cn.timeInputLabel}>{label}</span>}
      <div data-cs="time-input-fields" className={cn.timeInputFields}>
        <input
          data-cs="time-input-field"
          className={cn.timeInputField}
          value={time.hours}
          onChange={e => time.setHours(e.target.value)}
          maxLength={2}
          aria-label={`${label || "Time"} hours`}
        />
        <span data-cs="time-input-separator" className={cn.timeInputSeparator}>:</span>
        <input
          data-cs="time-input-field"
          className={cn.timeInputField}
          value={time.minutes}
          onChange={e => time.setMinutes(e.target.value)}
          maxLength={2}
          aria-label={`${label || "Time"} minutes`}
        />
        {showSeconds && (
          <>
            <span data-cs="time-input-separator" className={cn.timeInputSeparator}>:</span>
            <input
              data-cs="time-input-field"
              className={cn.timeInputField}
              value={time.seconds}
              onChange={e => time.setSeconds(e.target.value)}
              maxLength={2}
              aria-label={`${label || "Time"} seconds`}
            />
          </>
        )}
        {hourFormat === 12 && (
          <button
            type="button"
            data-cs="time-input-period"
            className={cn.timeInputPeriod}
            onClick={() => time.setPeriod(time.period === "AM" ? "PM" : "AM")}
            aria-label={`Toggle AM/PM, currently ${time.period}`}
          >
            {time.period}
          </button>
        )}
      </div>
    </div>
  );
};
