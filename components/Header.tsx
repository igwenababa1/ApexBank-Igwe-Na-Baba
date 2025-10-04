import React, { useState, useEffect, useRef } from 'react';
import { ApexBankLogo, DashboardIcon, SendIcon, UserGroupIcon, LogoutIcon, ActivityIcon, CogIcon, CreditCardIcon, BellIcon, SpinnerIcon } from './Icons';
import { Notification } from '../types';
import { NotificationsPanel } from './NotificationsPanel';

type View = 'dashboard' | 'send' | 'recipients' | 'history' | 'settings' | 'cards';

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
        onLogout();
        // No need to reset state, component will unmount
    }, 30000); // 30 second delay
  };


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
                icon={<SendIcon className="w-5 h-5" />}
                label="Send Money"
                isActive={activeView === 'send'}
                onClick={() => setActiveView('send')}
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
                icon={<ActivityIcon className="w-5 h-5" />}
                label="History"
                isActive={activeView === 'history'}
                onClick={() => setActiveView('history')}
              />
              <NavItem
                icon={<CogIcon className="w-5 h-5" />}
                label="Settings"
                isActive={activeView === 'settings'}
                onClick={() => setActiveView('settings')}
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
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center w-[140px] h-[42px] space-x-2 text-slate-600 hover:text-primary transition-all duration-300 px-4 py-2 rounded-lg shadow-digital active:shadow-digital-inset disabled:opacity-70 disabled:cursor-wait"
                aria-label="Logout"
              >
                {isLoggingOut ? (
                    <>
                        <SpinnerIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Logging out...</span>
                    </>
                ) : (
                    <>
                        <LogoutIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};