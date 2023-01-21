/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    login(email: string, password: string): Chainable<Subject>;
  }
}

Cypress.Commands.add('login', (email, password) => {
  cy.visit('http://localhost:3000/login');
  cy.get('[data-testid="email"]').click().type(email);
  cy.get('[data-testid="password"]').click().type(password);
  cy.get('[data-testid="submit"]').click();
  cy.url().should('not.include', '/login');
});
