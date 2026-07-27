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

  it('deve preencher a tela de edição corretamente e salvar (O fluxo que consertamos!)', () => {
    // 1. Prepara os mocks específicos para a edição
    cy.intercept('GET', '**/api/agendamentos/1', {
      statusCode: 200,
      body: {
        id: 1,
        pacienteId: 10,
        paciente: { id: 10, nome: 'Gilberto', cpf: '89764091679' },
        tipoComunicacao: 'WHATSAPP',
        destinatario: 'giba@gmail.com',
        message: 'Teste agendar',
        dataHoraAtendimento: '2026-06-22T09:02:00'
      }
    }).as('getAgendamentoId');

    cy.intercept('PUT', '**/api/agendamentos/1', {
      statusCode: 200,
      body: { message: 'Agendamento atualizado com sucesso!' }
    }).as('putAgendamento');

    // 2. Clica em editar na tabela
    cy.contains('Editar').click();
    cy.url().should('include', '/agendamentos/editar/1');
    cy.wait('@getAgendamentoId');

    // 3. Verifica se os dados vieram para a tela corretamente
    cy.contains('Nome: Gilberto').should('be.visible');
    cy.get('select[formControlName="tipoComunicacao"]').should('have.value', 'WHATSAPP');
    cy.get('input[formControlName="destinatario"]').should('have.value', 'giba@gmail.com');

    // 4. Faz uma alteração e salva
    cy.get('select[formControlName="tipoComunicacao"]').select('SMS');
    cy.contains('Atualizar').click();
    cy.wait('@putAgendamento');

    // 5. Verifica o SweetAlert de sucesso
    cy.contains('Agendamento atualizado!').should('be.visible');
  });