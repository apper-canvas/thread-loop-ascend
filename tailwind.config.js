/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF4500",
        secondary: "#0079D3",
        accent: "#46D160",
        surface: "#FFFFFF",
        background: "#DAE0E6",
        success: "#46D160",
        warning: "#FFB000",
        error: "#EA0027",
        info: "#0079D3"
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"]
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["20px", { lineHeight: "28px" }],
        xl: ["25px", { lineHeight: "32px" }],
        "2xl": ["31px", { lineHeight: "40px" }],
        "3xl": ["39px", { lineHeight: "48px" }],
        "4xl": ["49px", { lineHeight: "56px" }]
      }
    },
  },
  plugins: [],
}