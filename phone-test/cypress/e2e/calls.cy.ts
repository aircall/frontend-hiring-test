describe('Calls', () => {
  beforeEach(() => {
    cy.login('cedric@aircall.io', 'password');
  });

  it('should see a list of five calls', () => {
    cy.visit('http://localhost:3000/calls');
    cy.get('[data-testid="call-item"]').should('have.length', 5);
  });

  it.only('should see the detail of a call', () => {
    cy.visit('http://localhost:3000/calls');
    cy.get('[data-testid="call-item"]').first().click();
    cy.get('[data-testid="call-detail"]').should('be.visible');
  });
});
