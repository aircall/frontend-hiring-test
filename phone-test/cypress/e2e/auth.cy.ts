describe('Authentication', () => {
  it('should redirect to another screen after successful login', () => {
    cy.login('cedric@aircall.io', 'password');
  });

  it('should redirect to /login on logout', () => {
    cy.login('cedric@aircall.io', 'password');
    cy.get('[data-testid="logout"]').click();
    cy.url().should('include', '/login');
  });
});
