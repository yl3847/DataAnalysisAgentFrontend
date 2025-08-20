import React, { useState } from 'react';
import authService from '../../services/auth';
import './Auth.css';

const EmailConfirmation = ({ email, onConfirmationSuccess, onBackToSignUp }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.confirmSignUp(email, confirmationCode);
      onConfirmationSuccess();
    } catch (error) {
      console.error('Confirmation error:', error);
      setError(error.message || 'Confirmation failed. Please check your code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      await authService.resendConfirmationCode(email);
      alert('Confirmation code has been resent to your email.');
    } catch (error) {
      console.error('Resend error:', error);
      setError('Failed to resend confirmation code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        <p className="verification-instructions">
          We've sent a confirmation code to <strong>{email}</strong>
        </p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="confirmationCode">Confirmation Code</label>
            <input
              type="text"
              id="confirmationCode"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
              placeholder="Enter the 6-digit code"
              maxLength="6"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="auth-footer">
          <button 
            type="button" 
            className="link-button"
            onClick={handleResendCode}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend Code'}
          </button>
          
          <button 
            type="button" 
            className="link-button"
            onClick={onBackToSignUp}
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
