module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implementa los eventos de nodo aquí si es necesario
    },
    baseUrl: 'https://robe.host8b.me/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: false,  // Desactivar archivo de soporte
  },
};
