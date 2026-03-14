import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@heroui/input";
import FormField from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "Components/FormField",
  component: FormField,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[700px]">
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    title: "Waitlist name",
    description: "The name of your waitlist. This will be visible to your users.",
    children: <Input placeholder="My Waitlist" size="sm" />
  }
};

export const Required: Story = {
  args: {
    title: "Email",
    description: "The email address used for sending notifications.",
    isRequired: true,
    children: <Input placeholder="you@example.com" size="sm" />
  }
};

export const WithError: Story = {
  args: {
    title: "Domain",
    description: "Custom domain for your waitlist landing page.",
    isRequired: true,
    error: { message: "This domain is already taken" },
    children: <Input placeholder="example.com" size="sm" isInvalid />
  }
};

export const WithIcon: Story = {
  args: {
    title: "API Key",
    description: "Your secret API key for programmatic access.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-muted-foreground">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
      </svg>
    ),
    children: <Input placeholder="sk_live_..." size="sm" type="password" />
  }
};

export const MultipleFields: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[700px]">
      <FormField
        title="Project name"
        description="Give your project a unique name."
        isRequired
      >
        <Input placeholder="My Project" size="sm" />
      </FormField>
      <FormField
        title="Description"
        description="A short description of what your project does."
      >
        <Input placeholder="A brief description..." size="sm" />
      </FormField>
      <FormField
        title="Website"
        description="Your project's website URL."
      >
        <Input placeholder="https://example.com" size="sm" />
      </FormField>
    </div>
  )
};
