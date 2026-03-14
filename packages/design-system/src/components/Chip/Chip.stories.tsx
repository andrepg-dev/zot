import type { Meta, StoryObj } from "@storybook/react";
import Chip from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["active", "warning", "neutral", "danger", "primary"]
    }
  }
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Active: Story = {
  args: {
    status: "active"
  }
};

export const Warning: Story = {
  args: {
    status: "warning"
  }
};

export const Neutral: Story = {
  args: {
    status: "neutral"
  }
};

export const Danger: Story = {
  args: {
    status: "danger"
  }
};

export const Primary: Story = {
  args: {
    status: "primary"
  }
};

export const CustomLabel: Story = {
  args: {
    status: "active",
    children: "Published"
  }
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Chip status="active">Active</Chip>
      <Chip status="warning">Pending</Chip>
      <Chip status="neutral">Draft</Chip>
      <Chip status="danger">Error</Chip>
      <Chip status="primary">New</Chip>
    </div>
  )
};
