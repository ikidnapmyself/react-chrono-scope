import type { TimeUnit, TimeRange } from "../types";
import { MONTHS_SHORT, DEFAULT_TIME_UNITS } from "../constants";

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatDateTime(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function formatDateShort(d: Date): string {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatRangeLabel(
  from: Date,
  to: Date,
  quickLabel: string | null,
  formatShort?: (d: Date) => string,
): string {
  if (quickLabel) return quickLabel;
  const fmt = formatShort || formatDateShort;
  return `${fmt(from)} → ${fmt(to)}`;
}

export function applyRelativeTime(value: number, unit: TimeUnit): Date {
  const d = new Date();
  switch (unit) {
    case "s": d.setSeconds(d.getSeconds() - value); break;
    case "m": d.setMinutes(d.getMinutes() - value); break;
    case "h": d.setHours(d.getHours() - value); break;
    case "d": d.setDate(d.getDate() - value); break;
    case "w": d.setDate(d.getDate() - value * 7); break;
    case "M": d.setMonth(d.getMonth() - value); break;
    case "y": d.setFullYear(d.getFullYear() - value); break;
  }
  return d;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  const s = new Date(start); s.setHours(0, 0, 0, 0);
  const e = new Date(end); e.setHours(0, 0, 0, 0);
  return d >= s && d <= e;
}

export function clampDate(d: Date, min?: Date, max?: Date): Date {
  let t = d.getTime();
  if (min && t < min.getTime()) t = min.getTime();
  if (max && t > max.getTime()) t = max.getTime();
  return new Date(t);
}

export function getRangeDuration(range: TimeRange): number {
  return range.to.getTime() - range.from.getTime();
}

export function shiftRange(range: TimeRange, ms: number): TimeRange {
  return {
    from: new Date(range.from.getTime() + ms),
    to: new Date(range.to.getTime() + ms),
  };
}

export function scaleRange(range: TimeRange, factor: number): TimeRange {
  const mid = (range.from.getTime() + range.to.getTime()) / 2;
  const half = getRangeDuration(range) * factor / 2;
  return {
    from: new Date(mid - half),
    to: new Date(mid + half),
  };
}

export function buildRelativeLabel(value: number, unit: TimeUnit): string {
  const unitInfo = DEFAULT_TIME_UNITS.find(u => u.value === unit);
  const name = unitInfo ? unitInfo.label.toLowerCase() : unit;
  return `Last ${value} ${name}`;
}

export function generateTicks(from: Date, to: Date, count: number): Date[] {
  const diff = to.getTime() - from.getTime();
  const ticks: Date[] = [];
  for (let i = 0; i < count; i++) {
    ticks.push(new Date(from.getTime() + (diff / (count - 1)) * i));
  }
  return ticks;
}

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
