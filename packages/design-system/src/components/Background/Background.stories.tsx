import type { Meta, StoryObj } from "@storybook/react";
import Background from "./Background";

const meta: Meta<typeof Background> = {
  title: "Foundation/Background",
  component: Background,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;
type Story = StoryObj<typeof Background>;

export const Default: Story = {
  render: () => (
    <div className="relative w-full h-[500px]">
      <Background />
      <div className="relative z-10 flex items-center justify-center h-full">
        <p className="text-foreground text-lg">Content over background</p>
      </div>
    </div>
  )
};
