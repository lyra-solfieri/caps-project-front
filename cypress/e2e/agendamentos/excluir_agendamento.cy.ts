beforeEach(() => {
    // 1. Realiza o login antes de cada teste
    cy.visit('http://localhost:4200/login');
    cy.get('input[name=email]').type('alexsanderthorne@gmail.com');
    cy.get('input[name=password]').type('teste1');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/dashboard');

    // 2. Mocks globais para a listagem
    cy.intercept('GET', '**/api/agendamentos', {
      statusCode: 200,
      body: [
        {
          id: 1,
          paciente: { id: 10, nome: 'Gilberto', cpf: '89764091679' },
          user: { nome: 'Alexsander', email: 'alexsanderthorne@gmail.com' },
          destinatario: 'giba@gmail.com',
          message: 'Teste inicial',
          tipoComunicacao: 'WHATSAPP',
          dataHoraAtendimento: '2026-06-22T09:02:00'
        }
      ]
    }).as('getAgendamentos');

    // 3. Acessa a tela de agendamentos
    cy.get('.nav-card[routerLink="/agendamentos"]').click();
    cy.url().should('include', '/agendamentos');
    cy.wait('@getAgendamentos');
  });
  
  it('deve abrir modal de exclusão e deletar com sucesso', () => {
    cy.intercept('DELETE', '**/api/agendamentos/1', {
      statusCode: 204
    }).as('deleteAgendamento');

    // Clica no botão de excluir
    cy.contains('Excluir').click();

    // Verifica se o SweetAlert abriu (Baseado no seu código anterior de pacientes)
    cy.get('.swal2-popup').should('be.visible');
    cy.contains('Sim, excluir').click();

    cy.wait('@deleteAgendamento');
    cy.contains('Excluído!', { matchCase: false }).should('be.visible');
  });