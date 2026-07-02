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