import { useState, useCallback, useMemo } from "react";
import type { UseRangeStateOptions, UseRangeStateReturn, TimeRange, RangeChangeMeta } from "../types";
import { formatDateTime, formatRangeLabel, clampDate } from "../utils/date";
import { useClickOutside } from "./useClickOutside";

export function useRangeState(options: UseRangeStateOptions = {}): UseRangeStateReturn {
  const {
    defaultFrom, defaultTo,
    onChange, minDate, maxDate,
    clampToLimits = false,
    formatDate, formatDateShort: formatShort,
  } = options;

  const [from, setFromState] = useState<Date>(() => {
    if (defaultFrom) return defaultFrom;
    const d = new Date();
    d.setHours(d.getHours() - 6);
    return d;
  });
  const [to, setToState] = useState<Date>(() => defaultTo ?? new Date());
  const [label, setLabel] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false), isOpen);

  const clamp = useCallback(
    (d: Date): Date => (clampToLimits ? clampDate(d, minDate, maxDate) : d),
    [clampToLimits, minDate, maxDate],
  );

  const fireChange = useCallback(
    (nf: Date, nt: Date, meta: RangeChangeMeta) => {
      onChange?.({ from: nf, to: nt }, meta);
    },
    [onChange],
  );

  const formattedFrom = useMemo(() => (formatDate ? formatDate(from) : formatDateTime(from)), [from, formatDate]);
  const formattedTo = useMemo(() => (formatDate ? formatDate(to) : formatDateTime(to)), [to, formatDate]);
  const displayLabel = useMemo(() => formatRangeLabel(from, to, label, formatShort), [from, to, label, formatShort]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  const setFrom = useCallback((d: Date) => setFromState(clamp(d)), [clamp]);
  const setTo = useCallback((d: Date) => setToState(clamp(d)), [clamp]);

  const setRange = useCallback(
    (range: TimeRange, lbl?: string | null) => {
      setFromState(clamp(range.from));
      setToState(clamp(range.to));
      setLabel(lbl ?? null);
    },
    [clamp],
  );

  return {
    from, to, setFrom, setTo, setRange,
    isOpen, open, close, toggle,
    displayLabel, formattedFrom, formattedTo,
    containerRef, fireChange, setLabel, clamp,
  };
}
