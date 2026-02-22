import type { ChronoScopeClassNames } from "../../types";

/**
 * Tailwind CSS preset — dark theme.
 *
 * Uses only Tailwind utility classes. Requires Tailwind CSS v3+.
 * All classes are standard utilities — no custom config needed.
 *
 * @example
 * ```tsx
 * import { ChronoScope } from "chronoscope-react";
 * import { tailwindDark } from "chronoscope-react/presets/tailwind";
 *
 * <ChronoScope classNames={tailwindDark} />
 * ```
 */
export const tailwindDark: ChronoScopeClassNames = {
  // Root
  root: "flex items-center gap-2 font-mono text-sm",

  // Toolbar
  toolbar: "flex items-center gap-2 flex-wrap",
  toolbarNavGroup: "flex gap-0.5",
  navButton: "flex items-center justify-center p-2 rounded-md border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-colors cursor-pointer",
  navButtonIcon: "",

  // Trigger
  triggerWrapper: "relative flex-1 min-w-[220px]",
  trigger: "w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 cursor-pointer hover:border-gray-600 transition-all text-sm font-mono",
  triggerOpen: "border-teal-500 bg-gray-800/80 ring-1 ring-teal-500/30",
  triggerIcon: "text-gray-400 shrink-0",
  triggerLabel: "flex-1 text-left truncate",
  triggerChevron: "text-gray-500 shrink-0",

  // Live toggle
  liveButton: "flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 text-xs font-bold uppercase tracking-wider cursor-pointer hover:border-gray-600 transition-all",
  liveButtonActive: "border-green-500/40 bg-green-500/10 text-green-400",
  liveDot: "w-2 h-2 rounded-full bg-gray-600 transition-all",
  liveDotActive: "bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]",

  // Dropdown
  dropdown: "absolute z-50 min-w-[540px] mt-1.5 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden",
  dropdownContent: "max-h-[420px] overflow-y-auto",

  // Tabs
  tabList: "flex border-b border-gray-700 px-1 pt-1",
  tab: "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-gray-400 border-b-2 border-transparent rounded-t-lg cursor-pointer hover:bg-gray-800/50 transition-all",
  tabActive: "text-teal-400 border-teal-400 bg-teal-400/5",
  tabIcon: "",
  tabLabel: "",

  // Quick ranges
  quickPanel: "p-3",
  quickSearch: "w-full px-3 py-2 mb-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 text-sm font-mono placeholder-gray-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30",
  quickList: "flex flex-col gap-px",
  quickItem: "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm text-gray-200 cursor-pointer hover:bg-teal-500/10 transition-colors text-left",
  quickItemActive: "bg-teal-500/15 text-teal-400",
  quickItemLabel: "",
  quickItemDot: "w-1.5 h-1.5 rounded-full bg-teal-400",
  quickEmpty: "py-8 text-center text-gray-500 text-sm",

  // Calendar
  absolutePanel: "p-4",
  calendarRow: "flex gap-2 items-start mb-4",
  calendarDivider: "flex items-center pt-20 text-gray-600",
  calendar: "flex-1 min-w-0",
  calendarLabel: "text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2",
  calendarHeader: "flex items-center justify-between mb-2",
  calendarNavButton: "p-1 rounded text-gray-400 hover:text-gray-200 cursor-pointer bg-transparent border-none",
  calendarTitle: "text-xs font-semibold text-gray-200",
  calendarWeekRow: "grid grid-cols-7 gap-0.5 mb-1",
  calendarWeekDay: "text-center text-[10px] text-gray-500 font-semibold py-1",
  calendarGrid: "grid grid-cols-7 gap-0.5",
  calendarDayEmpty: "aspect-square",
  calendarDay: "aspect-square flex items-center justify-center rounded-md text-xs cursor-pointer hover:bg-teal-500/15 transition-colors border-none font-mono",
  calendarDayToday: "ring-1 ring-teal-500 text-teal-400 font-bold",
  calendarDaySelected: "bg-teal-500 text-white font-bold hover:bg-teal-400",
  calendarDayInRange: "bg-teal-500/10",
  calendarDayDisabled: "opacity-30 cursor-not-allowed hover:bg-transparent",

  // Time input
  timeRow: "flex gap-4 mb-4",
  timeInput: "flex-1 flex items-center gap-2",
  timeInputLabel: "text-[10px] text-gray-500 font-bold uppercase tracking-wide min-w-[36px]",
  timeInputFields: "flex items-center gap-0.5 px-2 py-1 rounded-md border border-gray-700 bg-gray-800",
  timeInputField: "w-7 bg-transparent border-none text-gray-200 text-sm font-mono text-center outline-none",
  timeInputSeparator: "text-gray-500 text-sm",
  timeInputPeriod: "ml-1 px-1 text-teal-400 text-[10px] font-bold cursor-pointer bg-transparent border-none hover:text-teal-300",

  // Absolute footer
  absoluteFooter: "flex items-center justify-between gap-3 flex-wrap",
  absoluteRangeDisplay: "flex items-center gap-1.5 text-xs text-gray-400 flex-wrap",
  absoluteRangeLabel: "font-semibold",
  absoluteRangeValue: "px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-200 font-mono",
  absoluteRangeSeparator: "text-gray-600",
  applyButton: "px-4 py-2 rounded-lg bg-teal-500 text-gray-900 text-xs font-bold cursor-pointer hover:bg-teal-400 transition-colors border-none whitespace-nowrap",

  // Relative
  relativePanel: "p-5",
  relativeDescription: "text-sm text-gray-400 mb-5",
  relativeAccent: "text-teal-400 font-semibold",
  relativeForm: "flex items-center gap-2.5 mb-5",
  relativeFormLabel: "text-sm text-gray-200 font-semibold",
  relativeFormInput: "w-20 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 text-sm font-mono outline-none focus:border-teal-500",
  relativeFormSelect: "px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-200 text-sm font-mono outline-none cursor-pointer focus:border-teal-500",
  relativePreview: "flex items-center gap-2 mb-5 px-3 py-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20",
  relativePreviewLabel: "text-[10px] text-gray-500 font-bold uppercase tracking-wide",
  relativePreviewValue: "text-xs text-teal-400 font-mono",
};

