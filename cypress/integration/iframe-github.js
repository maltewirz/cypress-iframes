/// <reference types="cypress" />

describe('Recipe: blogs__iframes', () => {
    it('Visits the iframe website and accesses the iframe within the iframe', () => {
      const getIframeBody = (iframeSelector, elementSelectorInIframe) => {
        return cy
        .get(iframeSelector)
        .its('0.contentDocument.body', {timeout: 30000})
        .should((body) => {
          expect(Cypress.$(body).has(elementSelectorInIframe).length).gt(0)
        })
        .then(cy.wrap)
      }

      // Visiting the page index.html and getting iframe A
      cy.visit('index.html').contains('XHR in iframe')
      getIframeBody('iframe[data-cy="bankid"]', 'iframe[src="https://tools.bankid.no/bankid-test/auth"]').as('iframeA')

      cy.get('@iframeA').within(() => {
        getIframeBody('iframe[src="https://tools.bankid.no/bankid-test/auth"]', 'iframe[src^="https://csfe.bankid.no/CentralServerFEJS"]').as('iframeB')

        cy.get('@iframeB').within(() => {
          getIframeBody('iframe[src^="https://csfe.bankid.no/CentralServerFEJS"]', 'input[type="tel"]').as('iframeC')

          // Now we are in the right place and it finds the correct input element.
          // However, normal cypress command .type() fails and we have to use library cypress-real-events,
          // which provides an event firing system that works literally like in puppeteer
          cy.get('@iframeC').find('input[type="tel"]').should('be.visible').realType('12345678912')

          // But for the button below, this library now doesn't help anymore:
          // "Failed to execute 'getComputedStyle' on 'Window': parameter 1 is not of type 'Element'."
          // This was solved by using {scrollBehavior:false}.
          cy.get('@iframeC').find('button[type="submit"]').should('be.visible').first().realClick({scrollBehavior:false})
        })
      })
    })
})
