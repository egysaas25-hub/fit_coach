describe('WhatsApp Authentication Flow', () => {
  beforeEach(() => {
    // Clear any existing session data
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Registration Flow', () => {
    beforeEach(() => {
      cy.visit('/register');
    });

    it('should register a new user successfully with WhatsApp OTP', () => {
      // Fill in registration form
      cy.get('#workspaceName').type('Test Fitness Studio');
      cy.get('#name').type('Test User');
      cy.get('#email').type('testuser@example.com');
      
      // Select country code
      cy.get('#country').click();
      cy.get('[data-testid="country-code-option"]').contains('+1').click();
      
      // Enter phone number
      cy.get('#phone').type('1234567890');
      
      // Click send OTP button
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Verify OTP modal is opened
      cy.get('[data-testid="otp-modal"]').should('be.visible');
      cy.contains('Enter the 6-digit code').should('be.visible');
      
      // Enter OTP (simulating 123456)
      cy.get('#otp-0').type('1');
      cy.get('#otp-1').type('2');
      cy.get('#otp-2').type('3');
      cy.get('#otp-3').type('4');
      cy.get('#otp-4').type('5');
      cy.get('#otp-5').type('6');
      
      // Click create account button
      cy.get('[data-testid="create-account-button"]').click();
      
      // Verify successful registration and redirection
      cy.url().should('include', '/admin/dashboard');
      cy.contains('Registration successful!').should('be.visible');
    });

    it('should show validation errors for incomplete form', () => {
      // Try to submit without filling required fields
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Verify validation errors
      cy.contains('Please fill all required fields').should('be.visible');
      cy.get('#workspaceName:invalid').should('exist');
      cy.get('#name:invalid').should('exist');
      cy.get('#phone:invalid').should('exist');
    });

    it('should show error for invalid phone number', () => {
      // Fill form with invalid phone number
      cy.get('#workspaceName').type('Test Studio');
      cy.get('#name').type('Test User');
      cy.get('#phone').type('123'); // Too short
      
      // Click send OTP button
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Verify error message
      cy.contains('Please enter a valid phone number').should('be.visible');
    });

    it('should handle OTP resend functionality', () => {
      // Fill in registration form
      cy.get('#workspaceName').type('Test Studio');
      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#phone').type('1234567890');
      
      // Click send OTP button
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Wait for resend timer to expire (mocked to 1 second in test)
      cy.wait(1000);
      
      // Click resend button
      cy.get('[data-testid="resend-otp-button"]').click();
      
      // Verify resend success
      cy.contains('Code sent').should('be.visible');
    });

    it('should handle invalid OTP entry', () => {
      // Fill in registration form
      cy.get('#workspaceName').type('Test Studio');
      cy.get('#name').type('Test User');
      cy.get('#phone').type('1234567890');
      
      // Click send OTP button
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Enter invalid OTP
      cy.get('#otp-0').type('0');
      cy.get('#otp-1').type('0');
      cy.get('#otp-2').type('0');
      cy.get('#otp-3').type('0');
      cy.get('#otp-4').type('0');
      cy.get('#otp-5').type('0');
      
      // Click create account button
      cy.get('[data-testid="create-account-button"]').click();
      
      // Verify error message
      cy.contains('Invalid OTP code').should('be.visible');
    });

    it('should allow editing information from OTP step', () => {
      // Fill in registration form
      cy.get('#workspaceName').type('Test Studio');
      cy.get('#name').type('Test User');
      cy.get('#phone').type('1234567890');
      
      // Click send OTP button
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Click edit information button
      cy.get('[data-testid="edit-information-button"]').click();
      
      // Verify we're back to form step
      cy.get('#workspaceName').should('be.visible');
      cy.get('#name').should('be.visible');
    });
  });

  describe('Login Flow', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should login existing user with WhatsApp OTP', () => {
      // Select country code
      cy.get('#country').click();
      cy.get('[data-testid="country-code-option"]').contains('+1').click();
      
      // Enter phone number
      cy.get('#phone').type('9876543210');
      
      // Click send OTP button
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Verify OTP modal is opened
      cy.get('[data-testid="otp-modal"]').should('be.visible');
      cy.contains('Enter the 6-digit code').should('be.visible');
      
      // Enter OTP (simulating 123456)
      cy.get('#otp-0').type('1');
      cy.get('#otp-1').type('2');
      cy.get('#otp-2').type('3');
      cy.get('#otp-3').type('4');
      cy.get('#otp-4').type('5');
      cy.get('#otp-5').type('6');
      
      // Click verify button
      cy.get('[data-testid="verify-otp-button"]').click();
      
      // Select role
      cy.get('[data-testid="role-selector"]').select('admin');
      
      // Click continue to dashboard
      cy.get('[data-testid="continue-dashboard-button"]').click();
      
      // Verify successful login and redirection
      cy.url().should('include', '/admin/dashboard');
      cy.contains('Phone verified successfully').should('be.visible');
    });

    it('should show validation errors for incomplete login form', () => {
      // Try to submit without entering phone number
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Verify validation error
      cy.contains('Please enter a valid phone number').should('be.visible');
    });

    it('should handle login OTP resend functionality', () => {
      // Enter phone number
      cy.get('#phone').type('9876543210');
      
      // Click send OTP button
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Wait for resend timer to expire
      cy.wait(1000);
      
      // Click resend button
      cy.get('[data-testid="resend-otp-button"]').click();
      
      // Verify resend success
      cy.contains('Code sent').should('be.visible');
    });

    it('should handle invalid login OTP entry', () => {
      // Enter phone number
      cy.get('#phone').type('9876543210');
      
      // Click send OTP button
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Enter invalid OTP
      cy.get('#otp-0').type('0');
      cy.get('#otp-1').type('0');
      cy.get('#otp-2').type('0');
      cy.get('#otp-3').type('0');
      cy.get('#otp-4').type('0');
      cy.get('#otp-5').type('0');
      
      // Click verify button
      cy.get('[data-testid="verify-otp-button"]').click();
      
      // Verify error message
      cy.contains('Invalid OTP code').should('be.visible');
    });

    it('should navigate to registration page from login', () => {
      cy.get('[data-testid="register-link"]').click();
      cy.url().should('include', '/register');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network errors gracefully', () => {
      // Intercept API calls to simulate network errors
      cy.intercept('POST', '/auth/request-otp', {
        statusCode: 500,
        body: {
          error: {
            message: 'Network error. Please try again.'
          }
        }
      }).as('requestOtp');
      
      cy.visit('/register');
      
      // Fill in registration form
      cy.get('#workspaceName').type('Test Studio');
      cy.get('#name').type('Test User');
      cy.get('#phone').type('1234567890');
      
      // Click send OTP button
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Verify error message
      cy.contains('Network error. Please try again.').should('be.visible');
    });

    it('should handle rate limiting', () => {
      // Intercept API calls to simulate rate limiting
      cy.intercept('POST', '/auth/request-otp', {
        statusCode: 429,
        body: {
          error: {
            message: 'Too many requests. Please try again later.'
          }
        }
      }).as('requestOtp');
      
      cy.visit('/login');
      
      // Enter phone number
      cy.get('#phone').type('9876543210');
      
      // Click send OTP button
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Verify rate limit error message
      cy.contains('Too many requests').should('be.visible');
    });

    it('should handle account lockout after failed attempts', () => {
      // Intercept API calls to simulate account lockout
      cy.intercept('POST', '/auth/verify-otp', {
        statusCode: 423,
        body: {
          error: {
            message: 'Account locked. Too many failed attempts.'
          }
        }
      }).as('verifyOtp');
      
      cy.visit('/login');
      
      // Enter phone number
      cy.get('#phone').type('9876543210');
      
      // Click send OTP button
      cy.get('[data-testid="send-otp-button"]').click();
      
      // Enter invalid OTP
      cy.get('#otp-0').type('0');
      cy.get('#otp-1').type('0');
      cy.get('#otp-2').type('0');
      cy.get('#otp-3').type('0');
      cy.get('#otp-4').type('0');
      cy.get('#otp-5').type('0');
      
      // Click verify button
      cy.get('[data-testid="verify-otp-button"]').click();
      
      // Verify lockout message
      cy.contains('Account locked').should('be.visible');
    });
  });
});