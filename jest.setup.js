// jest.setup.js
globalThis.importMetaEnv = {
    VITE_API_URL: 'https://robe.host8b.me/WebServices/',
    VITE_URL: 'https://robe.host8b.me/',
  };

  // Mock `import.meta.env` para las pruebas
  Object.defineProperty(global, 'import.meta', {
    value: { env: globalThis.importMetaEnv },
  });
  