describe('Access Call Details Test', () => {
  const verifyCallDetails = () => {
    cy.contains('Type:').should('be.visible');
    cy.contains('Created at:').should('be.visible');
    cy.contains('Direction:').should('be.visible');
    cy.contains('From:').should('be.visible');
    cy.contains('Duration:').should('be.visible');
    cy.contains('Is archived:').should('be.visible');
    cy.contains('To:').should('be.visible');
    cy.contains('Via:').should('be.visible');
  };

  before(() => {
    cy.visit('/login');
    cy.login('test@example.com', 'password');
    cy.url().should('include', '/calls');
  });

  it('should access call details and verify details', () => {
    cy.get('[data-test-id="call-item"]').first().click();
    cy.url().should('include', '/calls/');
    cy.contains('Calls Details').should('be.visible');
    verifyCallDetails();
  });
});
