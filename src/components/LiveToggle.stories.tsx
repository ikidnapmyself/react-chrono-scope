import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRangeState } from "../hooks/useRangeState";
import { useLiveRefresh } from "../hooks/useLiveRefresh";
import { LiveToggle } from "./LiveToggle";
import { useTheme } from "../../.storybook/themes";

function LiveToggleStory() {
  const theme = useTheme();
  const range = useRangeState();
  const live = useLiveRefresh(range, { onToggle: (v) => console.log("Live:", v) });

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.accent, marginBottom: 12 }}>
        Status: {live.isLive ? "LIVE" : "Paused"}
      </div>
      <LiveToggle live={live} classNames={theme.classNames} />
    </div>
  );
}

const meta: Meta<typeof LiveToggle> = {
  title: "Components/LiveToggle",
  component: LiveToggle,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Toggle button for live/auto-refresh mode. Accepts `useLiveRefresh` return. When active, the range refreshes on a configurable interval (default 5s).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <LiveToggleStory />,
};
