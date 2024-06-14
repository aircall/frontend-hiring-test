describe('Logout Test', () => {
  before(() => {
    cy.visit('/login');
    cy.login('test@example.com', 'password');
    cy.url().should('include', '/calls');
  });

  it('should log out and redirect to the login page', () => {
    cy.contains('button', 'logout').click();
    cy.url().should('include', '/login');
  });
});
