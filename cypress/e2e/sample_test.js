describe('Sample Test', () => {
    it('Visita la página principal', () => {
      cy.visit('/');
      cy.contains('Your App Title'); // Ajusta el contenido a algo que esté en tu aplicación.
    });
  });
  