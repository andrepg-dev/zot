import type { Meta, StoryObj } from "@storybook/react";
import InputComponent from "./Input";

const meta: Meta<typeof InputComponent> = {
  title: "Components/Input",
  component: InputComponent,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "url", "number"]
    },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" }
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof InputComponent>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
    label: "Label"
  }
};

export const WithValue: Story = {
  args: {
    label: "Name",
    value: "John Doe"
  }
};

export const WithMaxLength: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    maxLength: 20,
    value: "zotuser"
  }
};

export const URLType: Story = {
  args: {
    label: "Website",
    type: "url",
    placeholder: "example.com"
  }
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    value: "Cannot edit",
    isDisabled: true
  }
};

export const WithDescription: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    description: "We'll never share your email."
  }
};

export const WithError: Story = {
  args: {
    label: "Email",
    value: "invalid",
    isInvalid: true,
    errorMessage: "Please enter a valid email address"
  }
};
