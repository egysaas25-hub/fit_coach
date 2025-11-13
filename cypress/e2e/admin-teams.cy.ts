describe('Admin Teams', () => {
  beforeEach(() => {
    // Log in as admin user before each test
    cy.login('admin1@example.com', 'password123');
    
    // Navigate to teams page
    cy.get('[data-testid="teams-link"]').click();
    cy.url().should('include', '/admin/teams');
  });

  it('should display teams list', () => {
    cy.get('h1').contains('Teams').should('be.visible');
    cy.get('[data-testid="teams-table"]').should('be.visible');
    cy.get('[data-testid="add-team-button"]').should('be.visible');
  });

  it('should add a new team member', () => {
    cy.get('[data-testid="add-team-button"]').click();
    cy.get('[data-testid="team-member-form"]').should('be.visible');
    
    cy.get('input[name="name"]').type('Test Trainer');
    cy.get('input[name="email"]').type('testtrainer@example.com');
    cy.get('input[name="phone"]').type('+1234567890');
    cy.get('select[name="role"]').select('trainer');
    
    cy.get('[data-testid="save-team-member-button"]').click();
    
    // Verify team member was added
    cy.get('[data-testid="teams-table"]').should('contain', 'Test Trainer');
  });

  it('should edit a team member', () => {
    // Click edit button for first team member
    cy.get('[data-testid="edit-team-member-button"]').first().click();
    cy.get('[data-testid="team-member-form"]').should('be.visible');
    
    // Update team member information
    cy.get('input[name="name"]').clear().type('Updated Trainer');
    
    cy.get('[data-testid="save-team-member-button"]').click();
    
    // Verify team member was updated
    cy.get('[data-testid="teams-table"]').should('contain', 'Updated Trainer');
  });

  it('should assign permissions to team member', () => {
    // Click permissions button for first team member
    cy.get('[data-testid="permissions-button"]').first().click();
    cy.get('[data-testid="permissions-modal"]').should('be.visible');
    
    // Select some permissions
    cy.get('[data-testid="permission-checkbox"]').first().check();
    cy.get('[data-testid="permission-checkbox"]').eq(1).check();
    
    cy.get('[data-testid="save-permissions-button"]').click();
    
    // Verify permissions were saved
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});