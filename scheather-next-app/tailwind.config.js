// tailwind.config.js (ES Module format)
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        montserrat: ["var(--font-montserrat)"],
        inter: ["var(--font-inter)"],
        island: ["var(--font-island)"],
        libre: ["var(--font-libre)"],
        cedarville: ["var(--font-cedarville)"],
      },
    },
  },
  plugins: [],
};
