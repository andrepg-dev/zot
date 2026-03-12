import type { Meta, StoryObj } from "@storybook/react";
import PageActions from "./PageActions";

const meta: Meta<typeof PageActions> = {
  title: "Components/PageActions",
  component: PageActions,
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
type Story = StoryObj<typeof PageActions>;

export const Default: Story = {
  args: {
    actionLabel: "New waitlist"
  }
};

export const CustomPlaceholder: Story = {
  args: {
    searchPlaceholder: "Search templates...",
    actionLabel: "Create template"
  }
};

export const WithoutFilter: Story = {
  args: {
    searchPlaceholder: "Search...",
    actionLabel: "Add new",
    showFilter: false
  }
};
