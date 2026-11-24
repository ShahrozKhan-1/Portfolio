/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "3rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, index) => [index, String(index / 100)]),
      ),
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ink: {
          DEFAULT: "#07070A",
          2: "#0A0A0F",
          3: "#101017",
          4: "#16161F",
        },
        signal: {
          DEFAULT: "#C8FA4F",
          soft: "#E3FFA0",
          deep: "#9ED40C",
          dim: "#C8FA4F1A",
        },
        iris: "#8C7CFF",
        aqua: "#5BE7D2",
        rose: "#FF7AB6",
        paper: "#F3F0E8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Space Grotesk", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "Instrument Serif", "Georgia", "serif"],
      },
      fontSize: {
        "display-xs": ["clamp(2.25rem, 4vw, 3.5rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        "display-sm": ["clamp(2.75rem, 6vw, 4.75rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-md": ["clamp(3.25rem, 8vw, 6.5rem)", { lineHeight: "0.92", letterSpacing: "-0.045em" }],
        "display-lg": ["clamp(3.75rem, 10.5vw, 9rem)", { lineHeight: "0.88", letterSpacing: "-0.05em" }],
      },
      letterSpacing: {
        tightest: "-0.06em",
        label: "0.22em",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(200,250,79,0.28), 0 18px 60px -18px rgba(200,250,79,0.35)",
        panel: "0 40px 120px -40px rgba(0,0,0,0.9), inset 0 1px 0 0 rgba(255,255,255,0.05)",
      },
      spacing: {
        section: "clamp(4rem, 8vw, 7rem)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-50%,0,0)" },
        },
        "marquee-reverse": {
          from: { transform: "translate3d(-50%,0,0)" },
          to: { transform: "translate3d(0,0,0)" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-12px,0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "70%": { transform: "scale(1.8)", opacity: "0" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee var(--marquee-duration, 38s) linear infinite",
        "marquee-reverse": "marquee-reverse var(--marquee-duration, 38s) linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 28s linear infinite",
        shimmer: "shimmer 6s linear infinite",
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.22,1,0.36,1) infinite",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

module.exports = config
