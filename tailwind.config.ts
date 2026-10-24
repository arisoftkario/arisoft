import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          dark: '#071528',
          light: '#132E54',
          subtle: '#1E3A5F',
        },
        brand: {
          green: '#15803D',
          'green-hover': '#166534',
          'green-light': '#86EFAC',
          'green-pale': '#DCFCE7',
        },
        surface: {
          alt: '#F4F7FB',
          card: '#FFFFFF',
        },
        content: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#64748B',
        },
        line: {
          subtle: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card-sm': '12px',
        'card': '16px',
        'card-lg': '20px',
      },
    },
  },
  plugins: [],
};

export default config;
