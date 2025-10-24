
import React, { useRef, useState, useEffect } from 'react';
import { View } from '../types';
import {
    ApexBankLogo,
    XSocialIcon,
    LinkedInIcon,
    InstagramIcon
} from './Icons';

interface FooterProps {
    setActiveView: (view: View) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView }) => {
    const footerRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: '200px' } // Load when 200px away from viewport
        );

        const currentFooterRef = footerRef.current;
        if (currentFooterRef) {
            observer.observe(currentFooterRef);
        }

        return () => {
            if (currentFooterRef) {
                observer.unobserve(currentFooterRef);
            }
        };
    }, []);

    return (
        <footer ref={footerRef} className="relative bg-slate-900 text-slate-400 py-16 overflow-hidden mt-8">
            {/* Animated Background */}
            <div
                className="absolute inset-0 w-full h-full animate-background-zoom"
                style={{
                    backgroundImage: isVisible ? `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')` : 'none',
                    backgroundPosition: 'center',
                    backgroundSize: '120%', // Start slightly zoomed to avoid blank edges on zoom-out
                }}
            ></div>
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo & Tagline */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center space-x-2">
                            <ApexBankLogo />
                            <h2 className="text-xl font-bold text-white">ApexBank</h2>
                        </div>
                        <p className="mt-4 text-sm">The Future of Global Banking. Today.</p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Quick Links</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><button onClick={() => setActiveView('dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
                            <li><button onClick={() => setActiveView('send')} className="hover:text-white transition-colors">Send Money</button></li>
                            <li><button onClick={() => setActiveView('cards')} className="hover:text-white transition-colors">Cards</button></li>
                            <li><button onClick={() => setActiveView('history')} className="hover:text-white transition-colors">History</button></li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                            <li><button onClick={() => setActiveView('support')} className="hover:text-white transition-colors">Contact Support</button></li>
                        </ul>
                    </div>

                    {/* Column 4: Legal */}
                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} ApexBank. All rights reserved.
                    </p>
                    <div className="flex justify-center space-x-6 mt-4 md:mt-0">
                        <a href="#" aria-label="X" className="hover:text-white transition-transform transform hover:scale-110"><XSocialIcon className="w-5 h-5"/></a>
                        <a href="#" aria-label="LinkedIn" className="hover:text-white transition-transform transform hover:scale-110"><LinkedInIcon className="w-5 h-5"/></a>
                        <a href="#" aria-label="Instagram" className="hover:text-white transition-transform transform hover:scale-110"><InstagramIcon className="w-5 h-5"/></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};