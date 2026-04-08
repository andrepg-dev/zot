const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/design-system/src/**/*.{js,ts,jsx,tsx}",
    "../../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "fade-in": "fade-in 2.5s ease-out forwards"
      },
      colors: {
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)"
        }
      }
    }
  },
  darkMode: "class",
  plugins: [
    heroui({
      prefix: "heroui",
      addCommonColors: false,
      defaultTheme: "dark",
      defaultExtendTheme: "dark",
      themes: {
        dark: {
          colors: {
            default: {
              50: "#141415"
            },
            content1: "#141415"
          }
        }
      },
      layout: {
        disabledOpacity: "0.5",
        radius: {
          small: "5px",
          medium: ".45rem"
        },
        borderWidth: {
          medium: "thin"
        }
      }
    })
  ]
};

module.exports = config;
