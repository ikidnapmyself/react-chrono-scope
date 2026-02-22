import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChronoScope } from "../components/ChronoScope";
import { PresetDemo, presetDecorator } from "./_presetHelpers";

const meta: Meta<typeof ChronoScope> = {
  title: "Presets/Unstyled",
  component: ChronoScope,
  decorators: [presetDecorator("unstyled")],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "ChronoScope with the minimal unstyled preset. Semantic HTML with basic layout classes only.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PresetDemo />,
};

export const QuickOnly: Story = {
  render: () => <PresetDemo tabs={["quick"]} showToolbar={false} showLiveToggle={false} />,
};

export const AbsoluteOnly: Story = {
  render: () => <PresetDemo tabs={["absolute"]} />,
};

export const TwelveHourFormat: Story = {
  render: () => <PresetDemo hourFormat={12} tabs={["absolute"]} />,
};

export const NoToolbar: Story = {
  render: () => <PresetDemo showToolbar={false} />,
};

export const MondayStart: Story = {
  render: () => <PresetDemo weekStartsOn={1} />,
};
