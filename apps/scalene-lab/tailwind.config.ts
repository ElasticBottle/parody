import baseConfig from "@rectangular-labs/ui/tailwind.config";
import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [baseConfig],
  content: [...baseConfig.content],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
