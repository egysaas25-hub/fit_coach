describe('Admin Dashboard', () => {
  beforeEach(() => {
    // Log in as admin user before each test
    cy.login('admin1@example.com', 'password123');
  });

  it('should display admin dashboard elements', () => {
    // Check that key dashboard elements are present
    cy.get('h1').contains('Admin Dashboard').should('be.visible');
    cy.get('[data-testid="stats-cards"]').should('be.visible');
    cy.get('[data-testid="recent-activity"]').should('be.visible');
    cy.get('[data-testid="quick-actions"]').should('be.visible');
  });

  it('should display correct statistics', () => {
    // Check that statistics cards show data
    cy.get('[data-testid="total-users-card"]').should('be.visible');
    cy.get('[data-testid="revenue-card"]').should('be.visible');
    cy.get('[data-testid="growth-rate-card"]').should('be.visible');
    cy.get('[data-testid="active-sessions-card"]').should('be.visible');
  });

  it('should navigate to clients page', () => {
    cy.get('[data-testid="clients-link"]').click();
    cy.url().should('include', '/admin/clients');
  });

  it('should navigate to teams page', () => {
    cy.get('[data-testid="teams-link"]').click();
    cy.url().should('include', '/admin/teams');
  });

  it('should navigate to workouts page', () => {
    cy.get('[data-testid="workouts-link"]').click();
    cy.url().should('include', '/admin/workouts');
  });
});