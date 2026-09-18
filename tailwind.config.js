/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0c",
        panel: "#151517",
        line: "#26262a",
        accent: "#e8b84b"
      }
    }
  },
  plugins: []
};
