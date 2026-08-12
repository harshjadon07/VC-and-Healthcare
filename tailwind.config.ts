import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          500: '#198754',
          700: '#166534',
          800: '#0F5132',
          900: '#0A3822',
        },
        sand: {
          50: '#FAF7F2',
          100: '#F4F0EA',
          200: '#E6E0D5',
          300: '#D5C9B5',
        },
        triage: {
          emergency: '#DC2626',
          emergencyBg: '#FEF2F2',
          urgent: '#D97706',
          urgentBg: '#FFFBEB',
          routine: '#16A34A',
          routineBg: '#F0FDF4',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
