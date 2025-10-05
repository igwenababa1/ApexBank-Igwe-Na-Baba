import React, { useState, useEffect, useRef } from 'react';
import { VerificationLevel } from '../types';
import { SpinnerIcon, CheckCircleIcon, DocumentCheckIcon, CameraIcon } from './Icons';

interface VerificationCenterProps {
  currentLevel: VerificationLevel;
  onClose: (finalLevel: VerificationLevel) => void;
}

const steps = [
  { level: VerificationLevel.LEVEL_1, title: "Document Verification", icon: <DocumentCheckIcon className="w-8 h-8"/>, description: "Upload a government-issued photo ID." },
  { level: VerificationLevel.LEVEL_2, title: "Liveness Check", icon: <CameraIcon className="w-8 h-8"/>, description: "Confirm you're a real person with a quick video scan." }
];

export const VerificationCenter: React.FC<VerificationCenterProps> = ({ currentLevel, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // If the user is already at a certain level, start them at the next step
    if (currentLevel === VerificationLevel.LEVEL_1) {
      setActiveStep(1);
    }
  }, [currentLevel]);
  
  const handleDocumentUpload = () => {
    setStatus('processing');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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
            // Simulate a 3-second scan
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
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
      setStatus('idle');
      setProgress(0);
    } else {
      onClose(steps[activeStep].level);
    }
  };
  
  const renderStepContent = () => {
    const stepInfo = steps[activeStep];
    
    if (status === 'processing') {
      if (stepInfo.level === VerificationLevel.LEVEL_1) {
        return (
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Analyzing Document...</h3>
            <div className="w-full bg-slate-300 rounded-full h-2.5 my-4">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-slate-500">Our AI is securely verifying your document details.</p>
          </div>
        );
      }
      if (stepInfo.level === VerificationLevel.LEVEL_2) {
        return (
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Performing Liveness Scan...</h3>
            <div className="relative w-48 h-48 mx-auto my-4 rounded-full overflow-hidden border-4 border-primary p-1">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-full scale-x-[-1]"></video>
                <div className="absolute inset-0 border-4 border-dashed border-white/50 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-slate-500">Please hold still and look at the camera.</p>
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
    
    if (stepInfo.level === VerificationLevel.LEVEL_2) {
       return (
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Liveness Check</h3>
            <p className="text-sm text-slate-500 mt-2">We need to verify you're a real person by scanning your face. This takes only a few seconds.</p>
            {errorMessage && <p className="text-red-500 text-xs mt-2">{errorMessage}</p>}
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
