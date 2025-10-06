import React, { useState, useEffect, useRef } from 'react';
import { VerificationLevel } from '../types';
import { SpinnerIcon, CheckCircleIcon, DocumentCheckIcon, CameraIcon, IdentificationIcon, ShieldCheckIcon } from './Icons';

interface VerificationCenterProps {
  currentLevel: VerificationLevel;
  onClose: (finalLevel: VerificationLevel) => void;
}

const steps = [
  { level: VerificationLevel.LEVEL_1, title: "Identity Details", icon: <IdentificationIcon className="w-8 h-8"/>, description: "Verify your Social Security Number." },
  { level: VerificationLevel.LEVEL_2, title: "Document Verification", icon: <DocumentCheckIcon className="w-8 h-8"/>, description: "Upload a government-issued photo ID." },
  { level: VerificationLevel.LEVEL_3, title: "Liveness Check", icon: <CameraIcon className="w-8 h-8"/>, description: "Confirm you're a real person with a quick video scan." }
];

const DocumentScanAnimation = () => (
    <div className="relative w-48 h-60 mx-auto my-4 bg-slate-300 rounded-lg shadow-inner overflow-hidden p-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/70 shadow-[0_0_10px_theme(colors.primary)] animate-scan"></div>
        <div className="h-4 bg-slate-400 rounded w-1/3 mb-4"></div>
        <div className="h-2 bg-slate-400 rounded w-full mb-2"></div>
        <div className="h-2 bg-slate-400 rounded w-full mb-2"></div>
        <div className="h-2 bg-slate-400 rounded w-2/3 mb-4"></div>
        <div className="h-2 bg-slate-400 rounded w-full mb-2"></div>
        <div className="h-2 bg-slate-400 rounded w-full mb-2"></div>
        <div className="h-2 bg-slate-400 rounded w-4/5"></div>
        <style>{`
            @keyframes scan {
                0% { top: 0; }
                100% { top: 100%; }
            }
            .animate-scan { animation: scan 2s ease-in-out infinite; }
        `}</style>
    </div>
);

const LivenessScanOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* <!-- Face oval --> */}
            <ellipse cx="100" cy="100" rx="60" ry="80" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" strokeDasharray="5 5" />
            
            {/* <!-- Animated scanning line --> */}
            <line x1="40" y1="20" x2="160" y2="20" stroke="#0052FF" strokeWidth="2" className="animate-liveness-scan" />
            
            {/* <!-- Corner brackets --> */}
            <path d="M 30 50 L 30 30 L 50 30" stroke="white" strokeWidth="3" fill="none" />
            <path d="M 170 50 L 170 30 L 150 30" stroke="white" strokeWidth="3" fill="none" />
            <path d="M 30 150 L 30 170 L 50 170" stroke="white" strokeWidth="3" fill="none" />
            <path d="M 170 150 L 170 170 L 150 170" stroke="white" strokeWidth="3" fill="none" />
        </svg>
        <style>{`
            @keyframes liveness-scan {
                0% { transform: translateY(0); }
                100% { transform: translateY(160px); }
            }
            .animate-liveness-scan {
                animation: liveness-scan 3s ease-in-out infinite;
                filter: drop-shadow(0 0 5px #0052FF);
            }
        `}</style>
    </div>
);


