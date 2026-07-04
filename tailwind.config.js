/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        hurricane: ["Hurricane", "cursive"],
      },
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
        shimmer: {
          "100%": { transform: "translateX(100%)" },
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
        drawTick: {
          "0%": { opacity: "0", transform: "scale(0)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bellRing: {
          "0%": { transform: "rotate(0deg)" },
          "15%": { transform: "rotate(15deg)" },
          "30%": { transform: "rotate(-15deg)" },
          "45%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(-10deg)" },
          "75%": { transform: "rotate(5deg)" },
          "90%": { transform: "rotate(-5deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        wheelie: "wheelie 3s linear infinite",
        width: "width 3s ease-in-out infinite",
        loopScroll: "loopScroll 2s linear infinite",
        bellRing: "bellRing 0.8s ease-in-out",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};
