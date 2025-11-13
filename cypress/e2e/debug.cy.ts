describe('Debug Test', () => {
  it('should visit login page', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('select[name="role"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should login as admin', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin1@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('select[name="role"]').select('team_member');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin/dashboard');
  });
});