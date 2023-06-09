/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
