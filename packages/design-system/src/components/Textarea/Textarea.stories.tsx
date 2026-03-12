import type { Meta, StoryObj } from "@storybook/react";
import GlobalTextarea from "./Textarea";

const meta: Meta<typeof GlobalTextarea> = {
  title: "Components/Textarea",
  component: GlobalTextarea,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof GlobalTextarea>;

export const Default: Story = {
  args: {
    placeholder: "Write something...",
    label: "Description"
  }
};

export const WithValue: Story = {
  args: {
    label: "Bio",
    value: "Full-stack developer passionate about building great products."
  }
};

export const Disabled: Story = {
  args: {
    label: "Notes",
    value: "This field is disabled",
    isDisabled: true
  }
};

export const WithDescription: Story = {
  args: {
    label: "Message",
    placeholder: "Type your message...",
    description: "Max 500 characters"
  }
};
