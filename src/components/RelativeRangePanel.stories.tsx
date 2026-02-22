import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRangeState } from "../hooks/useRangeState";
import { useRelativeRange } from "../hooks/useRelativeRange";
import { RelativeRangePanel } from "./RelativeRangePanel";
import { useTheme } from "../../.storybook/themes";

function RelativeRangePanelStory({
  defaultValue,
  defaultUnit,
}: {
  defaultValue?: string;
  defaultUnit?: "s" | "m" | "h" | "d" | "w" | "M" | "y";
}) {
  const theme = useTheme();
  const range = useRangeState({ onChange: (r, meta) => console.log("onChange:", meta) });
  const relative = useRelativeRange(range, { defaultValue, defaultUnit });

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.accent, marginBottom: 12 }}>
        Range: {range.formattedFrom} → {range.formattedTo}
      </div>
      <RelativeRangePanel relative={relative} classNames={theme.classNames} />
    </div>
  );
}

const meta: Meta<typeof RelativeRangePanel> = {
  title: "Components/RelativeRangePanel",
  component: RelativeRangePanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "\"Last N units\" relative time input with a live preview of the computed date. Accepts `useRelativeRange` return. Supports all time units from seconds to years.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <RelativeRangePanelStory />,
  parameters: { docs: { description: { story: "Default 5 minutes. Type a number and select a unit, then click Apply." } } },
};

export const PrefilledHours: Story = {
  render: () => <RelativeRangePanelStory defaultValue="12" defaultUnit="h" />,
  parameters: { docs: { description: { story: "Pre-filled with 12 hours." } } },
};

export const PrefilledDays: Story = {
  render: () => <RelativeRangePanelStory defaultValue="7" defaultUnit="d" />,
  parameters: { docs: { description: { story: "Pre-filled with 7 days." } } },
};
