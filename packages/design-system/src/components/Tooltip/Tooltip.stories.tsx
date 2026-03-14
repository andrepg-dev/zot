import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@heroui/button";
import GlobalTooltip from "./Tooltip";

const meta: Meta<typeof GlobalTooltip> = {
  title: "Components/Tooltip",
  component: GlobalTooltip,
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"]
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger", "foreground"]
    }
  }
};

export default meta;
type Story = StoryObj<typeof GlobalTooltip>;

export const Default: Story = {
  args: {
    content: "Tooltip content",
    children: <Button size="sm">Hover me</Button>
  }
};

export const Placements: Story = {
  render: () => (
    <div className="flex gap-6 p-12">
      <GlobalTooltip content="Top" placement="top">
        <Button size="sm">Top</Button>
      </GlobalTooltip>
      <GlobalTooltip content="Bottom" placement="bottom">
        <Button size="sm">Bottom</Button>
      </GlobalTooltip>
      <GlobalTooltip content="Left" placement="left">
        <Button size="sm">Left</Button>
      </GlobalTooltip>
      <GlobalTooltip content="Right" placement="right">
        <Button size="sm">Right</Button>
      </GlobalTooltip>
    </div>
  )
};

export const Colors: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      <GlobalTooltip content="Default" color="default">
        <Button size="sm">Default</Button>
      </GlobalTooltip>
      <GlobalTooltip content="Primary" color="primary">
        <Button size="sm" color="primary">Primary</Button>
      </GlobalTooltip>
      <GlobalTooltip content="Foreground" color="foreground">
        <Button size="sm">Foreground</Button>
      </GlobalTooltip>
    </div>
  )
};
