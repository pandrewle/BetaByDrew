/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primarycolor: "#20201D",
        secondarycolor: "#f5f5f4",
        primaryaccent: "#4B502D",
        secondaryaccent: "#E1B40C",
      },
    },
  },
  plugins: [],
};
