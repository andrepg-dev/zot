/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
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
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Fira Code", "monospace"]
      },
      borderRadius: {
        default: "var(--radius-default)"
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)"
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)"
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)"
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)"
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)"
        },
        destructive: {
          DEFAULT: "var(--destructive)"
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)"
        },
        sidebar: {
          DEFAULT: "var(--sidebar)"
        }
      }
    }
  },
  darkMode: "class"
};

module.exports = config;
