import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

When(`I visit {string}`, (path: string) => {
  cy.visit(path);
});

When(`I click the link {string}`, (text: string) => {
  cy.get("a").contains(text).click();
});

When(`I click the link {string} and refresh`, (text: string) => {
  // manually reloading after clicks because for some reason
  // when cypress clicks a link, sometimes the url location changes
  // but the page content doesn't change.
  cy.get("a").contains(text).click().reload();
});

Then(`I am on {string}`, (path: string) => {
  cy.location("pathname").should("eq", path);
});

Then(`I see {string}`, (text: string) => {
  cy.contains(text);
});

Then(`I see the piece {string} before {string}`, (before: string, after: string) => {
  cy.get("table").children().contains(before).parents('tr').invoke('index').then(beforeIndex => {
    cy.get("table").children().contains(after).parents('tr').invoke('index').then(afterIndex => {
      expect(afterIndex).greaterThan(beforeIndex);
    })
  })
});
