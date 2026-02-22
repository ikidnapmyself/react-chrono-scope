import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRangeState } from "../hooks/useRangeState";
import { useRangeNavigation } from "../hooks/useRangeNavigation";
import { NavigationToolbar } from "./NavigationToolbar";
import { useTheme } from "../../.storybook/themes";
import { formatDateShort } from "../utils/date";

function NavigationToolbarStory() {
  const theme = useTheme();
  const range = useRangeState({ onChange: (r) => console.log("Range:", r) });
  const nav = useRangeNavigation(range);

  return (
    <div>
      <div style={{ fontSize: 11, color: theme.accent, marginBottom: 12 }}>
        {formatDateShort(range.from)} → {formatDateShort(range.to)}
      </div>
      <NavigationToolbar nav={nav} classNames={theme.classNames} />
    </div>
  );
}

const meta: Meta<typeof NavigationToolbar> = {
  title: "Components/NavigationToolbar",
  component: NavigationToolbar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Navigation arrows for shifting the range back/forward and zooming in/out. Accepts `useRangeNavigation` return. Shift moves by half the range duration; zoom scales by 2x centered on the midpoint.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <NavigationToolbarStory />,
};
