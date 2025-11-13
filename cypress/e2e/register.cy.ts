describe('Registration Flow', () => {
  beforeEach(() => {
    // Visit the registration page before each test
    cy.visit('/register');
  });

  it('should register a new admin user successfully', () => {
    // Fill in the registration form
    cy.get('input[name="name"]').type('Test Admin');
    cy.get('input[name="email"]').type('testadmin@example.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="phone"]').type('+1234567890');
    
    // Select admin role (team_member for admin access)
    cy.get('select[name="role"]').select('team_member');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify that we are redirected to the admin dashboard
    cy.url().should('include', '/admin/dashboard');
    
    // Verify that the user is logged in by checking for user-specific elements
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('should register a new client user successfully', () => {
    // Fill in the registration form
    cy.get('input[name="name"]').type('Test Client');
    cy.get('input[name="email"]').type('testclient@example.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="phone"]').type('+1234567891');
    
    // Select client role
    cy.get('select[name="role"]').select('customer');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify that we are redirected to the client dashboard
    cy.url().should('include', '/client/dashboard');
    
    // Verify that the user is logged in by checking for user-specific elements
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('should show validation errors for invalid input', () => {
    // Try to submit the form without filling in required fields
    cy.get('button[type="submit"]').click();
    
    // Verify that validation errors are shown
    cy.get('[data-testid="name-error"]').should('be.visible');
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="password-error"]').should('be.visible');
    cy.get('[data-testid="phone-error"]').should('be.visible');
  });
});