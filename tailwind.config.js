/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        wheelie: {
          "0%": { transform: "rotate(0deg) " },
          "10%": { transform: "rotate(-20deg) " },
          "20%": { transform: "rotate(-10deg)" },
          "30%": { transform: "rotate(-20deg) " },
          "40%": { transform: "rotate(0deg) " },
          "50%": { transform: "rotate(-10deg) " },
          "100%": { transform: "rotate(0deg)" },
        },
        ride: {
          "0%": { transform: "translateX(0)" },
          "5%": { transform: "translateX(5px)" },
          "20%": { transform: "translateX(3px)" },
          "25%": { transform: "translateX(4px)" },
          "40%": { transform: "translateX(0)" },
          "45%": { transform: "translateX(2px)" },
          "100%": { transform: "translateX(0)" },
        },
        width: {
          "0%": { transform: "scaleX(0)" },
          "5%": { transform: "scaleX(0.5)" },
          "20%": { transform: "scaleX(1)" },
          "25%": { transform: "scaleX(0.5)" },
          "40%": { transform: "scaleX(0.2)" },
          "45%": { transform: "scaleX(0.5)" },
          "100%": { transform: "scaleX(0)" },
        },
        loopScroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        wheelie: "wheelie 2s ease-in-out infinite",
        ride: "ride 2s ease-in-out infinite",
        width: "width 2s ease-in-out infinite",
        loopScroll: "loopScroll 5s linear infinite",
      },
    },
  },
  plugins: [],
};
