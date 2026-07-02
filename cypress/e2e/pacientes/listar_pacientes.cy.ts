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

   it('deve listar pacientes na tabela', () => {
    // Verifica se a tabela existe
    cy.get('.pacientes-table').should('exist');
    
    // Verifica se há pelo menos uma linha de dados (ajuste conforme seu mock/banco)
    cy.get('.pacientes-table tbody tr').should('have.length.at.least', 1);
  });

  it('deve mostrar a mensagem de lista vazia quando não houver pacientes', () => {
    // Este teste requer que o backend retorne uma lista vazia ou que você use cy.intercept
    cy.intercept('GET', '**/pacientes*', { body: [] }).as('getPacientesVazio');
    cy.reload();
    cy.wait('@getPacientesVazio');
    
    cy.get('.empty-message').should('contain', 'Nenhum paciente cadastrado');
  });