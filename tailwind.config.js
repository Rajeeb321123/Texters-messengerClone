/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['var(--font-pixel)']
      },
      cursor: {
        'pointer': 'url("/images/cursor/pointer/1.gif"), pointer',
      },
      keyframes: {
        wave1: {
          '0%, 100%': { transform: 'translateY(0rem)' },
          '20%': { transform: 'translateY(-0.5rem)' },
        },
        wave2: {
          '0%, 100%': { transform: 'translateY(0rem)' },
          '40%': { transform: 'translateY(-0.5rem)' },
        },
        wave3: {
          '0%, 100%': { transform: 'translateY(0rem)' },
          '60%': { transform: 'translateY(-0.5rem)' },
        },
        wave4: {
          '0%': { transform: 'translateY(0rem)' },
          '80%': { transform: 'translateY(-0.5rem)' },
        },
        blinkAnimation: {
          'to': {
            visibility: 'hidden'
          }
        },
        pointer:{
          '0%':{ cursor: 'url("/images/cursor/pointer/1.gif"), auto'},
          '10%':{cursor: 'url("/images/cursor/pointer/2.gif"), auto' },
          '20%':{cursor: 'url("/images/cursor/pointer/3.gif"), auto' },
          '30%':{cursor: 'url("/images/cursor/pointer/4.gif"), auto' },
          '40%':{cursor: 'url("/images/cursor/pointer/5.gif"), auto' },
          '50%':{cursor: 'url("/images/cursor/pointer/6.gif"), auto' },
          '60%':{ cursor: 'url("/images/cursor/pointer/7.gif"), auto'},
          '70%':{cursor: 'url("/images/cursor/pointer/8.gif"), auto' },
          '80%':{cursor: 'url("/images/cursor/pointer/9.gif"), auto' },
          '90%':{ cursor: 'url("/images/cursor/pointer/10.gif"), auto'},
          '10%':{ cursor: 'url("/images/cursor/pointer/11.gif"), auto'},
        },
        


      },


    },
  },
  plugins: [
    // npm i @tailwindcss/forms
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ],
}
