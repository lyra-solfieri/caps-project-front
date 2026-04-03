describe('Menu lateral', () => {


    beforeEach(() => {
  
            cy.visit('http://localhost:4200/login')

            cy.get('input[name=email]').type('bob')
        
            cy.get('input[name=password]').type('666157')
        
            cy.get('button[type=submit]').click()
        
            cy.url().should('include', '/dashboard')
        
          
      cy.visit('http://localhost:4200/dashboard')
  
    })
  
    it('Deve abrir o menu hamburger', () => {
  
      cy.get('.hamburger-btn').click()
  
      cy.get('.nav-menu').should('have.class', 'open')
  
    })
  
    it('Deve fechar o menu ao clicar no overlay', () => {
  
      cy.get('.hamburger-btn').click()
  
      cy.get('.overlay').click()
  
      cy.get('.nav-menu').should('not.have.class', 'open')
  
    })
  
  })