/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
    "./Context/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {},
  },
  plugins: [],
};
