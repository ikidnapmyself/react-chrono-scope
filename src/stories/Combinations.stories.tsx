import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { useRangeState } from "../hooks/useRangeState";
import { useQuickRanges } from "../hooks/useQuickRanges";
import { useRangeNavigation } from "../hooks/useRangeNavigation";
import { useRelativeRange } from "../hooks/useRelativeRange";
import { useCalendar } from "../hooks/useCalendar";
import { useTimeInput } from "../hooks/useTimeInput";
import { QuickRangesPanel } from "../components/QuickRangesPanel";
import { CalendarPanel } from "../components/CalendarPanel";
import { TimeInputPanel } from "../components/TimeInputPanel";
import { RelativeRangePanel } from "../components/RelativeRangePanel";
import { NavigationToolbar } from "../components/NavigationToolbar";
import { useTheme } from "../../.storybook/themes";
import { formatDateShort, formatDateTime } from "../utils/date";

// ── Quick Ranges + Navigation ────────────────────────────────────
function QuickPlusNav() {
  const theme = useTheme();
  const range = useRangeState({ onChange: (r, meta) => console.log(meta) });
  const quick = useQuickRanges(range, { defaultLabel: "Last 6 hours" });
  const nav = useRangeNavigation(range);

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.accent, marginBottom: 12 }}>
        {formatDateShort(range.from)} → {formatDateShort(range.to)}
      </div>
      <NavigationToolbar nav={nav} classNames={theme.classNames} />
      <div style={{ marginTop: 12 }}>
        <QuickRangesPanel quick={quick} classNames={theme.classNames} />
      </div>
    </div>
  );
}

// ── Calendar + Time Input (Absolute Picker) ──────────────────────
function AbsolutePicker() {
  const theme = useTheme();
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 6);
    return d;
  });

  const calFrom = useCalendar({ selected: from, onSelect: setFrom, rangeStart: from, rangeEnd: to });
  const calTo = useCalendar({ selected: to, onSelect: setTo, rangeStart: from, rangeEnd: to });
  const timeFrom = useTimeInput({ value: from, onChange: setFrom });
  const timeTo = useTimeInput({ value: to, onChange: setTo });

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.accent, marginBottom: 12 }}>
        {formatDateTime(from)} → {formatDateTime(to)}
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div>
          <CalendarPanel calendar={calFrom} label="From" classNames={theme.classNames} />
          <div style={{ marginTop: 8 }}>
            <TimeInputPanel time={timeFrom} label="From" classNames={theme.classNames} />
          </div>
        </div>
        <div>
          <CalendarPanel calendar={calTo} label="To" classNames={theme.classNames} />
          <div style={{ marginTop: 8 }}>
            <TimeInputPanel time={timeTo} label="To" classNames={theme.classNames} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Relative + Navigation ────────────────────────────────────────
function RelativePlusNav() {
  const theme = useTheme();
  const range = useRangeState({ onChange: (r, meta) => console.log(meta) });
  const relative = useRelativeRange(range, { defaultValue: "30", defaultUnit: "m" });
  const nav = useRangeNavigation(range);

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.accent, marginBottom: 12 }}>
        {formatDateShort(range.from)} → {formatDateShort(range.to)}
      </div>
      <NavigationToolbar nav={nav} classNames={theme.classNames} />
      <div style={{ marginTop: 12 }}>
        <RelativeRangePanel relative={relative} classNames={theme.classNames} />
      </div>
    </div>
  );
}

// ── All Individual Hooks Together (manual compose) ───────────────
function ManualCompose() {
  const theme = useTheme();
  const range = useRangeState({ onChange: (r, meta) => console.log(meta) });
  const quick = useQuickRanges(range, { defaultLabel: "Last 1 hour" });
  const relative = useRelativeRange(range);
  const nav = useRangeNavigation(range);
  const [tab, setTab] = useState<"quick" | "relative">("quick");

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.accent, marginBottom: 12 }}>
        {formatDateShort(range.from)} → {formatDateShort(range.to)}
      </div>
      <NavigationToolbar nav={nav} classNames={theme.classNames} />
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <button onClick={() => setTab("quick")} style={{
          padding: "4px 12px", fontSize: 11, borderRadius: 4, cursor: "pointer",
          background: tab === "quick" ? theme.accent : theme.surface,
          color: tab === "quick" ? theme.bg : theme.text,
          border: `1px solid ${theme.border}`,
        }}>Quick</button>
        <button onClick={() => setTab("relative")} style={{
          padding: "4px 12px", fontSize: 11, borderRadius: 4, cursor: "pointer",
          background: tab === "relative" ? theme.accent : theme.surface,
          color: tab === "relative" ? theme.bg : theme.text,
          border: `1px solid ${theme.border}`,
        }}>Relative</button>
      </div>
      {tab === "quick" && <QuickRangesPanel quick={quick} classNames={theme.classNames} />}
      {tab === "relative" && <RelativeRangePanel relative={relative} classNames={theme.classNames} />}
    </div>
  );
}

// ── Meta & Stories ───────────────────────────────────────────────

const meta: Meta = {
  title: "Patterns",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Examples of composing individual hooks and components together without using the full `ChronoScope` wrapper. Each story demonstrates a different combination pattern using `useRangeState` as the shared foundation.",
      },
    },
  },
};

export default meta;

export const QuickRangesWithNavigation: StoryObj = {
  render: () => <QuickPlusNav />,
  parameters: { docs: { description: { story: "`useRangeState` + `useQuickRanges` + `useRangeNavigation` — preset selection with shift/zoom controls. Three hooks sharing one range state." } } },
};

export const AbsoluteDateTimePicker: StoryObj = {
  render: () => <AbsolutePicker />,
  parameters: { docs: { description: { story: "Dual `useCalendar` + `useTimeInput` — side-by-side from/to calendars with time inputs. No `useRangeState` needed here; each calendar manages its own date." } } },
};

export const RelativeWithNavigation: StoryObj = {
  render: () => <RelativePlusNav />,
  parameters: { docs: { description: { story: "`useRangeState` + `useRelativeRange` + `useRangeNavigation` — relative time input with navigation arrows." } } },
};

export const ManuallyComposed: StoryObj = {
  render: () => <ManualCompose />,
  parameters: { docs: { description: { story: "All hooks manually composed with custom tab switching. Shows how to build your own UI around the hooks without the `ChronoScope` component." } } },
};
