// ═══════════════════════════════════════════════════════════════════
//  ChronoScope Date/Time Range Picker
//  Composition-first · Design-agnostic · Zero default styles
// ═══════════════════════════════════════════════════════════════════

// ── Composed Hook (full bundle) ──────────────────────────────────
export { useChronoScope } from "./hooks/useChronoScope";

// ── Individual Hooks (standalone) ────────────────────────────────
export { useRangeState } from "./hooks/useRangeState";
export { useQuickRanges } from "./hooks/useQuickRanges";
export { useRelativeRange } from "./hooks/useRelativeRange";
export { useRangeNavigation } from "./hooks/useRangeNavigation";
export { useLiveRefresh } from "./hooks/useLiveRefresh";
export { useCalendar } from "./hooks/useCalendar";
export { useTimeInput } from "./hooks/useTimeInput";
export { useClickOutside } from "./hooks/useClickOutside";

// ── Components ───────────────────────────────────────────────────
export { ChronoScope } from "./components/ChronoScope";
export { QuickRangesPanel } from "./components/QuickRangesPanel";
export { CalendarPanel } from "./components/CalendarPanel";
export { TimeInputPanel } from "./components/TimeInputPanel";
export { RelativeRangePanel } from "./components/RelativeRangePanel";
export { NavigationToolbar } from "./components/NavigationToolbar";
export { LiveToggle } from "./components/LiveToggle";

// ── ClassNames Utilities ────────────────────────────────────────
export { EMPTY_CLASSNAMES, mergeClassNames, resolveClassNames } from "./utils/classnames";

// ── Constants ───────────────────────────────────────────────────
export {
  DEFAULT_QUICK_RANGES, DEFAULT_TIME_UNITS, DEFAULT_LIVE_INTERVAL,
  MONTHS, MONTHS_SHORT, WEEK_DAYS,
} from "./constants";

// ── Date Utilities ──────────────────────────────────────────────
export {
  pad, formatDateTime, formatDateShort, formatRangeLabel,
  applyRelativeTime, getDaysInMonth, getFirstDayOfMonth,
  isSameDay, isDateInRange, clampDate, getRangeDuration,
  shiftRange, scaleRange, buildRelativeLabel, generateTicks, cx,
} from "./utils/date";

// ── All Types ───────────────────────────────────────────────────
export type {
  TimeUnit, TimeRange, QuickRange, SelectionMode, TimeUnitOption,
  RangeChangeMeta,
  UseRangeStateOptions, UseRangeStateReturn,
  UseQuickRangesOptions, UseQuickRangesReturn,
  UseRelativeRangeOptions, UseRelativeRangeReturn,
  UseRangeNavigationReturn,
  UseLiveRefreshOptions, UseLiveRefreshReturn,
  UseChronoScopeOptions, UseChronoScopeReturn,
  UseCalendarOptions, CalendarDay, UseCalendarReturn,
  UseTimeInputOptions, UseTimeInputReturn,
  ChronoScopeClassNames,
  ChronoScopeProps, QuickRangesPanelProps, CalendarPanelProps,
  TimeInputPanelProps, RelativeRangePanelProps,
  NavigationToolbarProps, LiveToggleProps,
} from "./types";
