import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}", "./node_modules/@heroui/theme/dist/**/*.{js,mjs,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [heroui()],
} satisfies Config;
