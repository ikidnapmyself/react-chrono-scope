import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRangeState } from "../hooks/useRangeState";
import { useQuickRanges } from "../hooks/useQuickRanges";
import { QuickRangesPanel } from "./QuickRangesPanel";
import { useTheme } from "../../.storybook/themes";
import type { QuickRange } from "../types";

function QuickRangesPanelStory({ ranges, defaultLabel }: { ranges?: QuickRange[]; defaultLabel?: string }) {
  const theme = useTheme();
  const range = useRangeState({ onChange: (r, meta) => console.log("onChange:", meta) });
  const quick = useQuickRanges(range, { ranges, defaultLabel });

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.accent, marginBottom: 12 }}>
        Active: {quick.activeLabel || "none"} | From: {range.formattedFrom} → To: {range.formattedTo}
      </div>
      <QuickRangesPanel quick={quick} classNames={theme.classNames} />
    </div>
  );
}

const meta: Meta<typeof QuickRangesPanel> = {
  title: "Components/QuickRangesPanel",
  component: QuickRangesPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Displays a searchable list of preset time ranges (e.g. \"Last 5 minutes\", \"Last 24 hours\"). Accepts `useQuickRanges` return. Selecting a range updates the shared `useRangeState`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <QuickRangesPanelStory />,
  parameters: { docs: { description: { story: "Default quick ranges with all 15 presets. Type in the search box to filter." } } },
};

export const WithDefaultSelection: Story = {
  render: () => <QuickRangesPanelStory defaultLabel="Last 1 hour" />,
  parameters: { docs: { description: { story: "Pre-selects \"Last 1 hour\" on mount." } } },
};

export const CustomRanges: Story = {
  render: () => (
    <QuickRangesPanelStory
      ranges={[
        { label: "Last 30 seconds", value: 30, unit: "s" },
        { label: "Last 2 minutes", value: 2, unit: "m" },
        { label: "Last 10 minutes", value: 10, unit: "m" },
      ]}
    />
  ),
  parameters: { docs: { description: { story: "Custom ranges array replacing the defaults." } } },
};
