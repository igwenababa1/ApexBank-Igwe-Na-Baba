import React, { useEffect } from 'react';
import { 
    DashboardIcon, SendIcon, UserGroupIcon, ActivityIcon, CogIcon, CreditCardIcon, 
    LifebuoyIcon, CashIcon, QuestionMarkCircleIcon, WalletIcon, ChartBarIcon, 
    ShoppingBagIcon, MapPinIcon, XIcon, ApexBankLogo, CubeTransparentIcon,
    ClipboardDocumentIcon, AirplaneTicketIcon, WrenchScrewdriverIcon, PuzzlePieceIcon, SparklesIcon,
    TrendingUpIcon, PlusCircleIcon, MapIcon
} from './Icons';
import { View } from '../types';
import { USER_PROFILE } from '../constants';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: View;
  setActiveView: (view: View) => void;
}

const menuConfig: {
    category: string;
    items: {
        view: View;
        label: string;
        description: string;
        icon: React.ComponentType<{ className?: string }>;
    }[];
}[] = [
    {
        category: 'Core Banking',
        items: [
            { view: 'dashboard', label: 'Dashboard', description: "Your financial overview.", icon: DashboardIcon },
            { view: 'accounts', label: 'Accounts', description: "Manage all your balances.", icon: WalletIcon },
            { view: 'send', label: 'Send Money', description: "Instant global transfers.", icon: SendIcon },
            { view: 'cards', label: 'Cards', description: "Physical & virtual cards.", icon: CreditCardIcon },
        ]
    },
    {
        category: 'Manage',
        items: [
            { view: 'history', label: 'History', description: "View all transactions.", icon: ActivityIcon },
            { view: 'recipients', label: 'Recipients', description: "Saved contacts.", icon: UserGroupIcon },
            { view: 'tasks', label: 'Tasks', description: "Your financial to-do list.", icon: ClipboardDocumentIcon },
            { view: 'integrations', label: 'Integrations', description: "Connect other services.", icon: PuzzlePieceIcon },
        ]
    },
     {
        category: 'Grow',
        items: [
            { view: 'invest', label: 'Invest', description: "Stocks, ETFs, and more.", icon: TrendingUpIcon },
            { view: 'crypto', label: 'Crypto', description: "Trade digital assets.", icon: ChartBarIcon },
            { view: 'loans', label: 'Loans', description: "Personal & auto financing.", icon: CashIcon },
            { view: 'insurance', label: 'Insurance', description: "Protect your assets.", icon: LifebuoyIcon },
        ]
    },
    {
        category: 'Services',
        items: [
            { view: 'flights', label: 'Book Flights', description: "Travel with your funds.", icon: AirplaneTicketIcon },
            { view: 'utilities', label: 'Pay Utilities', description: "Manage your bills.", icon: WrenchScrewdriverIcon },
            { view: 'services', label: 'Subscriptions', description: "Track recurring payments.", icon: ShoppingBagIcon },
            { view: 'checkin', label: 'Travel Check-In', description: "Use your card abroad.", icon: MapPinIcon },
            { view: 'atmLocator', label: 'ATM Locator', description: "Find nearby ATMs worldwide.", icon: MapIcon },
        ]
    },
    {
        category: 'System',
        items: [
            { view: 'advisor', label: 'AI Advisor', description: "Personalized insights.", icon: SparklesIcon },
            { view: 'support', label: 'Support', description: "Get help & guidance.", icon: QuestionMarkCircleIcon },
            { view: 'security', label: 'Security', description: "Manage account safety.", icon: CogIcon },
            { view: 'platform', label: 'Platform', description: "Customize your experience.", icon: CubeTransparentIcon },
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
            <div className={`relative z-10 w-full max-w-lg bg-slate-200 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-300">
                    <div className="flex items-center space-x-2">
                        <ApexBankLogo />
                        <h2 id="menu-title" className="text-xl font-bold text-slate-800">ApexBank Menu</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-600 hover:text-primary shadow-digital active:shadow-digital-inset transition-all">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>

                {/* Profile Section */}
                <div className="p-6 flex items-center space-x-4 border-b border-slate-300">
                    <img src={USER_PROFILE.profilePictureUrl} alt="User" className="w-16 h-16 rounded-full shadow-digital" />
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">{USER_PROFILE.name}</h3>
                        <p className="text-sm text-slate-500">{USER_PROFILE.email}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 border-b border-slate-300">
                     <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
                     <div className="grid grid-cols-3 gap-4">
                        <button onClick={() => handleItemClick('send')} className="flex flex-col items-center p-2 rounded-lg text-slate-600 hover:text-primary shadow-digital active:shadow-digital-inset"><SendIcon className="w-6 h-6 mb-1"/> <span className="text-xs font-semibold">New Transfer</span></button>
                        <button onClick={() => handleItemClick('utilities')} className="flex flex-col items-center p-2 rounded-lg text-slate-600 hover:text-primary shadow-digital active:shadow-digital-inset"><WrenchScrewdriverIcon className="w-6 h-6 mb-1"/> <span className="text-xs font-semibold">Pay a Bill</span></button>
                        <button onClick={() => handleItemClick('cards')} className="flex flex-col items-center p-2 rounded-lg text-slate-600 hover:text-primary shadow-digital active:shadow-digital-inset"><PlusCircleIcon className="w-6 h-6 mb-1"/> <span className="text-xs font-semibold">Add Funds</span></button>
                     </div>
                </div>

                {/* Main Menu Items */}
                <div className="flex-grow p-6 overflow-y-auto">
                    {menuConfig.map((category) => (
                        <div key={category.category} className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{category.category}</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {category.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeView === item.view;
                                    itemDelay += 15; // Stagger delay in ms
                                    
                                    return (
                                        <button
                                            key={item.view}
                                            onClick={() => handleItemClick(item.view)}
                                            style={{ transitionDelay: `${isOpen ? itemDelay : 0}ms` }}
                                            className={`flex items-center space-x-4 p-3 rounded-lg w-full text-left transition-all duration-300 transform ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} ${
                                                isActive
                                                    ? 'bg-primary/10 text-primary font-semibold shadow-inner'
                                                    : 'text-slate-600 hover:bg-slate-300/50 hover:text-primary'
                                            }`}
                                        >
                                            <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                                            <div>
                                                <span className="text-base">{item.label}</span>
                                                <p className={`text-xs ${isActive ? 'text-primary/80' : 'text-slate-500'}`}>{item.description}</p>
                                            </div>
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