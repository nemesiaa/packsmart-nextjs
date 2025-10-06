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
        mauvebg: 'rgb(192 132 252 / 0.12)',

        // ✅ Palette anthracite pour ton thème sombre
        ui: {
          base: '#121418',   // fond global (anthracite profond)
          surface: '#1A1F24', // panneaux / cartes / header / aside
          border: '#2A2F36',  // bordures visibles, subtiles
          ring: '#3A404A',    // anneaux focus / séparateurs
        },
      },
    },
  },
  plugins: [],
};
