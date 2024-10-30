describe('Pruebas de LoginPage', () => {

    // Antes de cada prueba, visita la página de login
    beforeEach(() => {
      cy.visit('https://robe.host8b.me/inicio-sesion' , { timeout: 120000 });
    });
  
    it('Renderiza correctamente el formulario de inicio de sesión', () => {
      // Verificar que los campos y el botón de inicio de sesión están presentes
      cy.get('input[name="matriculaAlum"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.contains('Iniciar Sesión').should('be.visible');
    });
  
    it('Muestra error cuando se envía el formulario vacío', () => {
      // Simula el clic en el botón de iniciar sesión sin completar los campos
      cy.get('button').contains('Iniciar Sesión').click();
  
      // Verifica que aparezca el mensaje de error de validación
      cy.get('input[name="matriculaAlum"]').focus().blur(); // Fuerza el onBlur para activar inputError
      cy.contains('Este campo es requerido').should('exist');
    });
  
  
    it('Cambia la visibilidad de la contraseña al hacer clic en el ícono', () => {
      // Verifica que el campo de contraseña esté oculto por defecto
      cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    
      // Simula el clic en el botón de mostrar contraseña
      cy.get('[data-testid="toggle-password-visibility"]').click();
    
      // Verifica que la contraseña ahora esté visible
      cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    });
    
  
    it('Inicia sesión con credenciales válidas', () => {
      // Simula la entrada de datos válidos
      cy.get('input[name="matriculaAlum"]').type('20210643');
      cy.get('input[name="password"]').type('KINSBERone2020@');
  
      // Interceptar la solicitud al servidor y simular una respuesta exitosa
      cy.intercept('POST', 'https://robe.host8b.me/WebServices/loginUser.php', {
        statusCode: 200,
        body: {
          done: true,
          userData: { JWTUser: 'mockedToken' },
        },
      }).as('loginRequest');
  
      // Simula el clic en el botón de inicio de sesión
      cy.get('button').contains('Iniciar Sesión').click();
  
      // Espera a que se realice la solicitud de inicio de sesión
      cy.wait('@loginRequest');
  
      // Verifica que se redirige a la página principal (cambia la ruta según tu aplicación)
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  
    it('Muestra un mensaje de error si el inicio de sesión falla', () => {
      // Simula la entrada de datos válidos
      cy.get('input[name="matriculaAlum"]').type('123456');
      cy.get('input[name="password"]').type('password123');
  
      // Interceptar la solicitud al servidor y simular una respuesta de error
      cy.intercept('POST', '**/loginUser.php', {
        statusCode: 200,
        body: {
          done: false,
          message: 'Error en el servidor',
        },
      }).as('loginRequestFail');
  
      // Simula el clic en el botón de inicio de sesión
      cy.get('button').contains('Iniciar Sesión').click();
  
      // Espera a que se realice la solicitud de inicio de sesión
      cy.wait('@loginRequestFail');
  
      // Verifica que el mensaje de error del servidor aparezca
      cy.contains('Error en el servidor').should('be.visible');
    });
  });
  