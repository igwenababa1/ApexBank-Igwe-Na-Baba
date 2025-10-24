// FIX: Corrected import statement. 'useState' and 'useEffect' are now imported from 'react',
// and the invalid URL import has been removed, resolving multiple errors.
import React, { useState, useEffect } from 'react';
import { 
    ApexBankLogo, 
    LockClosedIcon,
    EnvelopeIcon,
    ArrowRightIcon,
    FingerprintIcon,
    FaceIdIcon,
    SpinnerIcon,
    DevicePhoneMobileIcon
} from './Icons';
import { LoginModal } from './LoginModal';
import { AccountCreationModal } from './AccountCreationModal';
import { 
    sendSmsNotification, 
    sendTransactionalEmail, 
    generateOtpEmail, 
    generateOtpSms 
} from '../services/notificationService';

interface WelcomeProps {
  onLogin: (isNewAccount?: boolean) => void;
}

type LoginStep = 'username' | 'password' | 'security_check' | 'mfa';

const USER_EMAIL = "randy.m.chitwood@apexbank.com";
const USER_NAME = "Randy M. Chitwood";
const USER_PHONE = "+1-555-012-1234";

const securityCheckMessages = [
    'Initializing secure session...',
    'Establishing TLS 1.3 tunnel...',
    'Verifying device fingerprint...',
    'Checking against threat intelligence...',
    'Security handshake complete.'
];

export const Welcome: React.FC<WelcomeProps> = ({ onLogin }) => {
  const [step, setStep] = useState<LoginStep>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [mfaCode, setMfaCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [securityMessageIndex, setSecurityMessageIndex] = useState(0);

  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);

  useEffect(() => {
    if (step === 'security_check') {
      setIsLoading(true);
      const interval = setInterval(() => {
        setSecurityMessageIndex(prev => {
          if (prev >= securityCheckMessages.length - 1) {
            clearInterval(interval);
            setTimeout(() => setStep('mfa'), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
        setIsLoading(false);
        setSecurityMessageIndex(0);
    }
  }, [step]);
  
  const handleUsernameSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (!username.trim()) {
          setError('Please enter your username.');
          return;
      }
      setIsLoading(true);
      // Simulate validation
      setTimeout(() => {
          setIsLoading(false);
          setStep('password');
      }, 500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (!password) {
          setError('Please enter your password.');
          return;
      }
      setStep('security_check');
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
  
  const handleBiometricLogin = async () => {
    // Biometric login logic (simplified from LoginModal)
    setError('');
    setIsLoading(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate biometric prompt
        setStep('security_check');
    } catch (err) {
        setError('Biometric authentication failed.');
        setIsLoading(false);
    }
  };

  const renderUsernameStep = () => (
    <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Sign In to ApexBank</h2>
        <p className="text-sm text-slate-500 mb-6">Enter your username to get started.</p>
        <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-slate-200 p-3 pl-10 rounded-md shadow-digital-inset"
                    placeholder="Username"
                    autoFocus
                />
            </div>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-700">Remember me</label>
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-primary shadow-md hover:shadow-lg disabled:opacity-50"
            >
                {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Sign In'}
            </button>
        </form>
        <div className="mt-6 text-center text-sm space-y-2">
            <button className="font-medium text-primary hover:underline">Forgot Username or Password?</button>
            <p className="text-slate-600">
                New to ApexBank?{' '}
                <button onClick={() => setIsCreateAccountModalOpen(true)} className="font-medium text-primary hover:underline">
                    Open an Account
                </button>
            </p>
        </div>
    </div>
  );
  
  const renderPasswordStep = () => (
     <div className="animate-fade-in-up">
        <button onClick={() => setStep('username')} className="text-sm font-medium text-primary hover:underline mb-4">&larr; Back</button>
        <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold">{username.charAt(0).toUpperCase()}</div>
            <div>
                <p className="font-semibold text-slate-800">{username}</p>
                <p className="text-xs text-slate-500">Enter your password to continue</p>
            </div>
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
             <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-200 p-3 pl-10 rounded-md shadow-digital-inset"
                    placeholder="Password"
                    autoFocus
                />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-primary shadow-md hover:shadow-lg disabled:opacity-50"
            >
                {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Sign In'}
            </button>
        </form>
        <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400">OR</span>
            <div className="flex-grow border-t border-slate-300"></div>
        </div>
        <button
            onClick={handleBiometricLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium text-slate-700 bg-slate-200 shadow-digital active:shadow-digital-inset disabled:opacity-50"
        >
            <FaceIdIcon className="w-5 h-5"/>
            <FingerprintIcon className="w-5 h-5"/>
            <span>Sign in with Biometrics</span>
        </button>
     </div>
  );
  
  const renderSecurityCheckStep = () => (
      <div className="text-center p-8 animate-fade-in">
        <div className="relative w-24 h-24 mx-auto mb-4">
            <SpinnerIcon className="w-full h-full text-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
                <LockClosedIcon className="w-10 h-10 text-primary/70"/>
            </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Security Scan in Progress</h2>
        <p className="text-slate-500 text-sm mt-2 transition-opacity duration-300">{securityCheckMessages[securityMessageIndex]}</p>
      </div>
  );
  
  const renderMfaStep = () => (
      <div className="animate-fade-in-up">
        <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4 shadow-digital">
                <DevicePhoneMobileIcon className="w-8 h-8 text-primary"/>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Phone Verification</h2>
            <p className="text-slate-500 text-sm">
                For your security, enter the 6-digit code sent via SMS to your registered phone.
            </p>
        </div>
        <form onSubmit={handleMfaSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              value={mfaCode} 
              onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
              className="mt-1 block w-full bg-slate-200 p-3 text-center text-2xl tracking-[.5em] rounded-md shadow-digital-inset" 
              required 
              placeholder="------"
              maxLength={6}
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-primary shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Verify & Sign In'}
          </button>
        </form>
    </div>
  );

  const renderContent = () => {
      switch(step) {
          case 'username': return renderUsernameStep();
          case 'password': return renderPasswordStep();
          case 'security_check': return renderSecurityCheckStep();
          case 'mfa': return renderMfaStep();
          default: return null;
      }
  }

  return (
    <>
      <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
            <div className="text-center mb-6">
                <div className="inline-block p-2 rounded-full shadow-digital">
                    <ApexBankLogo />
                </div>
            </div>

            <div className="bg-slate-200 rounded-2xl shadow-digital p-8">
                {renderContent()}
            </div>
            
            <footer className="mt-8 text-center text-xs text-slate-500 space-x-4">
                <a href="#" className="hover:underline">Privacy</a>
                <a href="#" className="hover:underline">Security Center</a>
                <a href="#" className="hover:underline">Contact Us</a>
            </footer>
        </div>
      </div>
      {isCreateAccountModalOpen && (
        <AccountCreationModal
            onClose={() => setIsCreateAccountModalOpen(false)}
            onCreateAccountSuccess={() => {
                setIsCreateAccountModalOpen(false);
                onLogin(true);
            }}
        />
      )}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>
    </>
  );
};