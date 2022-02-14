/// <reference types="cypress" />

describe('Recipe: blogs__iframes', () => {
    it('do it more generically', () => {
      const getIframeBody = (identifier) => {
        return cy
        .get(identifier)
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
      }

      // Visiting the page index.html and getting iframe A
      cy.visit('index.html').contains('XHR in iframe')
      getIframeBody('iframe[data-cy="bankid"]').as('iframeA')

      cy.get('@iframeA').within(() => {
        getIframeBody('iframe[src="https://tools.bankid.no/bankid-test/auth"]').as('iframeB')

        cy.get('@iframeB').within(() => {
          getIframeBody('iframe[src^="https://csfe.bankid.no/CentralServerFEJS"]').as('iframeC')

          // Now we are in the right place and it finds the correct input element.
          // However, normal cypress command .type() fails and we have to use library cypress-real-events,
          // which provides an event firing system that works literally like in puppeteer
          cy.get('@iframeC').find('input[type="tel"]').should('be.visible').realType('12345678912')

          // But for the button below, this library now doesn't help anymore:
          // "Failed to execute 'getComputedStyle' on 'Window': parameter 1 is not of type 'Element'."
          cy.get('@iframeC').find('button[type="submit"]').should('be.visible').first().realClick()
        })
      })
    })
})
