import type { Config } from "tailwindcss"

const config = {
	darkMode: ["class"],
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		container: {
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "#004346",
					foreground: "#ffffff",
					light: "#1ab39a",
					dark: "#0f7a66",
				},
				secondary: {
					DEFAULT: "#508991",
					foreground: "#ffffff",
					light: "#f7b565",
					dark: "#e68f2c",
				},
				ternary: {
					DEFAULT: "#74B3CE",
					foreground: "#ffffff",
					light: "#f7b565",
					dark: "#e68f2c",
				},
				destructive: {
					DEFAULT: "#d33512",
					foreground: "#ffffff",
					light: "#e04a2a",
					dark: "#b22c0f",
				},
				muted: {
					DEFAULT: "#774e20",
					foreground: "#ffffff",
					light: "#8b5c26",
					dark: "#63401a",
				},
				accent: {
					DEFAULT: "#faf1d0",
					foreground: "#ffffff",
					light: "#fcf5dc",
					dark: "#f8edc4",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
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
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"caret-blink": "caret-blink 1.25s ease-out infinite",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("tailwindcss-all")],
} satisfies Config

export default config

