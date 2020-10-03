/* global cy */
/// <reference types="cypress" />
import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";

When(`I visit {string}`, (path) => {
  cy.visit(path);
});

When(`I click the link {string}`, (text) => {
  cy.get("a").contains(text).click();
});

Then(`I am on {string}`, (path) => {
  cy.location("pathname").should("eq", path);
});

Then(`I see {string}`, (text) => {
  cy.contains(text);
});
