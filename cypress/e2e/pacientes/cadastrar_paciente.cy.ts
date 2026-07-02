
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

it('Cadastra paciente', () => {
    cy.get('[data-cy="add-paciente-btn"]').click()

    cy.get('[data-cy="input-nome"]').type('Alexsander Araujo')
    cy.get('[data-cy="input-cpf"]').type('09259855462')
    cy.get('[data-cy="input-data-nascimento"]').type('1999-08-12')
    cy.get('[data-cy="input-genero"]').select('MASCULINO')
    cy.get('[data-cy="input-raca"]').select('AMARELA')
    cy.get('[data-cy="input-telefone"]').type('87992027641')
    cy.get('[data-cy="input-email"]').type('ala1@discente.ifpe.edu.br')
    cy.get('[data-cy="input-cep"]').type('55299537')
    cy.get('[data-cy="input-nome-mae"]').type('Lucia')
    cy.get('[data-cy="input-nome-pai"]').type('France')
    cy.get('[data-cy="btn-salvar"]').click()
    //outros campos

    cy.contains('Paciente cadastrado com sucesso!')
  })