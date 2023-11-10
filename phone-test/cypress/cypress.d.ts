/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getByDataTestId(dataTestAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;
  }
}
