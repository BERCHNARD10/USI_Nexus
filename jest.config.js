module.exports = {
    testEnvironment: 'jsdom', // Esto es importante para pruebas en React
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    transform: {
      "^.+\\.jsx?$": ["babel-jest", { sourceType: "module" }]
    },
    setupFiles: ['./jest.setup.js'], // Archivo para inicializar la configuración
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock de estilos
      '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock de archivos
    },
  };
  