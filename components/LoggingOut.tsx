import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, GlobeAltIcon, ApexBankLogo, SparklesIcon } from './Icons';

interface LoggingOutProps {
    onComplete: () => void;
}

const steps = [
    {
        icon: <ShieldCheckIcon className="w-10 h-10 text-slate-300" />,
        title: "Securely logging you out...",
        message: "Clearing session data and terminating your connection.",
        duration: 5000,
    },
    {
        icon: <ApexBankLogo />,
        title: "Thank you for banking with ApexBank.",
        message: "Your trust is our most valuable asset. We're here for you, around the clock and around the world.",
        duration: 7000,
    },
    {
        icon: <GlobeAltIcon className="w-10 h-10 text-slate-300" />,
        title: "Ready for your next move?",
        message: "From global transfers to managing your digital assets, ApexBank is your partner in financial growth.",
        duration: 6000,
    },
    {
        icon: <SparklesIcon className="w-10 h-10 text-slate-300" />,
        title: "You are now logged out.",
        message: "We look forward to seeing you again soon. Have a great day!",
        duration: 2000, // This is just for display, the main timer will handle completion.
    },
];

export const LoggingOut: React.FC<LoggingOutProps> = ({ onComplete }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Main 20-second timer to finalize logout
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 20000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    // Timer to cycle through the display steps
    useEffect(() => {
        if (currentStepIndex >= steps.length - 1) {
            return;
        }

        const stepTimer = setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
        }, steps[currentStepIndex].duration);

        return () => clearTimeout(stepTimer);
    }, [currentStepIndex]);

    const currentStep = steps[currentStepIndex];

    return (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center text-white z-[100] transition-opacity duration-500 animate-fade-in">
            <div className="text-center p-8 max-w-lg mx-auto">
                <div key={currentStepIndex} className="animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-800/50 rounded-full mb-6">
                        {currentStep.icon}
                    </div>
                    <h2 className="text-3xl font-bold">{currentStep.title}</h2>
                    <p className="mt-3 text-slate-400 text-lg">{currentStep.message}</p>
                </div>
            </div>
            {/* Progress Bar */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1/3 max-w-sm h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-1 bg-primary animate-progress"></div>
            </div>
             <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }

                @keyframes progress-bar {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .animate-progress { animation: progress-bar 20s linear forwards; }
             `}</style>
        </div>
    );
};
