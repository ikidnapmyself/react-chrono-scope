import React from "react";
import type { ChronoScopeProps, SelectionMode } from "../types";
import { useCalendar } from "../hooks/useCalendar";
import { useTimeInput } from "../hooks/useTimeInput";
import { resolveClassNames } from "../utils/classnames";
import { cx } from "../utils/date";
import { QuickRangesPanel } from "./QuickRangesPanel";
import { CalendarPanel } from "./CalendarPanel";
import { TimeInputPanel } from "./TimeInputPanel";
import { RelativeRangePanel } from "./RelativeRangePanel";
import { NavigationToolbar } from "./NavigationToolbar";
import { LiveToggle } from "./LiveToggle";

export const ChronoScope: React.FC<ChronoScopeProps> = ({
  cs,
  classNames: classNamesOverride,
  className,
  style,
  showToolbar = true,
  showLiveToggle = true,
  tabs: enabledTabs = ["quick", "absolute", "relative"],
  tabLabels,
  hourFormat = 24,
  showSeconds = true,
  weekStartsOn = 0,
  renderTrigger,
  renderQuickItem,
  renderDay,
  renderToolbar,
  renderLiveToggle,
  children,
}) => {
  const cn = resolveClassNames(undefined, classNamesOverride);

  // Headless render-prop mode
  if (children) return <>{children(cs, cn)}</>;

  // Calendar hooks for from/to
  const calFrom = useCalendar({
    selected: cs.range.from,
    onSelect: cs.range.setFrom,
    rangeStart: cs.range.from,
    rangeEnd: cs.range.to,
    weekStartsOn,
  });
  const calTo = useCalendar({
    selected: cs.range.to,
    onSelect: cs.range.setTo,
    rangeStart: cs.range.from,
    rangeEnd: cs.range.to,
    weekStartsOn,
  });

  // Time hooks for from/to
  const timeFrom = useTimeInput({ value: cs.range.from, onChange: cs.range.setFrom, hourFormat });
  const timeTo = useTimeInput({ value: cs.range.to, onChange: cs.range.setTo, hourFormat });

  const allTabs = ([
    { key: "quick" as const, label: tabLabels?.quick || "Quick ranges" },
    { key: "absolute" as const, label: tabLabels?.absolute || "Absolute" },
    { key: "relative" as const, label: tabLabels?.relative || "Relative" },
  ]).filter(t => enabledTabs.includes(t.key));

  // Auto-correct mode when current mode isn't in the enabled tabs
  const effectiveMode = enabledTabs.includes(cs.mode) ? cs.mode : allTabs[0]?.key ?? "quick";

  return (
    <div data-cs="root" className={cx(cn.root, className)} style={style}>
      {/* ── Toolbar ─────────────────────────────────────────── */}
      {showToolbar && (
        renderToolbar ? renderToolbar(cs, cn) : (
          <NavigationToolbar nav={cs.nav} classNames={classNamesOverride} />
        )
      )}

      {/* ── Trigger + Dropdown ──────────────────────────────── */}
      <div
        ref={cs.range.containerRef as React.RefObject<HTMLDivElement>}
        data-cs="trigger-wrapper"
        className={cn.triggerWrapper}
      >
        {renderTrigger ? renderTrigger(cs, cn) : (
          <button
            type="button"
            data-cs="trigger"
            data-open={cs.range.isOpen || undefined}
            className={cx(cn.trigger, cs.range.isOpen && cn.triggerOpen)}
            onClick={cs.range.toggle}
            aria-expanded={cs.range.isOpen}
            aria-haspopup="dialog"
          >
            <span data-cs="trigger-icon" className={cn.triggerIcon}>⏱</span>
            <span data-cs="trigger-label" className={cn.triggerLabel}>{cs.range.displayLabel}</span>
            <span data-cs="trigger-chevron" className={cn.triggerChevron}>▾</span>
          </button>
        )}

        {/* ── Dropdown ─────────────────────────────────────── */}
        {cs.range.isOpen && (
          <div
            data-cs="dropdown"
            className={cn.dropdown}
            role="dialog"
            aria-label="Date time range picker"
          >
            {/* Tabs */}
            {allTabs.length > 1 && (
              <div data-cs="tab-list" className={cn.tabList} role="tablist">
                {allTabs.map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    data-cs="tab"
                    data-active={cs.mode === tab.key || undefined}
                    aria-selected={effectiveMode === tab.key}
                    className={cx(cn.tab, effectiveMode === tab.key && cn.tabActive)}
                    onClick={() => cs.setMode(tab.key)}
                  >
                    <span data-cs="tab-label" className={cn.tabLabel}>{tab.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Tab content */}
            <div data-cs="dropdown-content" className={cn.dropdownContent}>
              {effectiveMode === "quick" && enabledTabs.includes("quick") && (
                <QuickRangesPanel
                  quick={cs.quick}
                  classNames={classNamesOverride}
                  renderItem={renderQuickItem}
                />
              )}

              {effectiveMode === "absolute" && enabledTabs.includes("absolute") && (
                <div data-cs="absolute-panel" className={cn.absolutePanel}>
                  <div data-cs="calendar-row" className={cn.calendarRow}>
                    <CalendarPanel
                      calendar={calFrom}
                      label="From"
                      classNames={classNamesOverride}
                      renderDay={renderDay}
                    />
                    <div data-cs="calendar-divider" className={cn.calendarDivider}>→</div>
                    <CalendarPanel
                      calendar={calTo}
                      label="To"
                      classNames={classNamesOverride}
                      renderDay={renderDay}
                    />
                  </div>
                  <div data-cs="time-row" className={cn.timeRow}>
                    <TimeInputPanel time={timeFrom} label="From" classNames={classNamesOverride} hourFormat={hourFormat} showSeconds={showSeconds} />
                    <TimeInputPanel time={timeTo} label="To" classNames={classNamesOverride} hourFormat={hourFormat} showSeconds={showSeconds} />
                  </div>
                  <div data-cs="absolute-footer" className={cn.absoluteFooter}>
                    <div data-cs="absolute-range" className={cn.absoluteRangeDisplay}>
                      <span className={cn.absoluteRangeLabel}>Range:</span>
                      <code className={cn.absoluteRangeValue}>{cs.range.formattedFrom}</code>
                      <span className={cn.absoluteRangeSeparator}>to</span>
                      <code className={cn.absoluteRangeValue}>{cs.range.formattedTo}</code>
                    </div>
                    <button
                      type="button"
                      data-cs="apply"
                      className={cn.applyButton}
                      onClick={() => {
                        cs.range.close();
                        cs.range.fireChange(cs.range.from, cs.range.to, { source: "absolute" });
                      }}
                    >
                      Apply time range
                    </button>
                  </div>
                </div>
              )}

              {effectiveMode === "relative" && enabledTabs.includes("relative") && (
                <RelativeRangePanel
                  relative={cs.relative}
                  classNames={classNamesOverride}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Live Toggle ─────────────────────────────────────── */}
      {showLiveToggle && (
        renderLiveToggle ? renderLiveToggle(cs, cn) : (
          <LiveToggle live={cs.live} classNames={classNamesOverride} />
        )
      )}
    </div>
  );
};
