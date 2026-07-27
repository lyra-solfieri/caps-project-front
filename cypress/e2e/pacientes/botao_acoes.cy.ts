beforeEach(() => {
    // Visita a página de login antes de cada teste
    cy.visit('http://localhost:4200/login');

    // Realiza o login
    cy.get('input[name=email]').type('alexsanderthorne@gmail.com');
    cy.get('input[name=password]').type('teste1');
    cy.get('button[type=submit]').click();

    // Aguarda o redirecionamento para o dashboard
    cy.url().should('include', '/dashboard');

    // Clica no card de pacientes para acessar a tela de pacientes
    cy.get('.nav-card[routerLink="/pacientes"]').click();

    // Verifica se a URL foi alterada para a tela de pacientes
    cy.url().should('include', '/pacientes');
  });
  
it('deve verificar se os tooltips dos botões de ação estão funcionando', () => {
    // No Cypress, o hover é simulado verificando o atributo ou usando trigger
    cy.get('.icon-btn.edit').first().trigger('mouseover');
    
    // Verifica se o pseudo-elemento ou o atributo data-tooltip está presente
    cy.get('.icon-btn.edit').first()
      .should('have.attr', 'data-tooltip', 'Editar');
  });

  it('deve abrir a tela de edição ao clicar no botão editar', () => {
    cy.get('.icon-btn.edit').first().click();
    cy.url().should('include', '/editar'); // Ajuste conforme sua rota de edição
  });