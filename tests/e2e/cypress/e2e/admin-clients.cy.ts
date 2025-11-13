describe('Admin Clients', () => {
  beforeEach(() => {
    // Log in as admin user before each test
    cy.login('admin1@example.com', 'password123');
    
    // Navigate to clients page
    cy.get('[data-testid="clients-link"]').click();
    cy.url().should('include', '/admin/clients');
  });

  it('should display clients list', () => {
    cy.get('h1').contains('Clients').should('be.visible');
    cy.get('[data-testid="clients-table"]').should('be.visible');
    cy.get('[data-testid="add-client-button"]').should('be.visible');
  });

  it('should filter clients by status', () => {
    cy.get('[data-testid="status-filter"]').select('Active');
    cy.get('[data-testid="clients-table"]').should('be.visible');
    
    cy.get('[data-testid="status-filter"]').select('Lead');
    cy.get('[data-testid="clients-table"]').should('be.visible');
  });

  it('should search for clients', () => {
    cy.get('[data-testid="search-input"]').type('John');
    cy.get('[data-testid="clients-table"]').should('be.visible');
  });

  it('should add a new client', () => {
    cy.get('[data-testid="add-client-button"]').click();
    cy.get('[data-testid="client-form"]').should('be.visible');
    
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('Client');
    cy.get('input[name="email"]').type('testclient@example.com');
    cy.get('input[name="phone"]').type('+1234567890');
    
    cy.get('[data-testid="save-client-button"]').click();
    
    // Verify client was added
    cy.get('[data-testid="clients-table"]').should('contain', 'Test Client');
  });

  it('should edit an existing client', () => {
    // Click edit button for first client
    cy.get('[data-testid="edit-client-button"]').first().click();
    cy.get('[data-testid="client-form"]').should('be.visible');
    
    // Update client information
    cy.get('input[name="firstName"]').clear().type('Updated');
    cy.get('input[name="lastName"]').clear().type('Client');
    
    cy.get('[data-testid="save-client-button"]').click();
    
    // Verify client was updated
    cy.get('[data-testid="clients-table"]').should('contain', 'Updated Client');
  });
});