context('/calls tests', () => {
  function loginUser() {
    cy.visit('/');

    cy.findByRole('textbox', { name: 'Email' }).as('emailField');
    cy.findByLabelText('Password').as('passwordField');

    cy.get('@emailField').type('test@test.com');
    cy.get('@passwordField').type('1234');

    cy.findByRole('button', { name: 'Login' }).click();
  }

  function logoutUser() {
    const logoutButton = cy.findByRole('button', { name: 'logout' });

    logoutButton.click();

    cy.url().should('include', '/login');
  }

  beforeEach(() => {
    loginUser();
  });

  afterEach(() => {
    logoutUser();
  });

  it('User can open call details', () => {
    cy.url().should('include', '/calls');

    const callItem = cy.getByDataTestId('call-item').first();

    cy.getByDataTestId('call-item')
      .first()
      .invoke('attr', 'data-id')
      .then(callItemId => {
        callItem.click();

        cy.url().should('include', callItemId);

        cy.get('div').should('include.text', callItemId);
      });
  });

  it('User sees an error message when opening non-existing call detail', () => {
    cy.url().should('include', '/calls');

    cy.visit('/calls/non-existing-id');

    cy.get('div').should('include.text', 'We could not find the call data');
  });

  it('User can filter calls by call status', () => {
    cy.url().should('include', '/calls');

    cy.getByDataTestId('pagination').as('pagination').should('be.visible');

    cy.findByText('Filtering Limitation').should('be.visible');

    cy.getByDataTestId('call-status').as('callStatus').should('have.text', 'All');

    cy.get('@callStatus').click();

    cy.getByDataTestId('select-option-item-archived').as('archivedOption');

    cy.get('@archivedOption').should('be.visible');

    cy.get('@archivedOption').click();

    cy.get('@callStatus').should('have.text', 'Archived');

    cy.get('@pagination').should('not.exist');

    cy.getByDataTestId('call-item').contains('button').should('not.exist');

    cy.getByDataTestId('call-item').contains('Archived').should('exist');
  });

  it('Call list shows an error if we visit a page that does not exist', () => {
    cy.url().should('include', '/calls');

    cy.visit('/calls?page=99999999999');

    cy.findByText("There's no calls in this page!").should('be.visible');
  });
});
