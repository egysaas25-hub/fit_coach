describe('Admin Login', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/login');
  });

  it('should login admin user successfully', () => {
    cy.get('input[name="email"]').type('admin1@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Verify that we are redirected to the admin dashboard
    cy.url().should('include', '/admin/dashboard');
    
    // Verify that the user is logged in by checking for user-specific elements
    cy.get('[data-testid="user-menu"]').should('be.visible');
    cy.get('[data-testid="admin-sidebar"]').should('be.visible');
  });

  it('should show validation errors for invalid input', () => {
    // Try to submit the form without filling in required fields
    cy.get('button[type="submit"]').click();
    
    // Verify that validation errors are shown
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="password-error"]').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Verify that error message is shown
    cy.get('[data-testid="login-error"]').should('be.visible');
  });

  it('should navigate to forgot password page', () => {
    cy.get('[data-testid="forgot-password-link"]').click();
    cy.url().should('include', '/forgot-password');
  });

  it('should navigate to register page', () => {
    cy.get('[data-testid="register-link"]').click();
    cy.url().should('include', '/register');
  });
});