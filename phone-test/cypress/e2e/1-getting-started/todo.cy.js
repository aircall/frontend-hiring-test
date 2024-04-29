/// <reference types="cypress" />

// describe('Auth', () => {
//   beforeEach(() => {
//     cy.visit('/');
//     cy.get('#email').type(Cypress.env('CYPRESS_E2E_USERNAME'));
//     cy.get('#password').type(Cypress.env('CYPRESS_E2E_PASSWORD'));
//     cy.findByRole('button', {
//       name: /login/i
//     }).click();
//   });

//   it('Should login sucessfully', () => {
//     cy.contains('logout').should('be.visible');
//     cy.contains(/calls history/i).should('be.visible');
//   });

//   it('Should logout sucessfully', () => {
//     cy.contains('logout').should('be.visible');
//     cy.contains(/calls history/i).should('be.visible');

//     cy.findByRole('button', {
//       name: /logout/i
//     }).click();

//     cy.contains('logout').should('not.exist');
//     cy.contains(/calls history/i).should('not.exist');
//   });
// });

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

    
  })

  // it('can add new todo items', () => {
  //   // We'll store our item text in a variable so we can reuse it
  //   const newItem = 'Feed the cat'

  //   // Let's get the input element and use the `type` command to
  //   // input our new list item. After typing the content of our item,
  //   // we need to type the enter key as well in order to submit the input.
  //   // This input has a data-test attribute so we'll use that to select the
  //   // element in accordance with best practices:
  //   // https://on.cypress.io/selecting-elements
  //   cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)

  //   // Now that we've typed our new item, let's check that it actually was added to the list.
  //   // Since it's the newest item, it should exist as the last element in the list.
  //   // In addition, with the two default items, we should have a total of 3 elements in the list.
  //   // Since assertions yield the element that was asserted on,
  //   // we can chain both of these assertions together into a single statement.
  //   cy.get('.todo-list li')
  //     .should('have.length', 3)
  //     .last()
  //     .should('have.text', newItem)
  // })

  // it('can check off an item as completed', () => {
  //   // In addition to using the `get` command to get an element by selector,
  //   // we can also use the `contains` command to get an element by its contents.
  //   // However, this will yield the <label>, which is lowest-level element that contains the text.
  //   // In order to check the item, we'll find the <input> element for this <label>
  //   // by traversing up the dom to the parent element. From there, we can `find`
  //   // the child checkbox <input> element and use the `check` command to check it.
  //   cy.contains('Pay electric bill')
  //     .parent()
  //     .find('input[type=checkbox]')
  //     .check()

  //   // Now that we've checked the button, we can go ahead and make sure
  //   // that the list element is now marked as completed.
  //   // Again we'll use `contains` to find the <label> element and then use the `parents` command
  //   // to traverse multiple levels up the dom until we find the corresponding <li> element.
  //   // Once we get that element, we can assert that it has the completed class.
  //   cy.contains('Pay electric bill')
  //     .parents('li')
  //     .should('have.class', 'completed')
  // })

  // context('with a checked task', () => {
  //   beforeEach(() => {
  //     // We'll take the command we used above to check off an element
  //     // Since we want to perform multiple tests that start with checking
  //     // one element, we put it in the beforeEach hook
  //     // so that it runs at the start of every test.
  //     cy.contains('Pay electric bill')
  //       .parent()
  //       .find('input[type=checkbox]')
  //       .check()
  //   })

  //   it('can filter for uncompleted tasks', () => {
  //     // We'll click on the "active" button in order to
  //     // display only incomplete items
  //     cy.contains('Active').click()

  //     // After filtering, we can assert that there is only the one
  //     // incomplete item in the list.
  //     cy.get('.todo-list li')
  //       .should('have.length', 1)
  //       .first()
  //       .should('have.text', 'Walk the dog')

  //     // For good measure, let's also assert that the task we checked off
  //     // does not exist on the page.
  //     cy.contains('Pay electric bill').should('not.exist')
  //   })

  //   it('can filter for completed tasks', () => {
  //     // We can perform similar steps as the test above to ensure
  //     // that only completed tasks are shown
  //     cy.contains('Completed').click()

  //     cy.get('.todo-list li')
  //       .should('have.length', 1)
  //       .first()
  //       .should('have.text', 'Pay electric bill')

  //     cy.contains('Walk the dog').should('not.exist')
  //   })

  //   it('can delete all completed tasks', () => {
  //     // First, let's click the "Clear completed" button
  //     // `contains` is actually serving two purposes here.
  //     // First, it's ensuring that the button exists within the dom.
  //     // This button only appears when at least one task is checked
  //     // so this command is implicitly verifying that it does exist.
  //     // Second, it selects the button so we can click it.
  //     cy.contains('Clear completed').click()

  //     // Then we can make sure that there is only one element
  //     // in the list and our element does not exist
  //     cy.get('.todo-list li')
  //       .should('have.length', 1)
  //       .should('not.have.text', 'Pay electric bill')

  //     // Finally, make sure that the clear button no longer exists.
  //     cy.contains('Clear completed').should('not.exist')
  //   })
  // })
})
