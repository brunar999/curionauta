import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          50: "#F6F1FE",
          100: "#EBE1FB",
          400: "#9D6FF0",
          500: "#7B3EE0",
          600: "#6325C4",
          700: "#4A1A99",
        },
        green: {
          50: "#EDFBF4",
          100: "#DCF5EB",
          400: "#3ECFA5",
          500: "#20B381",
          600: "#17997D",
        },
        cream: "#FFF9F0",
        paper: "#FFFDF8",
        ink: "#1C1432",
        "ink-soft": "#3E3264",
        "ink-mute": "#7C7496",
        line: "#E9E3F2",
        yellow: "#FFC94A",
        coral: "#FF7A6B",
        sky: "#6FB9FF",
      },
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.3rem",
        "3xl": "1.75rem",
        "4xl": "2rem",
      },
      boxShadow: {
        sticker: "0 6px 0 #2A0E63",
        "sticker-green": "0 6px 0 #0F6B55",
        card: "0 10px 30px rgba(74,26,153,0.08)",
        "card-hover": "0 18px 40px rgba(74,26,153,0.14)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};

export default config;
