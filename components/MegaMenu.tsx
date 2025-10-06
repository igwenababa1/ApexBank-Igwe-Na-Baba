import React, { useEffect } from 'react';
import { 
    DashboardIcon, SendIcon, UserGroupIcon, ActivityIcon, CogIcon, CreditCardIcon, 
    LifebuoyIcon, CashIcon, QuestionMarkCircleIcon, WalletIcon, ChartBarIcon, 
    ShoppingBagIcon, MapPinIcon, XIcon, ApexBankLogo, CubeTransparentIcon
} from './Icons';
import { View } from '../types';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: View;
  setActiveView: (view: View) => void;
}

// FIX: Explicitly typed `menuConfig` to ensure `item.view` is correctly inferred as type `View`.
const menuConfig: {
    category: string;
    items: {
        view: View;
        label: string;
        icon: React.ComponentType<{ className?: string }>;
    }[];
}[] = [
    {
        category: 'Core',
        items: [
            { view: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
            { view: 'accounts', label: 'Accounts', icon: WalletIcon },
            { view: 'send', label: 'Send Money', icon: SendIcon },
        ]
    },
    {
        category: 'Manage',
        items: [
            { view: 'cards', label: 'Cards', icon: CreditCardIcon },
            { view: 'recipients', label: 'Recipients', icon: UserGroupIcon },
            { view: 'history', label: 'History', icon: ActivityIcon },
            { view: 'services', label: 'Services', icon: ShoppingBagIcon },
            { view: 'checkin', label: 'Check-In', icon: MapPinIcon },
        ]
    },
    {
        category: 'Grow',
        items: [
            { view: 'crypto', label: 'Crypto', icon: ChartBarIcon },
            { view: 'loans', label: 'Loans', icon: CashIcon },
            { view: 'insurance', label: 'Insurance', icon: LifebuoyIcon },
        ]
    },
    {
        category: 'Support & Settings',
        items: [
            { view: 'support', label: 'Support', icon: QuestionMarkCircleIcon },
            { view: 'security', label: 'Security', icon: CogIcon },
            { view: 'platform', label: 'Platform', icon: CubeTransparentIcon },
        ]
    }
];

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, activeView, setActiveView }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleItemClick = (view: View) => {
        setActiveView(view);
        onClose();
    };

    let itemDelay = 0;

    return (
        <div 
            className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-title"
        >
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Menu Panel */}
            <div className={`relative z-10 w-full max-w-md bg-slate-200 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                <div className="flex items-center justify-between p-4 border-b border-slate-300">
                    <div className="flex items-center space-x-2">
                        <ApexBankLogo />
                        <h2 id="menu-title" className="text-xl font-bold text-slate-800">Menu</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-600 hover:text-primary shadow-digital active:shadow-digital-inset transition-all">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className="flex-grow p-6 overflow-y-auto">
                    {menuConfig.map((category) => (
                        <div key={category.category} className="mb-8">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{category.category}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {category.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeView === item.view;
                                    itemDelay += 25; // Stagger delay in ms
                                    
                                    return (
                                        <button
                                            key={item.view}
                                            onClick={() => handleItemClick(item.view)}
                                            style={{ transitionDelay: `${isOpen ? itemDelay : 0}ms` }}
                                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 transform ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${
                                                isActive
                                                    ? 'text-primary font-semibold shadow-digital-inset'
                                                    : 'text-slate-600 hover:text-primary shadow-digital active:shadow-digital-inset'
                                            }`}
                                        >
                                            <Icon className="w-6 h-6 flex-shrink-0" />
                                            <span className="text-base">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};