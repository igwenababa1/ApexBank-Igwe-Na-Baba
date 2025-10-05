import React, { useState, useEffect } from 'react';
import { SpinnerIcon, DevicePhoneMobileIcon, CheckCircleIcon } from './Icons';

interface Setup2FAModalProps {
    onClose: () => void;
    onEnable: () => void;
}

type Step = 'info' | 'verify' | 'success';

export const Setup2FAModal: React.FC<Setup2FAModalProps> = ({ onClose, onEnable }) => {
    const [step, setStep] = useState<Step>('info');
    const [phone, setPhone] = useState('+15550121234'); // Pre-fill for demo
    const [otp, setOtp] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleSendCode = () => {
        setIsProcessing(true);
        // Simulate sending code
        setTimeout(() => {
            setIsProcessing(false);
            setStep('verify');
        }, 1000);
    };

    const handleVerifyCode = () => {
        setError('');
        setIsProcessing(true);
        setTimeout(() => {
            if (otp.length === 6) { // Demo check
                setIsProcessing(false);
                setStep('success');
            } else {
                setError('Invalid code. Please enter the 6-digit code.');
                setIsProcessing(false);
            }
        }, 1000);
    };
    
    const handleFinish = () => {
        onEnable();
        onClose();
    };

    const renderContent = () => {
        switch (step) {
            case 'info':
                return (
                    <>
                        <p className="text-sm text-slate-600 mb-4">Enter your mobile number to receive a verification code. This will be used as a second factor for authentication.</p>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
                            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset" />
                        </div>
                        <button onClick={handleSendCode} disabled={isProcessing} className="w-full mt-6 py-3 text-white bg-primary rounded-lg font-semibold shadow-md flex items-center justify-center">
                            {isProcessing ? <SpinnerIcon className="w-5 h-5"/> : 'Send Verification Code'}
                        </button>
                    </>
                );
            case 'verify':
                return (
                    <>
                        <p className="text-sm text-slate-600 mb-4">We've sent a 6-digit code to {phone}. Please enter it below.</p>
                        <div>
                             <label htmlFor="otp" className="block text-sm font-medium text-slate-700 sr-only">Verification Code</label>
                            <input type="text" id="otp" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full bg-slate-200 p-3 rounded-md shadow-digital-inset text-center text-2xl tracking-[.5em]" maxLength={6} placeholder="------"/>
                            {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
                        </div>
                         <button onClick={handleVerifyCode} disabled={isProcessing} className="w-full mt-6 py-3 text-white bg-primary rounded-lg font-semibold shadow-md flex items-center justify-center">
                            {isProcessing ? <SpinnerIcon className="w-5 h-5"/> : 'Verify Code'}
                        </button>
                    </>
                );
            case 'success':
                 return (
                    <div className="text-center">
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800">2FA Enabled!</h3>
                        <p className="text-sm text-slate-600 mt-2">Your account is now more secure.</p>
                        <button onClick={handleFinish} className="w-full mt-6 py-3 text-white bg-primary rounded-lg font-semibold shadow-md">
                            Done
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-slate-200 rounded-2xl shadow-digital p-8 w-full max-w-md m-4">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4 shadow-digital">
                        <DevicePhoneMobileIcon className="w-8 h-8 text-primary"/>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Setup Two-Factor Authentication</h2>
                </div>
                {renderContent()}
                 <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};