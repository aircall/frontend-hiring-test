describe('template spec', () => {
  it('should allow a user to log in, access call details, and log out', () => {
    // Visit the login page
    cy.visit('https://your-app-url.com/login');

    // Enter username and password
    cy.get('input[name="username"]').type('your-username');
    cy.get('input[name="password"]').type('your-password');

    // Submit the login form
    cy.get('button[type="submit"]').click();

    // Verify that we are logged in by checking the URL or presence of a logout button
    cy.url().should('include', '/dashboard');
    cy.get('button').contains('Logout').should('be.visible');

    // Navigate to the call details page
    cy.visit('https://your-app-url.com/call-details/12345'); // Replace with the actual path

    // Verify the call details are displayed
    cy.get('.call-details').should('be.visible');
    cy.get('.call-details').within(() => {
      cy.get('.caller-name').should('contain', 'John Doe'); // Adjust as necessary
      cy.get('.call-time').should('contain', '10:30 AM'); // Adjust as necessary
    });

    // Log out
    cy.get('button').contains('Logout').click();

    // Verify we are logged out by checking the URL or presence of the login button
    cy.url().should('include', '/login');
    cy.get('button[type="submit"]').should('be.visible');
  });
});
