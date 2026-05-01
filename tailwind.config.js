/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        wheelie: {
          "0%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "10%": {
            transform: "translateX(6px) translateY(-1px) rotate(-20deg)",
          },
          "20%": {
            transform: "translateX(6px) translateY(-0.5px) rotate(-10deg)",
          },
          "30%": {
            transform: "translateX(10px) translateY(-1px) rotate(-20deg)",
          },
          "40%": { transform: "translateX(10px) translateY(0) rotate(0deg)" },
          "45%": { transform: "translateX(10px) translateY(0) rotate(5deg)" },
          "80%": { transform: "translateX(0) translateY(0) rotate(5deg)" },
          "85%": { transform: "translateX(0) translateY(0) rotate(0deg)" },

          "100%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
        },
        width: {
          "0%": { transform: "scaleX(0.3)" },
          "10%": { transform: "scaleX(1)" },
          "20%": { transform: "scaleX(0.5)" },
          "30%": { transform: "scaleX(1)" },
          "40%": { transform: "scaleX(0.3)" },
          "50%": { transform: "scaleX(0.1)" },
          "90%": { transform: "scaleX(0.1)" },
          "100%": { transform: "scaleX(0.2)" },
        },
        loopScroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        wheelie: "wheelie 3s linear infinite",
        width: "width 3s ease-in-out infinite",
        loopScroll: "loopScroll 2s linear infinite",
      },
    },
  },
  plugins: [],
};
