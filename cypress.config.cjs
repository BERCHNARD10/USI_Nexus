module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implementa los eventos de nodo aquí si es necesario
    },
    baseUrl: 'https://uthh-pry-nz18.vercel.app/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: false,  // Desactivar archivo de soporte
  },
};
