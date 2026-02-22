import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { useCalendar } from "../hooks/useCalendar";
import { CalendarPanel } from "./CalendarPanel";
import { useTheme } from "../../.storybook/themes";
import { formatDateTime } from "../utils/date";

function CalendarPanelStory({
  label,
  weekStartsOn = 0,
  showRange = false,
}: {
  label?: string;
  weekStartsOn?: number;
  showRange?: boolean;
}) {
  const theme = useTheme();
  const [date, setDate] = useState(new Date());
  const [rangeEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d;
  });

  const cal = useCalendar({
    selected: date,
    onSelect: setDate,
    rangeStart: showRange ? date : undefined,
    rangeEnd: showRange ? rangeEnd : undefined,
    weekStartsOn,
  });

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.accent, marginBottom: 12 }}>
        Selected: {formatDateTime(date)}
      </div>
      <CalendarPanel calendar={cal} label={label} classNames={theme.classNames} />
    </div>
  );
}

const meta: Meta<typeof CalendarPanel> = {
  title: "Components/CalendarPanel",
  component: CalendarPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Calendar grid for date selection. Accepts `useCalendar` return. Supports range highlighting, min/max bounds, and configurable week start day.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <CalendarPanelStory />,
  parameters: { docs: { description: { story: "Basic calendar with today highlighted and click-to-select." } } },
};

export const WithLabel: Story = {
  render: () => <CalendarPanelStory label="From" />,
  parameters: { docs: { description: { story: "Calendar with a label header, useful when showing side-by-side from/to calendars." } } },
};

export const MondayStart: Story = {
  render: () => <CalendarPanelStory label="Calendar" weekStartsOn={1} />,
  parameters: { docs: { description: { story: "Week starts on Monday. Pass `weekStartsOn: 1` to the `useCalendar` hook." } } },
};

export const WithRangeHighlight: Story = {
  render: () => <CalendarPanelStory label="Range" showRange />,
  parameters: { docs: { description: { story: "Days between `rangeStart` and `rangeEnd` are highlighted with the `calendarDayInRange` class." } } },
};
