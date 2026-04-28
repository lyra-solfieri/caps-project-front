describe('Filtro de Pesquisa - Tela de Pacientes', () => {
  
    beforeEach(() => {
        cy.visit('http://localhost:4200/login');

        cy.intercept('GET', '**/pacientes*', {
            statusCode: 200,
            body: {
                content: [
                    { id: 1, nome: 'Alexsander', cpf: '092.598.554-62', dataNascimento: '1990-01-01', email: 'alex@test.com' },
                    { id: 2, nome: 'Jeremy', cpf: '111.111.111-11', dataNascimento: '1985-05-05', email: 'jeremy@test.com' },
                    { id: 3, nome: 'Suzan', cpf: '222.222.222-22', dataNascimento: '1992-08-08', email: 'suzan@test.com' }
                ],
                totalPages: 1,
                totalElements: 3,
                first: true,
                last: true
            }
        }).as('getPacientes');

        cy.get('input[name=email]').type('alexsanderthorne@gmail.com');
        cy.get('input[name=password]').type('teste1');
        cy.get('button[type=submit]').click();

        cy.url().should('include', '/dashboard');
        cy.get('.nav-card[routerLink="/pacientes"]').click();

        cy.wait('@getPacientes');
    });
    it('deve filtrar pacientes pelo nome corretamente', () => {
        cy.get('.search-box input').type('Alexsander');
        
        cy.get('[data-cy="paciente-row"]').should('have.length', 1)
        .and('contain', 'Alexsander');
    });

    it('deve ser case-insensitive (ignorar maiúsculas/minúsculas)', () => {
        cy.get('.search-box input').type('aLeXsaNdEr');
        
        cy.get('[data-cy="paciente-row"]').should('have.length', 1)
        .and('contain', 'Alexsander');
    });

    it('deve restaurar a lista completa ao limpar o campo de busca', () => {
        cy.get('.search-box input').type('Alex');
        cy.get('[data-cy="paciente-row"]').should('have.length', 1);
        
        cy.get('.search-box input').clear();
        
        // Testar com dados realmente carregados, aqui estamos usando o mock, então sabemos que tem 3 pacientes
        cy.get('[data-cy="paciente-row"]').should('have.length', 3);
    });

    it('deve filtrar pelo CPF mesmo sem pontos e traços', () => {
        // Digita o CPF limpo (o código deve tratar o replace)
        cy.get('.search-box input').type('09259855462');
        
        cy.get('.pacientes-table tbody tr').should('have.length', 1)
        .and('contain', '092.598.554-62');
        cy.contains('Alexsander').should('be.visible');
    });

    it('deve exibir mensagem de lista vazia se não encontrar nada', () => {
        cy.get('.search-box input').type('Paciente Inexistente');
        
        cy.get('.pacientes-table tbody tr').should('not.exist');
        cy.get('.empty-message').should('be.visible')
        .and('contain', 'Nenhum paciente cadastrado');
    });
    
});
