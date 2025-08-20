import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import EmailConfirmation from './EmailConfirmation';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const handleLoginSuccess = () => {
    onAuthSuccess();
  };

  const handleSignUpSuccess = () => {
    // With auto-verification, user is already logged in after sign-up
    onAuthSuccess(); // Redirect to main app immediately
  };

  const handleShowEmailConfirmation = (email) => {
    setPendingEmail(email);
    setShowEmailConfirmation(true);
  };

  const handleEmailConfirmationSuccess = () => {
    setShowEmailConfirmation(false);
    setPendingEmail('');
    alert('Email verified successfully! You can now log in.');
    setIsLogin(true);
  };

  const handleBackToSignUp = () => {
    setShowEmailConfirmation(false);
    setPendingEmail('');
  };

  const switchToSignUp = () => {
    setIsLogin(false);
    setShowEmailConfirmation(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setShowEmailConfirmation(false);
  };

  return (
    <div className="auth-wrapper">
      {showEmailConfirmation ? (
        <EmailConfirmation
          email={pendingEmail}
          onConfirmationSuccess={handleEmailConfirmationSuccess}
          onBackToSignUp={handleBackToSignUp}
        />
      ) : isLogin ? (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignUp={switchToSignUp}
        />
      ) : (
        <SignUpForm 
          onSignUpSuccess={handleSignUpSuccess}
          onSwitchToLogin={switchToLogin}
          onShowEmailConfirmation={handleShowEmailConfirmation}
        />
      )}
    </div>
  );
};

export default Auth;
