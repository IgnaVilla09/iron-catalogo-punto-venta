import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f5f1eb',
        foreground: '#1f1720',
        card: '#fffdf9',
        border: '#e5ddd1',
        accent: '#00b1cd',
        accentSoft: '#dff7fb',
      },
      boxShadow: {
        card: '0 10px 30px rgba(31, 23, 32, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
