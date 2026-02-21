import type { QuickRange, TimeUnitOption } from "./types";

export const DEFAULT_QUICK_RANGES: QuickRange[] = [
  { label: "Last 5 minutes", value: 5, unit: "m" },
  { label: "Last 15 minutes", value: 15, unit: "m" },
  { label: "Last 30 minutes", value: 30, unit: "m" },
  { label: "Last 1 hour", value: 1, unit: "h" },
  { label: "Last 3 hours", value: 3, unit: "h" },
  { label: "Last 6 hours", value: 6, unit: "h" },
  { label: "Last 12 hours", value: 12, unit: "h" },
  { label: "Last 24 hours", value: 24, unit: "h" },
  { label: "Last 2 days", value: 2, unit: "d" },
  { label: "Last 7 days", value: 7, unit: "d" },
  { label: "Last 30 days", value: 30, unit: "d" },
  { label: "Last 90 days", value: 90, unit: "d" },
  { label: "Last 6 months", value: 6, unit: "M" },
  { label: "Last 1 year", value: 1, unit: "y" },
  { label: "Last 2 years", value: 2, unit: "y" },
];

export const DEFAULT_TIME_UNITS: TimeUnitOption[] = [
  { label: "Seconds", value: "s", shortLabel: "sec" },
  { label: "Minutes", value: "m", shortLabel: "min" },
  { label: "Hours", value: "h", shortLabel: "hr" },
  { label: "Days", value: "d", shortLabel: "day" },
  { label: "Weeks", value: "w", shortLabel: "wk" },
  { label: "Months", value: "M", shortLabel: "mo" },
  { label: "Years", value: "y", shortLabel: "yr" },
];

export const DEFAULT_LIVE_INTERVAL = 5000;

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
