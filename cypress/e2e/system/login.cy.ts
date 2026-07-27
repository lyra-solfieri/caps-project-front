/// <reference types="cypress" />

describe('Aplicação CAPSI', () => {

    it('Deve abrir a página de login', () => {
  
      cy.visit('http://localhost:4200/login')
  
      cy.get('[data-cy="input-email"]').should('be.visible')
      cy.get('[data-cy="input-password"]').should('be.visible')
  
    })
  
  })