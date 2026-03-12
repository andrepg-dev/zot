import type { Meta, StoryObj } from "@storybook/react";
import Type from "./Type";

const meta: Meta<typeof Type> = {
  title: "Foundation/Type",
  component: Type,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "base", "sm", "link"]
    }
  }
};

export default meta;
type Story = StoryObj<typeof Type>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Type variant="h1">H1 - Heading extra large</Type>
      <Type variant="h2">H2 - Heading large</Type>
      <Type variant="h3">H3 - Heading medium</Type>
      <Type variant="h4">H4 - Heading small</Type>
      <Type variant="h5">H5 - Heading extra small</Type>
      <Type variant="h6">H6 - Label</Type>
      <Type variant="base">Base - Body text</Type>
      <Type variant="sm">Small - Caption text</Type>
      <Type variant="link">Link - Clickable text</Type>
    </div>
  )
};

export const Default: Story = {
  args: {
    children: "Default body text",
    variant: "base"
  }
};

export const Heading: Story = {
  args: {
    children: "Page heading",
    variant: "h1"
  }
};

export const Link: Story = {
  args: {
    children: "Click me",
    variant: "link"
  }
};

export const CustomElement: Story = {
  args: {
    children: "Rendered as a span",
    variant: "h4",
    as: "span"
  }
};
