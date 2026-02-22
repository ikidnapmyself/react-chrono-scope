import { useState } from "react";
import type { Decorator } from "@storybook/react-vite";
import { useChronoScope } from "../hooks/useChronoScope";
import { ChronoScope } from "../components/ChronoScope";
import { THEME_MAP, ThemeContext, useTheme } from "../../.storybook/themes";
import { formatDateTime, formatDateShort, pad, generateTicks } from "../utils/date";
import type { TimeRange, RangeChangeMeta, SelectionMode } from "../types";

interface EventEntry {
  source: string;
  label: string | null | undefined;
  from: Date;
  to: Date;
}

export function PresetDemo({
  tabs,
  showToolbar = true,
  showLiveToggle = true,
  hourFormat = 24,
  showSeconds = true,
  weekStartsOn = 0,
}: {
  tabs?: SelectionMode[];
  showToolbar?: boolean;
  showLiveToggle?: boolean;
  hourFormat?: 12 | 24;
  showSeconds?: boolean;
  weekStartsOn?: number;
}) {
  const theme = useTheme();
  const [events, setEvents] = useState<EventEntry[]>([]);

  const cs = useChronoScope({
    defaultQuickLabel: "Last 6 hours",
    onChange: (range: TimeRange, meta: RangeChangeMeta) => {
      setEvents(prev => [
        ...prev.slice(-9),
        { source: meta.source, label: meta.quickLabel, from: range.from, to: range.to },
      ]);
    },
  });

  const ticks = generateTicks(cs.range.from, cs.range.to, 5);

  return (
    <div>
      <ChronoScope
        cs={cs}
        classNames={theme.classNames}
        tabs={tabs}
        showToolbar={showToolbar}
        showLiveToggle={showLiveToggle}
        hourFormat={hourFormat}
        showSeconds={showSeconds}
        weekStartsOn={weekStartsOn}
      />

      <div style={{ display: "flex", gap: 12, marginTop: 16, fontSize: 11 }}>
        <div style={{ flex: 1, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: "8px 12px" }}>
          <div style={{ fontSize: 9, color: theme.textMuted, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>FROM</div>
          <div style={{ color: theme.accent }}>{formatDateTime(cs.range.from)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", color: theme.textMuted }}>→</div>
        <div style={{ flex: 1, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: "8px 12px" }}>
          <div style={{ fontSize: 9, color: theme.textMuted, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>TO</div>
          <div style={{ color: theme.accent }}>{formatDateTime(cs.range.to)}</div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ height: 3, background: `${theme.text}0A`, borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
          <div style={{ height: "100%", width: "100%", background: `linear-gradient(90deg, transparent, ${theme.accent}44, ${theme.accent}, ${theme.accent}44, transparent)` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {ticks.map((tick, i) => (
            <span key={i} style={{ fontSize: 9, color: theme.textMuted }}>{pad(tick.getHours())}:{pad(tick.getMinutes())}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, overflow: "hidden" }}>
        <div style={{ padding: "6px 10px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>onChange Events</span>
          <span style={{ fontSize: 9, color: theme.textMuted }}>{events.length}</span>
        </div>
        <div style={{ maxHeight: 80, overflowY: "auto", padding: 4 }}>
          {events.length === 0 && <div style={{ padding: 8, textAlign: "center", color: theme.textMuted, fontSize: 10 }}>Select a range to see events</div>}
          {events.slice().reverse().map((ev, i) => (
            <div key={i} style={{ padding: "3px 6px", fontSize: 10, color: theme.textDim, display: "flex", gap: 8 }}>
              <span style={{ color: theme.accent, fontWeight: 700, minWidth: 44 }}>{ev.source}</span>
              <code style={{ color: theme.text, fontSize: 10 }}>{ev.label || `${formatDateShort(ev.from)} → ${formatDateShort(ev.to)}`}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function presetDecorator(themeKey: string): Decorator {
  return (Story) => {
    const theme = THEME_MAP[themeKey];
    return (
      <ThemeContext.Provider value={theme}>
        <div style={{ minHeight: "100%", padding: 24, background: theme.bg, color: theme.text, fontFamily: theme.font, transition: "all 0.3s" }}>
          <Story />
        </div>
      </ThemeContext.Provider>
    );
  };
}
