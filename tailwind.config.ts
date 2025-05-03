import { heroui } from "@heroui/theme"
import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(accordion|avatar|button|calendar|divider|drawer|dropdown|spinner|toggle|table|tabs|popover|ripple|modal|menu|checkbox|form|spacer).js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          dark: "#1E40AF",
          darker: "#1E3A8A",
          light: "#60A5FA",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          light: "#34D399",
          dark: "#047857",
          foreground: "hsl(var(--secondary-foreground))",
        },
        background: "hsl(var(--background))",
        text: {
          primary: "#1F2937",
          secondary: "#4B5563",
          light: "#F9FAFB",
        },
        status: {
          success: "#059669",
          warning: "#FBBF24",
          error: "#DC2626",
        },
        accent: {
          sunset: "#F59E0B",
          ocean: "#0EA5E9",
          forest: "#059669",
          sand: "#D4B895",
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        ui: {
          divider: "#E5E7EB",
          disabled: "#9CA3AF",
          hover: "#1E40AF",
          active: "#1E3A8A",
          focus: "#60A5FA",
        },
        notification: {
          success: {
            background: "#059669",
            text: "#F9FAFB",
          },
          warning: {
            background: "#FBBF24",
            text: "#1F2937",
          },
          error: {
            background: "#DC2626",
            text: "#F9FAFB",
          },
        },
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), heroui()],
} satisfies Config
