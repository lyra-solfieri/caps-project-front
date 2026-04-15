describe('Login', () => {

    it('Deve fazer login com sucesso', () => {
  
      cy.visit('http://localhost:4200/login')
  
      cy.get('input[name=email]').type('bob')
  
      cy.get('input[name=password]').type('666157')
  
      cy.get('button[type=submit]').click()
  
      cy.url().should('include', '/dashboard')
  
    })
  
  })