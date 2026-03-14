import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import React from "react";
import StoryProvider from "./provider";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#000000" },
        { name: "light", value: "#FBFBFB" }
      ]
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: "centered"
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark"
      },
      defaultTheme: "dark"
    }),
    (Story) => (
      <StoryProvider>
        <Story />
      </StoryProvider>
    )
  ]
};

export default preview;
