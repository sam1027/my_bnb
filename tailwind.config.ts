// tailwind.config.ts
import { type Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config satisfies Config;
