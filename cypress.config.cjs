module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implementar eventos si es necesario
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
};
