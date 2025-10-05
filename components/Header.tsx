import React, { useState, useEffect, useRef } from 'react';
import { ApexBankLogo, DashboardIcon, SendIcon, UserGroupIcon, LogoutIcon, ActivityIcon, CogIcon, CreditCardIcon, BellIcon, SpinnerIcon, LifebuoyIcon, CashIcon, QuestionMarkCircleIcon, WalletIcon, ChartBarIcon, ShoppingBagIcon, MapPinIcon } from './Icons';
import { Notification } from '../types';
import { NotificationsPanel } from './NotificationsPanel';

type View = 'dashboard' | 'send' | 'recipients' | 'history' | 'security' | 'cards' | 'insurance' | 'loans' | 'support' | 'accounts' | 'crypto' | 'services' | 'checkin';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => void;
  notifications: Notification[];
  onMarkNotificationsAsRead: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
      isActive
        ? 'text-primary font-semibold shadow-digital-inset'
        : 'text-slate-600 hover:text-primary shadow-digital active:shadow-digital-inset'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, onLogout, notifications, onMarkNotificationsAsRead }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
      setShowNotifications(prev => !prev);
      if (!showNotifications) {
          // Mark as read when opening
          onMarkNotificationsAsRead();
      }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <ApexBankLogo />
            <h1 className="text-2xl font-bold text-slate-800">ApexBank</h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2">
              <NavItem
                icon={<DashboardIcon className="w-5 h-5" />}
                label="Dashboard"
                isActive={activeView === 'dashboard'}
                onClick={() => setActiveView('dashboard')}
              />
              <NavItem
                icon={<WalletIcon className="w-5 h-5" />}
                label="Accounts"
                isActive={activeView === 'accounts'}
                onClick={() => setActiveView('accounts')}
              />
              <NavItem
                icon={<SendIcon className="w-5 h-5" />}
                label="Send Money"
                isActive={activeView === 'send'}
                onClick={() => setActiveView('send')}
              />
               <NavItem
                icon={<ChartBarIcon className="w-5 h-5" />}
                label="Crypto"
                isActive={activeView === 'crypto'}
                onClick={() => setActiveView('crypto')}
              />
               <NavItem
                icon={<ShoppingBagIcon className="w-5 h-5" />}
                label="Services"
                isActive={activeView === 'services'}
                onClick={() => setActiveView('services')}
              />
               <NavItem
                icon={<MapPinIcon className="w-5 h-5" />}
                label="Check-In"
                isActive={activeView === 'checkin'}
                onClick={() => setActiveView('checkin')}
              />
              <NavItem
                icon={<UserGroupIcon className="w-5 h-5" />}
                label="Recipients"
                isActive={activeView === 'recipients'}
                onClick={() => setActiveView('recipients')}
              />
               <NavItem
                icon={<CreditCardIcon className="w-5 h-5" />}
                label="Cards"
                isActive={activeView === 'cards'}
                onClick={() => setActiveView('cards')}
              />
               <NavItem
                icon={<CashIcon className="w-5 h-5" />}
                label="Loans"
                isActive={activeView === 'loans'}
                onClick={() => setActiveView('loans')}
              />
              <NavItem
                icon={<LifebuoyIcon className="w-5 h-5" />}
                label="Insurance"
                isActive={activeView === 'insurance'}
                onClick={() => setActiveView('insurance')}
              />
              <NavItem
                icon={<ActivityIcon className="w-5 h-5" />}
                label="History"
                isActive={activeView === 'history'}
                onClick={() => setActiveView('history')}
              />
               <NavItem
                icon={<QuestionMarkCircleIcon className="w-5 h-5" />}
                label="Support"
                isActive={activeView === 'support'}
                onClick={() => setActiveView('support')}
              />
              <NavItem
                icon={<CogIcon className="w-5 h-5" />}
                label="Security"
                isActive={activeView === 'security'}
                onClick={() => setActiveView('security')}
              />
            </nav>
            <div className="pl-4 flex items-center space-x-4">
               <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={toggleNotifications}
                    className="p-2 rounded-full text-slate-600 hover:text-primary transition-all duration-300 shadow-digital active:shadow-digital-inset"
                    aria-label="View notifications"
                  >
                      <BellIcon className="w-6 h-6"/>
                      {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                              {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                      )}
                  </button>
                  {showNotifications && <NotificationsPanel notifications={notifications} onClose={() => setShowNotifications(false)} />}
               </div>
               <button
                onClick={onLogout}
                className="flex items-center justify-center space-x-2 text-slate-600 hover:text-primary transition-all duration-300 px-4 py-2 rounded-lg shadow-digital active:shadow-digital-inset"
                aria-label="Logout"
              >
                <LogoutIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};