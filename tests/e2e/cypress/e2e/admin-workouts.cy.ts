describe('Admin Workouts', () => {
  beforeEach(() => {
    // Log in as admin user before each test
    cy.login('admin1@example.com', 'password123');
    
    // Navigate to workouts page
    cy.get('[data-testid="workouts-link"]').click();
    cy.url().should('include', '/admin/workouts');
  });

  it('should display workouts list', () => {
    cy.get('h1').contains('Workouts').should('be.visible');
    cy.get('[data-testid="workouts-table"]').should('be.visible');
    cy.get('[data-testid="create-workout-button"]').should('be.visible');
  });

  it('should create a new workout', () => {
    cy.get('[data-testid="create-workout-button"]').click();
    cy.get('[data-testid="workout-form"]').should('be.visible');
    
    cy.get('input[name="name"]').type('Test Workout');
    cy.get('select[name="difficulty"]').select('Beginner');
    cy.get('input[name="duration"]').type('30');
    
    cy.get('[data-testid="add-exercise-button"]').click();
    cy.get('input[name="exercise-name"]').type('Push-ups');
    cy.get('input[name="sets"]').type('3');
    cy.get('input[name="reps"]').type('10');
    cy.get('[data-testid="save-exercise-button"]').click();
    
    cy.get('[data-testid="save-workout-button"]').click();
    
    // Verify workout was created
    cy.get('[data-testid="workouts-table"]').should('contain', 'Test Workout');
  });

  it('should edit an existing workout', () => {
    // Click edit button for first workout
    cy.get('[data-testid="edit-workout-button"]').first().click();
    cy.get('[data-testid="workout-form"]').should('be.visible');
    
    // Update workout information
    cy.get('input[name="name"]').clear().type('Updated Workout');
    
    cy.get('[data-testid="save-workout-button"]').click();
    
    // Verify workout was updated
    cy.get('[data-testid="workouts-table"]').should('contain', 'Updated Workout');
  });

  it('should filter workouts by difficulty', () => {
    cy.get('[data-testid="difficulty-filter"]').select('Beginner');
    cy.get('[data-testid="workouts-table"]').should('be.visible');
    
    cy.get('[data-testid="difficulty-filter"]').select('Intermediate');
    cy.get('[data-testid="workouts-table"]').should('be.visible');
  });

  it('should search for workouts', () => {
    cy.get('[data-testid="search-input"]').type('Test');
    cy.get('[data-testid="workouts-table"]').should('be.visible');
  });
});