/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Usa clases para activar el modo oscuro
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    'node_modules/flowbite-react/lib/esm/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#009944',
        background_400: '#374151',
        background_500: '#2b2b30',
        background_600: '#1f2937 ',

        background_base: '#1f2937',      // fondo base general
        background_card: '#2b2b30',           // fondo de tarjetas/componentes
        border_or_header: '#374151',          // bordes, headers o separadores

//1b1c21
        //#23262d
        secondary: '#02233a',
      },
      
      
      // Asegúrate de incluir configuraciones para hover si es necesario
      backgroundColor: theme => ({
        ...theme('colors'),
        'primary-hover': '#02233a', // Un color diferente para hover, por ejemplo
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('flowbite/plugin'),
  ],
};
