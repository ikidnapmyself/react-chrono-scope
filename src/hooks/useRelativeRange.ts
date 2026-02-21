import { useState, useCallback, useMemo } from "react";
import type {
  UseRangeStateReturn, UseRelativeRangeOptions, UseRelativeRangeReturn, TimeUnit,
} from "../types";
import { DEFAULT_TIME_UNITS } from "../constants";
import { applyRelativeTime, buildRelativeLabel } from "../utils/date";

export function useRelativeRange(
  rangeState: UseRangeStateReturn,
  options: UseRelativeRangeOptions = {},
): UseRelativeRangeReturn {
  const {
    timeUnits = DEFAULT_TIME_UNITS,
    defaultValue = "5",
    defaultUnit = "m",
  } = options;

  const [value, setValue] = useState(defaultValue);
  const [unit, setUnit] = useState<TimeUnit>(defaultUnit);

  const preview = useMemo(() => {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) return new Date();
    return applyRelativeTime(val, unit);
  }, [value, unit]);

  const apply = useCallback(() => {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) return;
    const now = new Date();
    const from = rangeState.clamp(applyRelativeTime(val, unit));
    const to = rangeState.clamp(now);
    const label = buildRelativeLabel(val, unit);
    rangeState.setRange({ from, to }, label);
    rangeState.close();
    rangeState.fireChange(from, to, {
      source: "relative",
      quickLabel: label,
      relativeExpression: `${val}${unit}`,
    });
  }, [value, unit, rangeState]);

  return { value, unit, timeUnits, setValue, setUnit, apply, preview };
}
