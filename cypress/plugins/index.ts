/// <reference types="cypress" />
import cucumber from "cypress-cucumber-preprocessor";

/**
 * @type {Cypress.PluginConfig}
 */
export default (on, config) => {
    on("file:preprocessor", cucumber.default());
};