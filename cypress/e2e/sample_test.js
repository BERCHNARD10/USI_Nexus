describe('Sample Test', () => {
    it('Visita la página principal', () => {
      cy.visit('/');
      cy.contains('Para los Alumnos'); // Este es el texto que debería estar en tu página
    });
  });
  