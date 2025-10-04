import React, { useState, useEffect } from 'react';
import { ApexBankLogo, FingerprintIcon, SpinnerIcon, ShieldCheckIcon, DevicePhoneMobileIcon } from './Icons';

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
}

type LoginStep = 'credentials' | 'securityCheck' | 'preMfaWarning' | 'mfa';

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [step, setStep] = useState<LoginStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [error, setError] = useState('');

  const [securityCheckMessage, setSecurityCheckMessage] = useState('Initializing secure session...');

  useEffect(() => {
    if (step === 'securityCheck') {
      const messages = [
        'Establishing secure connection...',
        'Encrypting session data...',
        'Verifying device integrity...',
        'Finalizing security handshake...'
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
      }, 800);

      return () => clearInterval(interval);
    }
  }, [step]);

  const handleAuthSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    // For this demo, any non-empty fields will work for the standard login.
    if (e && step === 'credentials' && !email && !password) {
        setError('Please enter both email and password.');
        return;
    }
    setStep('securityCheck');
  };

  const handleBiometricLogin = () => {
      setError('');
      setIsBiometricScanning(true);
      // Simulate biometric scan
      setTimeout(() => {
        setIsBiometricScanning(false);
        // Proceed to the next step
        handleAuthSubmit();
      }, 1500); // 1.5 second delay
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-primary"/>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Extra Security Step</h2>
            <p className="text-slate-500 text-sm mt-2 px-4">
                Multi-Factor Authentication adds a critical layer of security. This ensures only you can access your account, even if someone else knows your password.
            </p>
            <button 
                onClick={() => setStep('mfa')}
                className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
                Continue to Verification
            </button>
          </div>
        );

      case 'mfa':
        return (
           <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                  <DevicePhoneMobileIcon className="w-8 h-8 text-primary"/>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Verification Required</h2>
              <p className="text-slate-500 text-sm">For your security, please enter the 6-digit code sent to your registered device.</p>
            </div>
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div>
                <label htmlFor="mfaCode" className="block text-sm font-medium text-slate-700 sr-only">Verification Code</label>
                <input 
                  type="text" 
                  id="mfaCode" 
                  value={mfaCode} 
                  onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                  className="mt-1 block w-full text-center text-2xl tracking-[.5em] rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary" 
                  required 
                  placeholder="------"
                  maxLength={6}
                />
              </div>
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
              >
                {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Verify & Sign In'}
              </button>
            </form>
          </>
        );

      case 'credentials':
      default:
        return (
          <>
            <div className="text-center mb-6">
              <div className="inline-block">
                <ApexBankLogo />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mt-2">Welcome Back</h2>
              <p className="text-slate-500 text-sm">Sign in to access your account.</p>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary" required placeholder="user@apexbank.com" />
              </div>
              <div>
                <label htmlFor="password"className="block text-sm font-medium text-slate-700">Password</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary" required placeholder="password123" />
              </div>
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Sign In
              </button>
            </form>
            <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>
            <div className="h-[44px]">
              {isBiometricScanning ? (
                  <div className="flex items-center justify-center h-full space-x-3">
                      <SpinnerIcon className="w-5 h-5 text-primary" />
                      <p className="text-sm text-slate-600 animate-pulse">Scanning...</p>
                  </div>
              ) : (
                  <button
                      onClick={handleBiometricLogin}
                      className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                      <FingerprintIcon className="w-5 h-5"/>
                      <span>Sign in with Biometrics</span>
                  </button>
              )}
            </div>
          </>
        );
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm m-4 relative transform transition-all duration-300 scale-100 animate-fade-in-up">
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