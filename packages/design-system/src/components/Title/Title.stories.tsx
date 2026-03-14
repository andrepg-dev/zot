import type { Meta, StoryObj } from "@storybook/react";
import Title from "./Title";

const meta: Meta<typeof Title> = {
  title: "Components/Title",
  component: Title,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Title>;

export const Default: Story = {
  args: {
    children: "Page Title"
  }
};

export const WithDescription: Story = {
  args: {
    children: "Settings",
    description: "Manage your account settings and preferences."
  }
};

export const SectionTitle: Story = {
  args: {
    children: "Waitlist Configuration",
    description: "Set up and customize your waitlist behavior."
  }
};
