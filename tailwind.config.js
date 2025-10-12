/** @type {import('tailwindcss').Config} */
import colors from "./client/tailwind/colors";

const px0_200 = Object.fromEntries(
  Array.from({ length: 201 }, (_, i) => [i, `${i}px`])
);
const px0_20 = Object.fromEntries(
  Array.from({ length: 21 }, (_, i) => [i, `${i}px`])
);

export default {
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx,css}"],
  theme: {
    extend: {
      spacing: px0_200,
      borderRadius: px0_20,
      borderWidth: px0_20,
      fontSize: px0_200,
    },
    colors,
  },
  plugins: [],
};
