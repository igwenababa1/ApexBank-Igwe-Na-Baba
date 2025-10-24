import React from 'react';
import { ApexBankLogo, ArrowRightIcon } from './Icons';

interface AdvancedFirstPageProps {
    onComplete: () => void;
}

export const AdvancedFirstPage: React.FC<AdvancedFirstPageProps> = ({ onComplete }) => {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute inset-0 radial-gradient-background"></div>
            
            {/* Animated banking images */}
            <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop" className="banking-image image-1" alt="Abstract financial data visualization" loading="lazy" />
            <img src="https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=1964&auto=format&fit=crop" className="banking-image image-2" alt="Global network connections overlayed on a city" loading="lazy" />
            <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop" className="banking-image image-3" alt="Digital interface with stock market data" loading="lazy" />

            {/* Main content */}
            <div className="relative z-10 text-center flex flex-col items-center p-4">
                {/* 3D Globe */}
                <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-8 animate-float">
                    <div className="relative w-full h-full" style={{ perspective: '1200px' }}>
                        <div className="absolute inset-0 animate-globe-spin" style={{ transformStyle: 'preserve-3d' }}>
                            <div className="w-full h-full rounded-full border-2 border-primary/20 wireframe-globe"></div>
                        </div>
                        <div className="absolute inset-0 animate-globe-spin" style={{ animationDirection: 'reverse', animationDuration: '30s', transformStyle: 'preserve-3d' }}>
                             <div className="w-full h-full rounded-full border border-primary/10 wireframe-globe-inner"></div>
                        </div>
                         <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                            <ApexBankLogo />
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight animate-text-focus-in glow-text">
                    The Apex of Global Finance
                </h1>
                <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                    Unlocking worldwide potential through unparalleled financial technology. Secure, seamless, and intelligent.
                </p>
                <button
                    onClick={onComplete}
                    className="mt-12 inline-flex items-center space-x-3 px-8 py-4 text-lg font-bold bg-primary rounded-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: '1000ms' }}
                >
                    <span>Enter Secure Portal</span>
                    <ArrowRightIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};