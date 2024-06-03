/// <reference types="cypress" />

describe('Check Login, detail page and logout', () => {
  before(() => {
    cy.fixture('user').then(user => {
      this.user = user;
    });
  });

  it('Login and redirect to call details with logout', () => {
    cy.visit('/login');

    //set username and password
    cy.get('#email').type(this.user.email).should('have.value', this.user.email);
    cy.get('#password').type(this.user.password).should('have.value', this.user.password);
    cy.get('button[type="submit"]').contains('Login').click();

    //check if show loading calls
    cy.get('p').contains('Loading calls...');
    cy.wait(1000);

    //check if show calls
    cy.url().should('include', '/calls');

    cy.get('[data-cy=call-detail]').first().click();
    cy.get('p').contains('Loading call details...');
    cy.wait(1000);

    cy.get('[data-cy=call-details-title]').contains('Calls Details');

    cy.contains('a', 'logout').should('be.visible').click();
  });
});
