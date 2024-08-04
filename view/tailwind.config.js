/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        backgroundImage: {
          "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
          "gradient-conic":
            "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        },
      },
    },
    plugins: [
      function ({addUtilities}) {
        const newUtilities = {
          "scrollbar-thin" : {
            scrollbarWidth: "thin",
            scrollbarColor: "rbg(31, 29, 29) white"
          },
          ".scrollbar-webkit": {
            "&::-webkit-scrollbar": {
              width: "10px"
            },
            "&::-webkit-scrollbar-track": {
              color: "white"
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rbg(31, 41, 55)",
              borderRadius: "20px",
              border: "1px solid white"
            },
          }
        }
        addUtilities(newUtilities, ["responsive", "hover"])
      }
    ],
  };
  