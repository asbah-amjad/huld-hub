/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const ms = require('smtp-tester');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  const port = 7777;
  const mailServer = ms.init(port);

  let receivedEmail = null;

  // process all emails
  mailServer.bind((addr, id, email) => {
    receivedEmail = email.html;
  });

  on('task', {
    getEmail() {
      while(!receivedEmail) {
        cy.wait(1000);
      }

      const email = receivedEmail;
      receivedEmail = null;
      return email;
    }
  });
};
