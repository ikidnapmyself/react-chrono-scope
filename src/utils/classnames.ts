import type { ChronoScopeClassNames } from "../types";

/** The empty classNames map — zero styling, pure semantic HTML */
export const EMPTY_CLASSNAMES: ChronoScopeClassNames = {
  root: "",
  toolbar: "",
  toolbarNavGroup: "",
  navButton: "",
  navButtonIcon: "",
  triggerWrapper: "",
  trigger: "",
  triggerOpen: "",
  triggerIcon: "",
  triggerLabel: "",
  triggerChevron: "",
  liveButton: "",
  liveButtonActive: "",
  liveDot: "",
  liveDotActive: "",
  dropdown: "",
  dropdownContent: "",
  tabList: "",
  tab: "",
  tabActive: "",
  tabIcon: "",
  tabLabel: "",
  quickPanel: "",
  quickSearch: "",
  quickList: "",
  quickItem: "",
  quickItemActive: "",
  quickItemLabel: "",
  quickItemDot: "",
  quickEmpty: "",
  absolutePanel: "",
  calendarRow: "",
  calendarDivider: "",
  calendar: "",
  calendarLabel: "",
  calendarHeader: "",
  calendarNavButton: "",
  calendarTitle: "",
  calendarWeekRow: "",
  calendarWeekDay: "",
  calendarGrid: "",
  calendarDayEmpty: "",
  calendarDay: "",
  calendarDayToday: "",
  calendarDaySelected: "",
  calendarDayInRange: "",
  calendarDayDisabled: "",
  timeRow: "",
  timeInput: "",
  timeInputLabel: "",
  timeInputFields: "",
  timeInputField: "",
  timeInputSeparator: "",
  timeInputPeriod: "",
  absoluteFooter: "",
  absoluteRangeDisplay: "",
  absoluteRangeLabel: "",
  absoluteRangeValue: "",
  absoluteRangeSeparator: "",
  applyButton: "",
  relativePanel: "",
  relativeDescription: "",
  relativeAccent: "",
  relativeForm: "",
  relativeFormLabel: "",
  relativeFormInput: "",
  relativeFormSelect: "",
  relativePreview: "",
  relativePreviewLabel: "",
  relativePreviewValue: "",
};

/**
 * Merges a base classNames map with partial overrides.
 * Each slot's classes are concatenated (not replaced), so you
 * can layer presets: mergeClassNames(tailwindPreset, myOverrides).
 *
 * To replace a slot entirely, prefix the override with "!" and it
 * will replace rather than append.
 */
export function mergeClassNames(
  base: ChronoScopeClassNames,
  ...overrides: (Partial<ChronoScopeClassNames> | undefined)[]
): ChronoScopeClassNames {
  const result = { ...base };
  for (const override of overrides) {
    if (!override) continue;
    for (const _key of Object.keys(override) as (keyof ChronoScopeClassNames)[]) {
      const val = override[_key];
      if (val === undefined) continue;
      if (val.startsWith("!")) {
        // Replace mode: "!my-class" → "my-class"
        result[_key] = val.slice(1);
      } else {
        // Append mode
        result[_key] = result[_key] ? `${result[_key]} ${val}` : val;
      }
    }
  }
  return result;
}

/**
 * Resolves a partial classNames + optional preset into a full map.
 */
export function resolveClassNames(
  preset?: ChronoScopeClassNames,
  overrides?: Partial<ChronoScopeClassNames>,
): ChronoScopeClassNames {
  const base = preset || EMPTY_CLASSNAMES;
  return overrides ? mergeClassNames(base, overrides) : base;
}
