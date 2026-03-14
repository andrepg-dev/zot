import type { Meta, StoryObj } from "@storybook/react";
import GlobalButton from "./Button";

const meta: Meta<typeof GlobalButton> = {
  title: "Components/Button",
  component: GlobalButton,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"]
    },
    variant: {
      control: "select",
      options: ["solid", "bordered", "light", "flat", "faded", "shadow", "ghost"]
    },
    isDisabled: { control: "boolean" },
    isLoading: { control: "boolean" }
  }
};

export default meta;
type Story = StoryObj<typeof GlobalButton>;

export const Default: Story = {
  args: {
    children: "Button"
  }
};

export const Primary: Story = {
  args: {
    children: "Primary",
    color: "primary"
  }
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    color: "secondary"
  }
};

export const Danger: Story = {
  args: {
    children: "Delete",
    color: "danger"
  }
};

export const Bordered: Story = {
  args: {
    children: "Bordered",
    variant: "bordered"
  }
};

export const Light: Story = {
  args: {
    children: "Light",
    variant: "light"
  }
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    isLoading: true
  }
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    isDisabled: true
  }
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <GlobalButton color="default">Default</GlobalButton>
      <GlobalButton color="primary">Primary</GlobalButton>
      <GlobalButton color="secondary">Secondary</GlobalButton>
      <GlobalButton color="success">Success</GlobalButton>
      <GlobalButton color="warning">Warning</GlobalButton>
      <GlobalButton color="danger">Danger</GlobalButton>
    </div>
  )
};

export const AllStyles: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <GlobalButton variant="solid" color="primary">Solid</GlobalButton>
      <GlobalButton variant="bordered" color="primary">Bordered</GlobalButton>
      <GlobalButton variant="light" color="primary">Light</GlobalButton>
      <GlobalButton variant="flat" color="primary">Flat</GlobalButton>
      <GlobalButton variant="faded" color="primary">Faded</GlobalButton>
      <GlobalButton variant="shadow" color="primary">Shadow</GlobalButton>
      <GlobalButton variant="ghost" color="primary">Ghost</GlobalButton>
    </div>
  )
};
