describe('Tela de Listagem de Pacientes - CAPS', () => {
  
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
    cy.get('.card[routerLink="/pacientes"]').click();

    // Verifica se a URL foi alterada para a tela de pacientes
    cy.url().should('include', '/pacientes');
  });

  it('deve exibir o cabeçalho corretamente e testar o redirecionamento da logo', () => {
    cy.get('.header').should('be.visible');
    cy.get('.logo').should('be.visible');
    
    // Testa se o clique na logo leva ao dashboard
    cy.get('.header-left a').click();
    cy.url().should('include', '/dashboard');
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

  it('deve simular a exclusão de um paciente', () => {
    // Captura o nome do primeiro paciente para validar depois
    cy.get('.pacientes-table tbody tr').first().find('td').first().then(($td) => {
      const nomePaciente = $td.text();

      cy.get('.icon-btn.delete').first().click();

      // Se houver um confirm() do navegador:
      cy.on('window:confirm', () => true);

      // Verifica se o nome não está mais na lista (se a exclusão for imediata)
      cy.contains(nomePaciente).should('not.exist');
    });
  });

  it('Cadastra paciente', () => {
    cy.get('[data-cy="add-paciente-btn"]').click()

    cy.get('[data-cy="input-nome"]').type('Alexsander Araujo')
    cy.get('[data-cy="input-cpf"]').type('09259855462')
    cy.get('[data-cy="input-data-nascimento"]').type('1999-08-12')
    cy.get('[data-cy="input-genero"]').select('Masculino')
    cy.get('[data-cy="input-raca"]').select('Amarelo')
    cy.get('[data-cy="input-telefone"]').type('87992027641')
    cy.get('[data-cy="input-email"]').type('ala1@discente.ifpe.edu.br')
    cy.get('[data-cy="input-cep"]').type('55299537')
    cy.get('[data-cy="input-nome-mae"]').type('Lucia')
    cy.get('[data-cy="input-nome-pai"]').type('France')
    cy.get('[data-cy="btn-salvar"]').click()
    //outros campos

    cy.contains('Paciente cadastrado com sucesso!')
  })


  it('deve testar a paginação', () => {
    // Verifica se o botão "Próxima" existe e clica
    if (Cypress.$('.paginacao button:contains("Próxima")').length > 0) {
      cy.get('.paginacao button').contains('Próxima').click();
      cy.get('.paginacao button.ativo').should('contain', '2');
    }
  });
});