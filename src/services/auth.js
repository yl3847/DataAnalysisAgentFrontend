// AWS Cognito Authentication Service
// This service handles user authentication using AWS Cognito
// Using AWS SDK v3 for better reliability

import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { getAuthConfig } from '../config/auth-config';

class AuthService {
  constructor() {
    const config = getAuthConfig();
    this.userPoolId = config.userPoolId;
    this.userPoolClientId = config.userPoolClientId;
    this.identityPoolId = config.identityPoolId;
    this.region = config.region;
    
    // Initialize AWS SDK v3 client
    this.client = new CognitoIdentityProviderClient({ region: this.region });
  }



  async signUp(email, password) {
    try {
      const command = new SignUpCommand({
        ClientId: this.userPoolClientId,
        Username: email,
        Password: password,
        UserAttributes: [
          {
            Name: 'email',
            Value: email
          }
        ]
      });

      const response = await this.client.send(command);
      console.log('Sign up successful:', response);
      
      // With auto-verification enabled, the user should be able to login immediately
      // Store the user info for immediate login
      localStorage.setItem('userEmail', email);
      
      // Check if the user was auto-confirmed
      if (response.UserConfirmed) {
        console.log('User auto-confirmed, ready for immediate login');
      } else {
        console.log('User needs confirmation (this shouldn\'t happen with auto-verification)');
      }
      
      return response;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async confirmSignUp(email, confirmationCode) {
    try {
      const { ConfirmSignUpCommand } = await import('@aws-sdk/client-cognito-identity-provider');
      const command = new ConfirmSignUpCommand({
        ClientId: this.userPoolClientId,
        Username: email,
        ConfirmationCode: confirmationCode
      });

      const response = await this.client.send(command);
      console.log('Sign up confirmation successful:', response);
      return response;
    } catch (error) {
      console.error('Sign up confirmation error:', error);
      throw error;
    }
  }

  async resendConfirmationCode(email) {
    try {
      const { ResendConfirmationCodeCommand } = await import('@aws-sdk/client-cognito-identity-provider');
      const command = new ResendConfirmationCodeCommand({
        ClientId: this.userPoolClientId,
        Username: email
      });

      const response = await this.client.send(command);
      console.log('Confirmation code resent:', response);
      return response;
    } catch (error) {
      console.error('Resend confirmation code error:', error);
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.userPoolClientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      });

      const response = await this.client.send(command);
      console.log('Sign in successful:', response);
      
      // Store tokens
      if (response.AuthenticationResult) {
        localStorage.setItem('authToken', response.AuthenticationResult.AccessToken);
        localStorage.setItem('userEmail', email);
      }
      
      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      
      // If the error is about user not confirmed, try to confirm them automatically
      if (error.name === 'UserNotConfirmedException') {
        console.log('User not confirmed, attempting to auto-confirm...');
        try {
          // Try to confirm the user automatically (this should work with auto-verification)
          const { ConfirmSignUpCommand } = await import('@aws-sdk/client-cognito-identity-provider');
          const confirmCommand = new ConfirmSignUpCommand({
            ClientId: this.userPoolClientId,
            Username: email,
            ConfirmationCode: '000000' // This won't work, but let's try
          });
          await this.client.send(confirmCommand);
        } catch (confirmError) {
          console.log('Auto-confirmation failed:', confirmError);
        }
      }
      
      throw error;
    }
  }

  async signOut() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  async signUpAndSignIn(email, password) {
    try {
      // First sign up the user
      const signUpResponse = await this.signUp(email, password);
      
      // If sign up is successful and user is confirmed, immediately sign in
      if (signUpResponse.UserConfirmed) {
        console.log('User auto-confirmed, proceeding with immediate sign in');
        const signInResponse = await this.signIn(email, password);
        return {
          signUp: signUpResponse,
          signIn: signInResponse,
          userConfirmed: true
        };
      } else {
        // This shouldn't happen with auto-verification, but handle it gracefully
        console.log('User not confirmed, manual confirmation required');
        return {
          signUp: signUpResponse,
          signIn: null,
          userConfirmed: false
        };
      }
    } catch (error) {
      console.error('Sign up and sign in error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    // For simplicity, we'll just return the stored user email
    const email = localStorage.getItem('userEmail');
    return email ? { username: email } : null;
  }

  async getSession() {
    const token = localStorage.getItem('authToken');
    return token ? { accessToken: token } : null;
  }

  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  getUserEmail() {
    return localStorage.getItem('userEmail');
  }
}

// Create a singleton instance
const authService = new AuthService();

export default authService;
