import type { Meta, StoryObj } from "@storybook/react";
import PrimaryActionButton from "./PrimaryActionButton";

const meta: Meta<typeof PrimaryActionButton> = {
  title: "Components/PrimaryActionButton",
  component: PrimaryActionButton,
  tags: ["autodocs"],
  argTypes: {
    isDisabled: { control: "boolean" },
    isLoading: { control: "boolean" }
  }
};

export default meta;
type Story = StoryObj<typeof PrimaryActionButton>;

export const Default: Story = {
  args: {
    children: "Save changes"
  }
};

export const Loading: Story = {
  args: {
    children: "Saving...",
    isLoading: true
  }
};

export const Disabled: Story = {
  args: {
    children: "Save changes",
    isDisabled: true
  }
};

export const WithIcon: Story = {
  render: () => (
    <PrimaryActionButton>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Create new
    </PrimaryActionButton>
  )
};
