context('/login tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('User can only submit login form if email and password are valid', () => {
    function submitInvalidForm() {
      cy.get('@loginButton').click();

      cy.findAllByText(/Enter a valid email in the format/)
        .first()
        .should('be.visible');

      cy.url().should('include', '/login');
    }

    cy.findByRole('textbox', { name: 'Email' }).as('emailField');
    cy.findByLabelText('Password').as('passwordField');

    cy.findByRole('button', { name: 'Login' }).as('loginButton');

    submitInvalidForm();

    cy.get('@emailField').type('test@test.com');

    submitInvalidForm();

    cy.get('@passwordField').type('1');

    cy.get('@loginButton').click();

    cy.url().should('include', '/calls');

    cy.contains('test@test.com').should('be.visible');
  });
});
