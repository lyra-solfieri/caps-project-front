describe('Login', () => {

    it('Deve fazer login com sucesso', () => {
  
      cy.visit('http://localhost:4200/login')
  
      cy.get('input[name=email]').type('alexsanderthorne@gmail.com')
  
      cy.get('input[name=password]').type('teste1')
  
      cy.get('button[type=submit]').click()
  
      cy.url().should('include', '/dashboard')
  
    })
  
  })