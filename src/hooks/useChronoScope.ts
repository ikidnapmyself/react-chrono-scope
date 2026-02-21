import { useState, useCallback, useMemo } from "react";
import type {
  UseChronoScopeOptions, UseChronoScopeReturn, SelectionMode,
} from "../types";
import { DEFAULT_QUICK_RANGES } from "../constants";
import { applyRelativeTime } from "../utils/date";
import { useRangeState } from "./useRangeState";
import { useQuickRanges } from "./useQuickRanges";
import { useRelativeRange } from "./useRelativeRange";
import { useRangeNavigation } from "./useRangeNavigation";
import { useLiveRefresh } from "./useLiveRefresh";

export function useChronoScope(options: UseChronoScopeOptions = {}): UseChronoScopeReturn {
  const {
    quickRanges = DEFAULT_QUICK_RANGES,
    defaultQuickLabel = "Last 6 hours",
    timeUnits,
    liveInterval,
    onLiveToggle,
    ...rangeOptions
  } = options;

  // Initialize range from defaultQuickLabel if no explicit defaults provided
  const resolvedRangeOptions = useMemo(() => {
    if (rangeOptions.defaultFrom || rangeOptions.defaultTo) return rangeOptions;
    const qr = quickRanges.find(r => r.label === defaultQuickLabel);
    if (qr) {
      return {
        ...rangeOptions,
        defaultFrom: applyRelativeTime(qr.value, qr.unit),
        defaultTo: new Date(),
      };
    }
    return rangeOptions;
  }, []); // Only compute once on mount

  const range = useRangeState(resolvedRangeOptions);
  const quick = useQuickRanges(range, { ranges: quickRanges, defaultLabel: defaultQuickLabel });
  const relative = useRelativeRange(range, { timeUnits });
  const nav = useRangeNavigation(range);

  // Build refreshFn from the current active quick label
  const refreshFn = useCallback(() => {
    const label = quick.activeLabel;
    if (label) {
      const qr = quickRanges.find(r => r.label === label);
      if (qr) {
        return {
          from: applyRelativeTime(qr.value, qr.unit),
          to: new Date(),
        };
      }
    }
    return { from: range.from, to: range.to };
  }, [quick.activeLabel, quickRanges, range.from, range.to]);

  const live = useLiveRefresh(range, { interval: liveInterval, onToggle: onLiveToggle, refreshFn });

  const [mode, setMode] = useState<SelectionMode>("quick");

  return { range, quick, relative, nav, live, mode, setMode };
}
