/// <reference types="cypress" />

describe('Login and read call', () => {
  let callId: string;

  before(() => {
    cy.fixture('user').then(user => {
      this.user = user;
    });
  });

  it('Login and redirect to call details', () => {
    cy.visit('/login');
    cy.get('#email').type(this.user.email).should('have.value', this.user.email);
    cy.get('#password').type(this.user.password).should('have.value', this.user.password);
    cy.get('button[type="submit"]').contains('Login').click();
    cy.wait(2000);
    cy.url().should('include', '/calls');
    cy.get('div[data-test="call"]').first().click();
    cy.wait(1000);
    cy.get('.title').contains('Calls Details');
  });
});
