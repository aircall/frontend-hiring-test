/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'cypress-wait-until';
import fixtures from '../fixtures/example.json';

describe('Logout functionlaity', () => {
    let AUTH_TOKEN_KEY: string, REFRESH_TOKEN_KEY: string;
    
    before(() => {
        AUTH_TOKEN_KEY = Cypress.env('AUTH_TOKEN_KEY');
        REFRESH_TOKEN_KEY = Cypress.env('REFRESH_TOKEN_KEY');
    })

    it('should perform a success login and a correctly logout', () => {
        const { login } = fixtures;
        
        cy.visit(`${Cypress.env('APP_BASE_URL')}/login`);

        cy.get('[data-cy="email"]').type(login.username);
        cy.get('[data-cy="password"]').type(login.password);
        cy.get('[data-cy="btn-submit"]').click();

        cy.url().should('eq', `${Cypress.env('APP_BASE_URL')}/calls`).then(() => {
            expect(localStorage.getItem(AUTH_TOKEN_KEY)).not.to.be.null;
            expect(localStorage.getItem(REFRESH_TOKEN_KEY)).not.to.be.null;
        });

        cy.get('[data-cy="btn-logout"]').click();
        
        cy.url().should('eq', `${Cypress.env('APP_BASE_URL')}/login`).then(() => {
            expect(localStorage.getItem(AUTH_TOKEN_KEY)).to.be.null;
            expect(localStorage.getItem(REFRESH_TOKEN_KEY)).to.be.null;
        });
    });
});
