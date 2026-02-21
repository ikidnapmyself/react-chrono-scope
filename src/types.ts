import type { RefObject, ReactNode, CSSProperties } from "react";

// ═══════════════════════════════════════════════════════════════════
// CORE DATA TYPES
// ═══════════════════════════════════════════════════════════════════

export type TimeUnit = "s" | "m" | "h" | "d" | "w" | "M" | "y";

export interface TimeRange {
  from: Date;
  to: Date;
}

export interface QuickRange {
  label: string;
  value: number;
  unit: TimeUnit;
  group?: string;
}

export type SelectionMode = "quick" | "absolute" | "relative";

export interface TimeUnitOption {
  label: string;
  value: TimeUnit;
  shortLabel: string;
}

export interface RangeChangeMeta {
  source: "quick" | "absolute" | "relative" | "shift" | "zoom" | "live";
  quickLabel?: string | null;
  relativeExpression?: string;
}

// ═══════════════════════════════════════════════════════════════════
// HOOK OPTION / RETURN TYPES
// ═══════════════════════════════════════════════════════════════════

// ── useRangeState ────────────────────────────────────────────────

export interface UseRangeStateOptions {
  defaultFrom?: Date;
  defaultTo?: Date;
  onChange?: (range: TimeRange, meta: RangeChangeMeta) => void;
  minDate?: Date;
  maxDate?: Date;
  clampToLimits?: boolean;
  formatDate?: (date: Date) => string;
  formatDateShort?: (date: Date) => string;
}

export interface UseRangeStateReturn {
  from: Date;
  to: Date;
  setFrom: (date: Date) => void;
  setTo: (date: Date) => void;
  setRange: (range: TimeRange, label?: string | null) => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  displayLabel: string;
  formattedFrom: string;
  formattedTo: string;
  containerRef: RefObject<HTMLDivElement | null>;
  /** Internal — used by feature hooks to fire onChange with meta */
  fireChange: (from: Date, to: Date, meta: RangeChangeMeta) => void;
  /** Internal — used by feature hooks to update label for display */
  setLabel: (label: string | null) => void;
  /** Internal — clamp a date within min/max bounds */
  clamp: (date: Date) => Date;
}

// ── useQuickRanges ───────────────────────────────────────────────

export interface UseQuickRangesOptions {
  ranges?: QuickRange[];
  defaultLabel?: string;
}

export interface UseQuickRangesReturn {
  ranges: QuickRange[];
  activeLabel: string | null;
  filter: string;
  setFilter: (value: string) => void;
  filteredRanges: QuickRange[];
  select: (range: QuickRange) => void;
}

// ── useRelativeRange ─────────────────────────────────────────────

export interface UseRelativeRangeOptions {
  timeUnits?: TimeUnitOption[];
  defaultValue?: string;
  defaultUnit?: TimeUnit;
}

export interface UseRelativeRangeReturn {
  value: string;
  unit: TimeUnit;
  timeUnits: TimeUnitOption[];
  setValue: (value: string) => void;
  setUnit: (unit: TimeUnit) => void;
  apply: () => void;
  preview: Date;
}

// ── useRangeNavigation ───────────────────────────────────────────

export interface UseRangeNavigationReturn {
  shiftBack: () => void;
  shiftForward: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

// ── useLiveRefresh ───────────────────────────────────────────────

export interface UseLiveRefreshOptions {
  interval?: number;
  onToggle?: (isLive: boolean) => void;
  refreshFn?: () => TimeRange;
}

export interface UseLiveRefreshReturn {
  isLive: boolean;
  toggle: () => void;
  setLive: (live: boolean) => void;
}

// ── useCalendar (unchanged) ──────────────────────────────────────

export interface UseCalendarOptions {
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  weekStartsOn?: number;
}

export interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isDisabled: boolean;
}

export interface UseCalendarReturn {
  viewYear: number;
  viewMonth: number;
  monthName: string;
  days: CalendarDay[];
  weekDays: string[];
  prevMonth: () => void;
  nextMonth: () => void;
  goToMonth: (year: number, month: number) => void;
  selectDay: (day: number) => void;
}

// ── useTimeInput (unchanged) ─────────────────────────────────────

export interface UseTimeInputOptions {
  value?: Date | null;
  onChange?: (date: Date) => void;
  hourFormat?: 12 | 24;
  secondStep?: number;
  showSeconds?: boolean;
}

export interface UseTimeInputReturn {
  hours: string;
  minutes: string;
  seconds: string;
  period: "AM" | "PM";
  setHours: (value: string) => void;
  setMinutes: (value: string) => void;
  setSeconds: (value: string) => void;
  setPeriod: (period: "AM" | "PM") => void;
  incrementHours: () => void;
  decrementHours: () => void;
  incrementMinutes: () => void;
  decrementMinutes: () => void;
  incrementSeconds: () => void;
  decrementSeconds: () => void;
}

// ── useChronoScope (composed) ────────────────────────────────────

export interface UseChronoScopeOptions extends UseRangeStateOptions {
  quickRanges?: QuickRange[];
  defaultQuickLabel?: string;
  timeUnits?: TimeUnitOption[];
  liveInterval?: number;
  onLiveToggle?: (isLive: boolean) => void;
}

export interface UseChronoScopeReturn {
  range: UseRangeStateReturn;
  quick: UseQuickRangesReturn;
  relative: UseRelativeRangeReturn;
  nav: UseRangeNavigationReturn;
  live: UseLiveRefreshReturn;
  mode: SelectionMode;
  setMode: (mode: SelectionMode) => void;
}

