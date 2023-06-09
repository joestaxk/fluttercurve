/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
          'authSkin': "url(/account-bg.jpg)"
      },
      fontFamily: {
        'Mont': 'Montserrat Alternates',
      },
      theme: {
        screens: {
          'sm': "299px",
          'mobile': '400px',
          'md': '522px',
          "n": "683px",
          'lg': '826px',
          // => @media (min-width: 826px) { ... }
          'xl': '1150px',
          // => @media (min-width: 1150px) { ... }
          'xxl': '1318px',
          // => @media (min-width: 1280px) { ... }
        },
      }
    },
  },
  plugins: [],
}
