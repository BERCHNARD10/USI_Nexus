module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implementa los eventos de nodo aquí si es necesario
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: false,  // Desactivar archivo de soporte
  },
};
