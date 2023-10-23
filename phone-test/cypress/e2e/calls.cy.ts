/// <reference types="cypress" />

describe('Login and read call', () => {
  before(() => {
    cy.fixture('user').then(user => {
      this.user = user;
    });
  });

  it('Login and redirect to calls page', () => {
    cy.visit('/login');
    cy.get('#email').type(this.user.email).should('have.value', this.user.email);
    cy.get('#password').type(this.user.password).should('have.value', this.user.password);
    cy.get('button[type="submit"]').contains('Login').click();
    cy.wait(4000);
    cy.url().should('include', '/calls');
  });
});
