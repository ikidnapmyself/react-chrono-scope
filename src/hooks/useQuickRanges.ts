import { useState, useCallback, useMemo } from "react";
import type {
  UseRangeStateReturn, UseQuickRangesOptions, UseQuickRangesReturn, QuickRange,
} from "../types";
import { DEFAULT_QUICK_RANGES } from "../constants";
import { applyRelativeTime } from "../utils/date";

export function useQuickRanges(
  rangeState: UseRangeStateReturn,
  options: UseQuickRangesOptions = {},
): UseQuickRangesReturn {
  const { ranges = DEFAULT_QUICK_RANGES, defaultLabel = null } = options;
  const [activeLabel, setActiveLabel] = useState<string | null>(defaultLabel);
  const [filter, setFilter] = useState("");

  const filteredRanges = useMemo(
    () => ranges.filter(r => r.label.toLowerCase().includes(filter.toLowerCase())),
    [ranges, filter],
  );

  const select = useCallback(
    (range: QuickRange) => {
      const now = new Date();
      const from = rangeState.clamp(applyRelativeTime(range.value, range.unit));
      const to = rangeState.clamp(now);
      rangeState.setRange({ from, to }, range.label);
      setActiveLabel(range.label);
      setFilter("");
      rangeState.close();
      rangeState.fireChange(from, to, { source: "quick", quickLabel: range.label });
    },
    [rangeState],
  );

  return { ranges, activeLabel, filter, setFilter, filteredRanges, select };
}
