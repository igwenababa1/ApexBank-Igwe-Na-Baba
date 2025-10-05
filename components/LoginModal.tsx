

import React, { useState, useEffect } from 'react';
import { ApexBankLogo, FingerprintIcon, SpinnerIcon, ShieldCheckIcon, DevicePhoneMobileIcon, EnvelopeIcon, CheckCircleIcon, FaceIdIcon } from './Icons';
import { 
    sendSmsNotification, 
    sendTransactionalEmail, 
    generateOtpEmail, 
    generateOtpSms 
} from '../services/notificationService';

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
  onSwitchToCreateAccount: () => void;
}

type LoginStep = 'credentials' | 'securityCheck' | 'preMfaWarning' | 'mfa';

const USER_EMAIL = "eleanor.vance@apexbank.com";
const USER_NAME = "Eleanor Vance";
const USER_PHONE = "+1-555-012-1234";
const RESEND_COOLDOWN_SECONDS = 30;

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, onSwitchToCreateAccount }) => {
  const [step, setStep] = useState<LoginStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [error, setError] = useState('');

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricSupportMessage, setBiometricSupportMessage] = useState('Sign in with biometrics');
  const [securityCheckMessage, setSecurityCheckMessage] = useState('Initializing secure session...');
  
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showSentConfirmation, setShowSentConfirmation] = useState(false);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      try {
        if (!window.PublicKeyCredential || !(await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())) {
          setIsBiometricSupported(false);
          setBiometricSupportMessage('Biometrics not supported or not set up on this device.');
          return;
        }

        // Proactively check for permissions. This is crucial for sandboxed environments like iframes.
        if (navigator.permissions && navigator.permissions.query) {
          // FIX: The permission name 'publickey-credentials-get' is valid for WebAuthn but not yet
          // part of the standard TypeScript DOM library definitions for `PermissionName`.
          // Casting to `any` bypasses the type check for this specific, known-valid string.
          const permission = await navigator.permissions.query({ name: 'publickey-credentials-get' } as any);
          if (permission.state === 'denied') {
            setIsBiometricSupported(false);
            setBiometricSupportMessage('Biometric login is disabled by your browser\'s security policy in this context.');
            return;
          }
        }
        
        setIsBiometricSupported(true);

      } catch (e) {
        console.warn('Biometric support check failed:', e);
        setIsBiometricSupported(false);
        setBiometricSupportMessage('Biometric support is not available.');
      }
    };
    checkBiometricSupport();
  }, []);

  useEffect(() => {
    if (step === 'securityCheck') {
      const messages = [
        'Establishing secure TLS 1.3 tunnel...',
        'Verifying device fingerprint...',
        'Checking against global threat intelligence...',
        'Initializing end-to-end encrypted session...',
        'Security handshake complete.'
      ];
      let messageIndex = 0;
      const interval = setInterval(() => {
        if (messageIndex < messages.length) {
          setSecurityCheckMessage(messages[messageIndex]);
          messageIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => setStep('preMfaWarning'), 500);
        }
      }, 750);

      return () => clearInterval(interval);
    }
  }, [step]);
  
  const sendOtpCodes = () => {
    // Simulate sending OTP alerts
    const { subject, body } = generateOtpEmail(USER_NAME);
    sendTransactionalEmail(USER_EMAIL, subject, body);
    sendSmsNotification(USER_PHONE, generateOtpSms());

    // Show confirmation message
    setShowSentConfirmation(true);
    setTimeout(() => {
        setShowSentConfirmation(false);
    }, 3000); // Hide after 3 seconds
  };
  
  // Effect to trigger OTP sending and start cooldown when MFA step is shown
  useEffect(() => {
    if (step === 'mfa') {
      sendOtpCodes();
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    }
  }, [step]);
  
  // Effect for the cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);
  
  const handleResendCode = () => {
    if (resendCooldown === 0) {
      sendOtpCodes();
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    }
  };

  const handleAuthSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    // For this demo, any non-empty fields will work for the standard login.
    if (e && step === 'credentials' && !email && !password) {
        setError('Please enter both email/phone and password.');
        return;
    }
    setStep('securityCheck');
  };

  const handleBiometricLogin = async () => {
    if (!isBiometricSupported) {
        setError("Biometric authentication is not supported on this browser or device.");
        return;
    }
    
    setError('');
    setIsBiometricScanning(true);

    try {
        // In a real application, challenge and credential ID would come from the server.
        // For this demo, we mock them to trigger the browser UI.
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        
        // This credential ID would have been stored on the server during registration.
        // We provide a mock ID here to satisfy the API's requirements for the demo.
        const mockCredentialId = new Uint8Array(64);

        const options: PublicKeyCredentialRequestOptions = {
            challenge,
            allowCredentials: [{
                type: 'public-key',
                id: mockCredentialId,
                transports: ['internal'],
            }],
            userVerification: 'required',
        };

        const assertion = await navigator.credentials.get({ publicKey: options });

        // In a real app, 'assertion' would be sent to the server for verification.
        // Since verification is successful, we proceed with login.
        console.log('Biometric authentication successful:', assertion);
        handleAuthSubmit();

    } catch (err: any) {
        console.error('Biometric authentication error:', err);
        if (err.name === 'NotAllowedError') {
            setError('Authentication was cancelled.');
        } else if (err.name === 'NotSupportedError') {
            setError('Biometrics are not supported on this device.');
        } else if (err.name === 'SecurityError') {
            // This specifically handles Permissions Policy failures in cross-origin iframes.
            setError('Biometric login is blocked by security policies. This can happen in embedded windows.');
        }
        else {
            setError('No biometric credential found. Please use your password.');
        }
    } finally {
        setIsBiometricScanning(false);
    }
  };
  
  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // Simulate API call for MFA verification
    setTimeout(() => {
      if (mfaCode.length === 6) {
        onLogin();
      } else {
        setError('Please enter a valid 6-digit code.');
        setIsLoading(false);
      }
    }, 1000);
  };

  const renderContent = () => {
    switch(step) {
      case 'securityCheck':
        return (
          <div className="text-center p-8">
            <div className="flex justify-center items-center mb-4">
               <SpinnerIcon className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Security Scan in Progress</h2>
            <p className="text-slate-500 text-sm mt-2 transition-opacity duration-300">{securityCheckMessage}</p>
          </div>
        );
      
      case 'preMfaWarning':
        return (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4 shadow-digital">
                <ShieldCheckIcon className="w-8 h-8 text-primary"/>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Extra Security Step</h2>
            <p className="text-slate-500 text-sm mt-2 px-4">
                Multi-Factor Authentication adds a critical layer of security. This ensures only you can access your account, even if someone else knows your password.
            </p>
            <button 
                onClick={() => setStep('mfa')}
                className="mt-6 w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-primary shadow-md hover:shadow-lg transition-shadow"
            >
                Continue to Verification
            </button>
          </div>
        );

      case 'mfa':
        // Mask the phone number for display, e.g., +1-***-***-1234
        const maskedPhone = USER_PHONE.replace(/(\d{3})-(\d{3})/, '***-***');
        return (
           <>
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4 shadow-digital">
                    <DevicePhoneMobileIcon className="w-8 h-8 text-primary"/>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Phone Verification</h2>
                <p className="text-slate-500 text-sm">
                    For your security, please enter the 6-digit code sent via SMS to your registered phone number: <br/>
                    <strong className="font-semibold text-slate-600">{maskedPhone}</strong>
                </p>
            </div>
            
            {showSentConfirmation && (
              <div className="bg-green-100 text-green-800 text-sm font-medium p-3 rounded-lg text-center mb-4 shadow-digital-inset flex items-center justify-center space-x-2" role="alert">
                <CheckCircleIcon className="w-5 h-5" />
                <span>Verification code sent!</span>
              </div>
            )}

            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div>
                <label htmlFor="mfaCode" className="block text-sm font-medium text-slate-700 sr-only">Verification Code</label>
                <input 
                  type="text" 
                  id="mfaCode" 
                  value={mfaCode} 
                  onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                  className="mt-1 block w-full bg-slate-200 border-0 p-3 text-center text-2xl tracking-[.5em] rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400" 
                  required 
                  placeholder="------"
                  maxLength={6}
                />
              </div>
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-primary shadow-md hover:shadow-lg disabled:opacity-50 transition-shadow"
              >
                {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Verify & Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0}
                className="text-sm font-medium text-primary hover:underline disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Did not receive a code? Resend'}
              </button>
            </div>
          </>
        );

      case 'credentials':
      default:
        return (
          <>
            <div className="text-center mb-6">
              <div className="inline-block p-2 rounded-full shadow-digital">
                <ApexBankLogo />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mt-2">Welcome Back</h2>
              <p className="text-slate-500 text-sm">Sign in to access your account.</p>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email or Phone Number</label>
                <input type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400" required placeholder="Email or Phone Number" />
              </div>
              <div>
                <label htmlFor="password"className="block text-sm font-medium text-slate-700">Password</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400" required placeholder="password123" />
              </div>
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <button type="submit" className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-primary shadow-md hover:shadow-lg">
                Sign In
              </button>
            </form>
            <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-slate-300"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400">OR</span>
                <div className="flex-grow border-t border-slate-300"></div>
            </div>
            <div className="h-[44px]">
              {isBiometricScanning ? (
                  <div className="flex items-center justify-center h-full space-x-3">
                      <SpinnerIcon className="w-5 h-5 text-primary" />
                      <p className="text-sm text-slate-600 animate-pulse">Authenticating...</p>
                  </div>
              ) : (
                  <button
                      onClick={handleBiometricLogin}
                      disabled={!isBiometricSupported || isBiometricScanning}
                      className="w-full flex justify-center items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium text-slate-700 bg-slate-200 shadow-digital active:shadow-digital-inset disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
                      title={biometricSupportMessage}
                  >
                      <FaceIdIcon className="w-5 h-5"/>
                      <FingerprintIcon className="w-5 h-5"/>
                      <span>Sign in with Biometrics</span>
                  </button>
              )}
            </div>
             <div className="mt-6 text-center text-sm">
                <p className="text-slate-600">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToCreateAccount} className="font-medium text-primary hover:underline">
                        Create an account
                    </button>
                </p>
            </div>
          </>
        );
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-slate-200 rounded-2xl shadow-digital p-8 w-full max-w-sm m-4 relative transform transition-all duration-300 scale-100 animate-fade-in-up">
        {renderContent()}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
       <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};