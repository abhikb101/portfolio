/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        "primary-action": "#0052FF",
        "hero-accent": "#E74C3C",
        highlight: "#FBF0B2",
        "base-black": "#1A1A1A",
        "base-white": "#FFFFFF",
        "subtle-gray": "#F0F0F0",
      },
    },
  },
  plugins: [],
};
