/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "outline": "#6c7a71",
        "surface-container-high": "#e6e8ea",
        "background": "#f7f9fb",
        "primary-container": "#10b981",
        "surface-container": "#eceef0",
        "on-primary-container": "#00422b",
        "on-background": "#191c1e",
        "on-surface": "#191c1e",
        "surface-variant": "#e0e3e5",
        "surface": "#f7f9fb",
        "surface-container-low": "#f2f4f6",
        "surface-container-highest": "#e0e3e5",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#bbcabf",
        "on-surface-variant": "#3c4a42",
        "on-primary": "#ffffff",
        "primary": "#006c49",
        "tertiary": "#a43a3a",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}