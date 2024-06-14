describe('login/details/logout spec', () => {
  it('should allow a user to log in, access call details, and log out', () => {
    // Visit the login page
    cy.visit('/login');

    // Enter username and password
    cy.get('#email').type('test@test.com');
    cy.get('#password').type('password');

    // Submit the login form
    cy.get('button[type="submit"]').click();

    // Verify we are logged in by checking the URL or presence of the user's email
    cy.url().should('include', '/calls');

    // Verify we are logged in by checking the URL or presence of the user's email
    cy.contains('Welcome test@test.com!').should('be.visible');

    // Navigate to the call details page
    cy.get('#call-0').click();

    //should have a text "Calls Details"
    cy.contains('Calls Details').should('be.visible');

    // Log out
    cy.get('button').contains('logout').click();

    // Verify the user is redirected to the login page
    cy.url().should('include', '/login');

    // Verify we are logged out by checking the URL or presence of the login button
    cy.get('button[type="submit"]').should('be.visible');
  });
});
