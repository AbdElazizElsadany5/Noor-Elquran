/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app.jsx"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        amiri: ["Amiri", "serif"]
      }
    }
  },
  plugins: []
};