export const VerificationCenter: React.FC<VerificationCenterProps> = ({ currentLevel, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [ssn, setSsn] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (currentLevel === VerificationLevel.UNVERIFIED) setActiveStep(0);
    if (currentLevel === VerificationLevel.LEVEL_1) setActiveStep(1);
    if (currentLevel === VerificationLevel.LEVEL_2) setActiveStep(2);
    if (currentLevel === VerificationLevel.LEVEL_3) setActiveStep(2); // If already fully verified, show last step
  }, [currentLevel]);

  const handleSsnSubmit = () => {
    if (ssn.replace(/-/g, '').length !== 9) {
        setErrorMessage('Please enter a valid 9-digit SSN.');
        setStatus('error');
        return;
    }
    setStatus('processing');
    setErrorMessage('');
    setTimeout(() => {
        setStatus('success');
    }, 2500);
  }
  
  const handleDocumentUpload = () => {
    setStatus('processing');
    setTimeout(() => {
        setStatus('success');
    }, 2000);
  };
  
  const handleLivenessCheck = async () => {
    setStatus('processing');
    setErrorMessage('');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setTimeout(() => {
                stream.getTracks().forEach(track => track.stop());
                setStatus('success');
            }, 3000);
        } catch (err) {
            console.error("Camera access denied:", err);
            setErrorMessage("Camera access is required. Please enable it in your browser settings.");
            setStatus('error');
        }
    } else {
        setErrorMessage("Your browser does not support camera access.");
        setStatus('error');
    }
  };

  const handleNext = () => {
    const completedLevel = steps[activeStep].level;
    if (activeStep < steps.length - 1) {
      onClose(completedLevel); // Update level immediately after step completion
      setActiveStep(prev => prev + 1);
      setStatus('idle');
    } else {
      onClose(completedLevel);
    }
  };

  const handleSsnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5, 9)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}-${value.slice(3, 5)}`;
    }
    setSsn(value);
  };
  
  const renderStepContent = () => {
    const stepInfo = steps[activeStep];
    
    if (status === 'processing') {
      if (stepInfo.level === VerificationLevel.LEVEL_1) {
        return (
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Verifying Identity</h3>
            <div className="my-4"><SpinnerIcon className="w-12 h-12 text-primary mx-auto"/></div>
            <p className="text-sm text-slate-500">Securely checking against government databases...</p>
          </div>
        );
      }
      if (stepInfo.level === VerificationLevel.LEVEL_2) {
        return (
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Securely analyzing document...</h3>
            <DocumentScanAnimation />
            <p className="text-sm text-slate-500">Our AI is verifying your document details.</p>
          </div>
        );
      }
      if (stepInfo.level === VerificationLevel.LEVEL_3) {
        return (
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Performing liveness check...</h3>
            <div className="relative w-48 h-64 mx-auto my-4 rounded-full overflow-hidden border-4 border-primary p-1 bg-slate-800">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-full scale-x-[-1]"></video>
                <LivenessScanOverlay />
            </div>
            <p className="text-sm text-slate-500">Please keep your face within the oval.</p>
          </div>
        );
      }
    }
    
    if (status === 'success') {
       return (
          <div className="text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">{stepInfo.level} Verified!</h3>
            <p className="text-sm text-slate-500 mt-2">You have successfully completed this step.</p>
          </div>
        );
    }
    
    // Idle State
     if (stepInfo.level === VerificationLevel.LEVEL_1) {
        return (
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Verify Your Identity</h3>
            <p className="text-sm text-slate-500 mt-2">Please enter your Social Security Number. Your information is encrypted and stored securely.</p>
             <div className="mt-4">
                <label htmlFor="ssn" className="sr-only">Social Security Number</label>
                <input
                    type="text"
                    id="ssn"
                    value={ssn}
                    onChange={handleSsnChange}
                    className="w-full bg-slate-200 border-0 p-3 text-center text-2xl tracking-[.25em] rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400"
                    placeholder="***-**-****"
                    maxLength={11}
                />
             </div>
             {errorMessage && status === 'error' && <p className="text-red-500 text-xs mt-2">{errorMessage}</p>}
            <button onClick={handleSsnSubmit} className="w-full mt-4 py-3 text-white bg-primary rounded-lg font-semibold shadow-md">
                Verify SSN
            </button>
          </div>
        );
    }
     if (stepInfo.level === VerificationLevel.LEVEL_2) {
        return (
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Upload Your ID</h3>
            <p className="text-sm text-slate-500 mt-2">Please upload a clear image of a government-issued photo ID.</p>
            <div className="mt-4 p-6 border-2 border-dashed border-slate-300 rounded-lg">
                <p className="font-semibold">Simulated File Upload</p>
                <p className="text-xs text-slate-400">In a real app, a file picker would be here.</p>
            </div>
            <button onClick={handleDocumentUpload} className="w-full mt-4 py-3 text-white bg-primary rounded-lg font-semibold shadow-md">
                Simulate Upload & Verify
            </button>
          </div>
        );
    }
    if (stepInfo.level === VerificationLevel.LEVEL_3) {
       return (
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Liveness Check</h3>
            <p className="text-sm text-slate-500 mt-2">We need to verify you're a real person by scanning your face. This takes only a few seconds.</p>
            {errorMessage && status === 'error' && <p className="text-red-500 text-xs mt-2">{errorMessage}</p>}
            <button onClick={handleLivenessCheck} className="w-full mt-4 py-3 text-white bg-primary rounded-lg font-semibold shadow-md">
                Start Camera Scan
            </button>
          </div>
        );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-slate-200 rounded-2xl shadow-digital p-8 w-full max-w-md m-4 relative flex flex-col max-h-[90vh]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Identity Verification</h2>
        </div>
        
        {/* Stepper */}
        <div className="flex justify-center items-start mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={step.level}>
                    <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${index < activeStep || (index === activeStep && status === 'success') ? 'bg-green-500 text-white' : index === activeStep ? 'bg-primary text-white' : 'bg-slate-300 text-slate-500'}`}>
                            {index < activeStep || (index === activeStep && status === 'success') ? <CheckCircleIcon className="w-7 h-7" /> : step.icon}
                        </div>
                        <p className={`mt-2 text-xs text-center font-medium ${index <= activeStep ? 'text-slate-700' : 'text-slate-400'}`}>{step.title}</p>
                    </div>
                    {index < steps.length - 1 && <div className={`flex-1 h-0.5 mt-6 transition-colors duration-300 mx-2 ${index < activeStep ? 'bg-green-500' : 'bg-slate-300'}`}></div>}
                </React.Fragment>
            ))}
        </div>
        
        <div className="flex-grow py-4">
            {renderStepContent()}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-300 flex justify-end">
          {status === 'success' ? (
             <button onClick={handleNext} className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-md">
                {activeStep < steps.length - 1 ? 'Continue' : 'Finish'}
            </button>
          ) : (
            <button onClick={() => onClose(currentLevel)} className="px-6 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};