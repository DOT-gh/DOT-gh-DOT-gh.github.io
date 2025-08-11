/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        threat: {
          low: "#6EE7B7",
            mid: "#FBBF24",
            high: "#F87171"
        }
      }
    }
  },
  plugins: []
};