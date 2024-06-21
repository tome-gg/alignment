/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      scale: {
        '200': '2.00',
        '400': '4.00',
        '800': '8.00'
      },
      animation: {
        // 'disappearslow': 'disappearslow 3s linear',
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // disappearslow: {
        //   '0%': { 
        //     opacity: 0, 
        //     transform: scale(1)
        //   },
        //   '100%': { 
        //     opacity: 1,
        //     transform: scale(0.5)
        //   },
        // }
      }
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
      opacity: ['group-hover'],
    }
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
