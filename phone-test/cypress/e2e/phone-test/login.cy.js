/// <reference types="cypress" />


describe('Test Authentication', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    // cy.visit('https://example.cypress.io/todo')
    cy.visit('http://localhost:3000/login')
    //     cy.get('#email').type(Cypress.env('CYPRESS_E2E_USERNAME'));
    // cy.get('#password').type(Cypress.env('CYPRESS_E2E_PASSWORD'));
    cy.get('#email').type('joe@aircall.io');
    cy.get('#password').type('pass');
    cy.findByRole('button', {
      name: /login/i
    }).click();
    
  })

  it('successfully logs in and displays default count of 5 cards', () => {
    cy.contains('logout').should('be.visible');
    cy.contains(/calls history/i).should('be.visible');
    cy.get('[data-testid="call-card"]').should('have.length', 5);
  })

  it('successfully goes into detail view when clicking card in list', () => {
    cy.contains('logout').should('be.visible');
    cy.contains(/calls history/i).should('be.visible');
    cy.get('[data-testid="call-card"]').eq(1).click();
    cy.get('[data-testid="call-detail-card"]').should('be.visible');


    // add logout test
    
  })

})
