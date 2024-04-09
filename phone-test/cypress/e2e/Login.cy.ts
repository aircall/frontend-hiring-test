import 'cypress-wait-until';
import fixtures from '../fixtures/example.json';

describe('Login page', () => {
    it('should visit the Login page', () => {
        cy.visit(`${Cypress.env('APP_BASE_URL')}/login`);
    });

    it('should perform login and navigate to calls page', () => {
        
        const { login } = fixtures;
        
        cy.visit(`${Cypress.env('APP_BASE_URL')}/login`);

        cy.get('[data-cy="email"]').should('exist');
        cy.get('[data-cy="password"]').should('exist');
        cy.get('[data-cy="btn-submit"]').should('exist');

        cy.get('[data-cy="email"]').type(login.username);
        cy.get('[data-cy="password"]').type(login.password);
        cy.get('[data-cy="btn-submit"]').click().then(() => {
            cy.url().should('eq', `${Cypress.env('APP_BASE_URL')}/calls`);
        });
    });
});