// ═══════════════════════════════════════════════════════════════════
// CLASSNAMES MAP
// ═══════════════════════════════════════════════════════════════════

export interface ChronoScopeClassNames {
  // ── Root ─────────────────────────────────────────────────────
  root: string;

  // ── Toolbar / Navigation ─────────────────────────────────────
  toolbar: string;
  toolbarNavGroup: string;
  navButton: string;
  navButtonIcon: string;

  // ── Trigger ──────────────────────────────────────────────────
  triggerWrapper: string;
  trigger: string;
  triggerOpen: string;
  triggerIcon: string;
  triggerLabel: string;
  triggerChevron: string;

  // ── Live Toggle ──────────────────────────────────────────────
  liveButton: string;
  liveButtonActive: string;
  liveDot: string;
  liveDotActive: string;

  // ── Dropdown ─────────────────────────────────────────────────
  dropdown: string;
  dropdownContent: string;

  // ── Tabs ─────────────────────────────────────────────────────
  tabList: string;
  tab: string;
  tabActive: string;
  tabIcon: string;
  tabLabel: string;

  // ── Quick Ranges ─────────────────────────────────────────────
  quickPanel: string;
  quickSearch: string;
  quickList: string;
  quickItem: string;
  quickItemActive: string;
  quickItemLabel: string;
  quickItemDot: string;
  quickEmpty: string;

  // ── Calendar ─────────────────────────────────────────────────
  absolutePanel: string;
  calendarRow: string;
  calendarDivider: string;
  calendar: string;
  calendarLabel: string;
  calendarHeader: string;
  calendarNavButton: string;
  calendarTitle: string;
  calendarWeekRow: string;
  calendarWeekDay: string;
  calendarGrid: string;
  calendarDayEmpty: string;
  calendarDay: string;
  calendarDayToday: string;
  calendarDaySelected: string;
  calendarDayInRange: string;
  calendarDayDisabled: string;

  // ── Time Input ───────────────────────────────────────────────
  timeRow: string;
  timeInput: string;
  timeInputLabel: string;
  timeInputFields: string;
  timeInputField: string;
  timeInputSeparator: string;
  timeInputPeriod: string;

  // ── Absolute Footer ──────────────────────────────────────────
  absoluteFooter: string;
  absoluteRangeDisplay: string;
  absoluteRangeLabel: string;
  absoluteRangeValue: string;
  absoluteRangeSeparator: string;
  applyButton: string;

  // ── Relative ─────────────────────────────────────────────────
  relativePanel: string;
  relativeDescription: string;
  relativeAccent: string;
  relativeForm: string;
  relativeFormLabel: string;
  relativeFormInput: string;
  relativeFormSelect: string;
  relativePreview: string;
  relativePreviewLabel: string;
  relativePreviewValue: string;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT PROPS
// ═══════════════════════════════════════════════════════════════════

export interface QuickRangesPanelProps {
  quick: UseQuickRangesReturn;
  classNames?: Partial<ChronoScopeClassNames>;
  renderItem?: (range: QuickRange, isActive: boolean, onSelect: () => void, cn: ChronoScopeClassNames) => ReactNode;
}

export interface CalendarPanelProps {
  calendar: UseCalendarReturn;
  label?: string;
  classNames?: Partial<ChronoScopeClassNames>;
  renderDay?: (day: CalendarDay, onSelect: () => void, cn: ChronoScopeClassNames) => ReactNode;
}

export interface TimeInputPanelProps {
  time: UseTimeInputReturn;
  label?: string;
  classNames?: Partial<ChronoScopeClassNames>;
  hourFormat?: 12 | 24;
  showSeconds?: boolean;
}

export interface RelativeRangePanelProps {
  relative: UseRelativeRangeReturn;
  classNames?: Partial<ChronoScopeClassNames>;
  formatDate?: (date: Date) => string;
}

export interface NavigationToolbarProps {
  nav: UseRangeNavigationReturn;
  classNames?: Partial<ChronoScopeClassNames>;
}

export interface LiveToggleProps {
  live: UseLiveRefreshReturn;
  classNames?: Partial<ChronoScopeClassNames>;
}

export interface ChronoScopeProps {
  cs: UseChronoScopeReturn;
  classNames?: Partial<ChronoScopeClassNames>;
  className?: string;
  style?: CSSProperties;
  showToolbar?: boolean;
  showLiveToggle?: boolean;
  tabs?: SelectionMode[];
  tabLabels?: { quick?: string; absolute?: string; relative?: string };
  hourFormat?: 12 | 24;
  showSeconds?: boolean;
  weekStartsOn?: number;
  renderTrigger?: (cs: UseChronoScopeReturn, cn: ChronoScopeClassNames) => ReactNode;
  renderQuickItem?: (range: QuickRange, isActive: boolean, onSelect: () => void, cn: ChronoScopeClassNames) => ReactNode;
  renderDay?: (day: CalendarDay, onSelect: () => void, cn: ChronoScopeClassNames) => ReactNode;
  renderToolbar?: (cs: UseChronoScopeReturn, cn: ChronoScopeClassNames) => ReactNode;
  renderLiveToggle?: (cs: UseChronoScopeReturn, cn: ChronoScopeClassNames) => ReactNode;
  children?: (cs: UseChronoScopeReturn, cn: ChronoScopeClassNames) => ReactNode;
}
