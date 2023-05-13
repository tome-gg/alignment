/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts}'],
  theme: {
    extend: {
      scale: {
        '200': '2.00',
        '400': '4.00',
        '800': '8.00'
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
    themes: [
      {
        tomegg: {
        "primary": "#1e3a8a",
        "secondary": "#2563eb",
        "accent": "#6d28d9",
        "neutral": "#3D4451",
        "base-100": "#FFFFFF",
        "info": "#9ca3af",
        "success": "#22c55e",
        "warning": "#FBBD23",
        "error": "#F87272",
        }
      }
    ]
  }
}
