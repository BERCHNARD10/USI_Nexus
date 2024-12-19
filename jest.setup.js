// jest.setup.js
globalThis.importMetaEnv = {
    VITE_API_URL: 'http://localhost/WebServices/',
    VITE_URL: 'http://localhost/UTHH_VIRTUAL/',
  };

  // Mock `import.meta.env` para las pruebas
  Object.defineProperty(global, 'import.meta', {
    value: { env: globalThis.importMetaEnv },
  });
  