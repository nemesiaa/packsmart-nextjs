/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        anthracite: '#2a2d34',
        anthraciteDark: '#1f2126',
        mauve: '#c084fc',
        mauveLight: '#e9d5ff',
        violet: '#a855f7',
        violetDark: '#9333ea',
        rose: '#f472b6',
        textSoft: '#f5f5f7',
      },
    },
  },
  plugins: [],
};
