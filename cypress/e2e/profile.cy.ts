describe('Menu de Perfil', () => {

    beforeEach(() => {
  
        cy.visit('http://localhost:4200/login')

        cy.get('input[name=email]').type('alexsanderthorne@gmail.com')
        
        cy.get('input[name=password]').type('teste1')
        
        cy.get('button[type=submit]').click()
        
        cy.url().should('include', '/dashboard')

      cy.visit('http://localhost:4200/dashboard')
  
    })
  
    it('Deve abrir dropdown de perfil', () => {
  
      cy.get('.profile-icon').click()
  
      cy.get('.profile-dropdown').should('be.visible')
  
    })
  
    it('Deve exibir botão logout', () => {
  
      cy.get('.profile-icon').click()
  
      cy.contains('Logout').should('be.visible')
  
    })
  
  })