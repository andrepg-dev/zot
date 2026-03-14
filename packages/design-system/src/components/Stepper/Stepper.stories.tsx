import type { Meta, StoryObj } from "@storybook/react";
import Stepper from "./Stepper";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  args: {
    steps: [
      { number: 1, title: "Create waitlist", active: true },
      { number: 2, title: "Configure settings" },
      { number: 3, title: "Customize widget", optional: true },
      { number: 4, title: "Launch" }
    ]
  }
};

export const SecondStepActive: Story = {
  args: {
    steps: [
      { number: 1, title: "Create waitlist" },
      { number: 2, title: "Configure settings", active: true },
      { number: 3, title: "Customize widget", optional: true },
      { number: 4, title: "Launch" }
    ]
  }
};

export const TwoSteps: Story = {
  args: {
    steps: [
      { number: 1, title: "Enter details", active: true },
      { number: 2, title: "Confirm & publish" }
    ]
  }
};

export const AllOptional: Story = {
  args: {
    steps: [
      { number: 1, title: "Basic info", active: true },
      { number: 2, title: "Branding", optional: true },
      { number: 3, title: "Email template", optional: true },
      { number: 4, title: "Custom domain", optional: true }
    ]
  }
};
