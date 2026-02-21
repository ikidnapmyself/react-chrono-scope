import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { useTimeInput } from "../hooks/useTimeInput";
import { TimeInputPanel } from "./TimeInputPanel";
import { useTheme } from "../../.storybook/themes";
import { pad } from "../utils/date";

function TimeInputPanelStory({
  label,
  hourFormat = 24,
  showSeconds = true,
}: {
  label?: string;
  hourFormat?: 12 | 24;
  showSeconds?: boolean;
}) {
  const theme = useTheme();
  const [date, setDate] = useState(new Date());
  const time = useTimeInput({ value: date, onChange: setDate, hourFormat });

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.accent, marginBottom: 12 }}>
        Time: {pad(date.getHours())}:{pad(date.getMinutes())}:{pad(date.getSeconds())}
      </div>
      <TimeInputPanel
        time={time}
        label={label}
        classNames={theme.classNames}
        hourFormat={hourFormat}
        showSeconds={showSeconds}
      />
    </div>
  );
}

const meta: Meta<typeof TimeInputPanelStory> = {
  title: "Components/TimeInputPanel",
  component: TimeInputPanelStory,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Time input with hours, minutes, and seconds fields. Accepts `useTimeInput` return. Supports 12-hour (AM/PM) and 24-hour formats, and optional seconds display.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { docs: { description: { story: "24-hour format with seconds." } } },
};

export const WithLabel: Story = {
  args: { label: "From" },
  parameters: { docs: { description: { story: "With a label header to distinguish from/to time inputs." } } },
};

export const TwelveHour: Story = {
  args: { label: "Time", hourFormat: 12 },
  parameters: { docs: { description: { story: "12-hour format with AM/PM toggle button." } } },
};

export const NoSeconds: Story = {
  args: { label: "Time", showSeconds: false },
  parameters: { docs: { description: { story: "Hides the seconds field for simpler time selection." } } },
};
