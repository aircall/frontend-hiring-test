describe('Login Test', () => {
  it('should log in and redirect to the calls page', () => {
    cy.visit('/login');
    cy.login('test@example.com', 'password');
    cy.url().should('include', '/calls');
  });
});


//TODO: Can add tests here , after improving login functionality