/**
 * Tailwind CSS preset — light theme.
 */
export const tailwindLight: ChronoScopeClassNames = {
  root: "flex items-center gap-2 font-mono text-sm",
  toolbar: "flex items-center gap-2 flex-wrap",
  toolbarNavGroup: "flex gap-0.5",
  navButton: "flex items-center justify-center p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer",
  navButtonIcon: "",
  triggerWrapper: "relative flex-1 min-w-[220px]",
  trigger: "w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 cursor-pointer hover:border-gray-400 transition-all text-sm font-mono",
  triggerOpen: "border-teal-600 ring-1 ring-teal-600/30 bg-teal-50/30",
  triggerIcon: "text-gray-400 shrink-0",
  triggerLabel: "flex-1 text-left truncate",
  triggerChevron: "text-gray-400 shrink-0",
  liveButton: "flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-500 text-xs font-bold uppercase tracking-wider cursor-pointer hover:border-gray-400 transition-all",
  liveButtonActive: "border-green-600/40 bg-green-50 text-green-600",
  liveDot: "w-2 h-2 rounded-full bg-gray-300 transition-all",
  liveDotActive: "bg-green-500 shadow-[0_0_8px_rgba(22,163,74,0.5)]",
  dropdown: "absolute z-50 min-w-[540px] mt-1.5 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden",
  dropdownContent: "max-h-[420px] overflow-y-auto",
  tabList: "flex border-b border-gray-200 px-1 pt-1",
  tab: "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-gray-500 border-b-2 border-transparent rounded-t-lg cursor-pointer hover:bg-gray-50 transition-all",
  tabActive: "text-teal-700 border-teal-600 bg-teal-50/50",
  tabIcon: "",
  tabLabel: "",
  quickPanel: "p-3",
  quickSearch: "w-full px-3 py-2 mb-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 text-sm font-mono placeholder-gray-400 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/30",
  quickList: "flex flex-col gap-px",
  quickItem: "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm text-gray-700 cursor-pointer hover:bg-teal-50 transition-colors text-left",
  quickItemActive: "bg-teal-100/60 text-teal-700",
  quickItemLabel: "",
  quickItemDot: "w-1.5 h-1.5 rounded-full bg-teal-600",
  quickEmpty: "py-8 text-center text-gray-400 text-sm",
  absolutePanel: "p-4",
  calendarRow: "flex gap-2 items-start mb-4",
  calendarDivider: "flex items-center pt-20 text-gray-300",
  calendar: "flex-1 min-w-0",
  calendarLabel: "text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2",
  calendarHeader: "flex items-center justify-between mb-2",
  calendarNavButton: "p-1 rounded text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none",
  calendarTitle: "text-xs font-semibold text-gray-800",
  calendarWeekRow: "grid grid-cols-7 gap-0.5 mb-1",
  calendarWeekDay: "text-center text-[10px] text-gray-400 font-semibold py-1",
  calendarGrid: "grid grid-cols-7 gap-0.5",
  calendarDayEmpty: "aspect-square",
  calendarDay: "aspect-square flex items-center justify-center rounded-md text-xs text-gray-800 cursor-pointer hover:bg-teal-100/50 transition-colors border-none",
  calendarDayToday: "ring-1 ring-teal-600 text-teal-700 font-bold",
  calendarDaySelected: "bg-teal-600 text-white font-bold hover:bg-teal-500",
  calendarDayInRange: "bg-teal-50",
  calendarDayDisabled: "opacity-30 cursor-not-allowed hover:bg-transparent",
  timeRow: "flex gap-4 mb-4",
  timeInput: "flex-1 flex items-center gap-2",
  timeInputLabel: "text-[10px] text-gray-400 font-bold uppercase tracking-wide min-w-[36px]",
  timeInputFields: "flex items-center gap-0.5 px-2 py-1 rounded-md border border-gray-300 bg-gray-50",
  timeInputField: "w-7 bg-transparent border-none text-gray-800 text-sm font-mono text-center outline-none",
  timeInputSeparator: "text-gray-400 text-sm",
  timeInputPeriod: "ml-1 px-1 text-teal-700 text-[10px] font-bold cursor-pointer bg-transparent border-none hover:text-teal-600",
  absoluteFooter: "flex items-center justify-between gap-3 flex-wrap",
  absoluteRangeDisplay: "flex items-center gap-1.5 text-xs text-gray-500 flex-wrap",
  absoluteRangeLabel: "font-semibold",
  absoluteRangeValue: "px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-700 font-mono",
  absoluteRangeSeparator: "text-gray-300",
  applyButton: "px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-bold cursor-pointer hover:bg-teal-500 transition-colors border-none whitespace-nowrap",
  relativePanel: "p-5",
  relativeDescription: "text-sm text-gray-500 mb-5",
  relativeAccent: "text-teal-700 font-semibold",
  relativeForm: "flex items-center gap-2.5 mb-5",
  relativeFormLabel: "text-sm text-gray-700 font-semibold",
  relativeFormInput: "w-20 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-mono outline-none focus:border-teal-600",
  relativeFormSelect: "px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-mono outline-none cursor-pointer focus:border-teal-600",
  relativePreview: "flex items-center gap-2 mb-5 px-3 py-2.5 rounded-lg bg-teal-50 border border-teal-200",
  relativePreviewLabel: "text-[10px] text-gray-400 font-bold uppercase tracking-wide",
  relativePreviewValue: "text-xs text-teal-700 font-mono",
};
