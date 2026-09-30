import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f2f4f3',
        foreground: '#202329',
        card: '#ffffff',
        border: '#d5dbda',
        accent: '#00afc8',
        accentSoft: '#d9f5f8',
        muted: '#68717a',
      },
    },
  },
  plugins: [],
};

export default config;
