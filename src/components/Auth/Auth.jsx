import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import EmailConfirmation from './EmailConfirmation';
import './Auth.css';

const Auth = ({ onAuthSuccess, isModal = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const handleLoginSuccess = () => {
    onAuthSuccess();
  };

  const handleSignUpSuccess = () => {
    // After sign-up, switch to login form instead of redirecting to main app
    setIsLogin(true);
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
    <div className={isModal ? "auth-wrapper-modal" : "auth-wrapper"}>
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
          isModal={isModal}
        />
      ) : (
        <SignUpForm 
          onSignUpSuccess={handleSignUpSuccess}
          onSwitchToLogin={switchToLogin}
          onShowEmailConfirmation={handleShowEmailConfirmation}
          isModal={isModal}
        />
      )}
    </div>
  );
};

export default Auth;
