import React, { useState, useEffect, useRef } from 'react';
import { 
    ApexBankLogo, LogoutIcon, BellIcon, MenuIcon
} from './Icons';
import { Notification, View } from '../types';
import { NotificationsPanel } from './NotificationsPanel';
import { MegaMenu } from './MegaMenu'; // Import the new menu

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => void;
  notifications: Notification[];
  onMarkNotificationsAsRead: () => void;
  onNotificationClick: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, onLogout, notifications, onMarkNotificationsAsRead, onNotificationClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for the new menu
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
      setShowNotifications(prev => !prev);
      if (!showNotifications) {
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
    <>
      <header className="bg-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-600 hover:text-primary shadow-digital active:shadow-digital-inset transition-all"
                aria-label="Open menu"
              >
                <MenuIcon className="w-6 h-6" />
                <span className="font-semibold hidden sm:inline">Menu</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <ApexBankLogo />
                <h1 className="text-2xl font-bold text-slate-800 hidden md:block">ApexBank</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
                  {showNotifications && <NotificationsPanel notifications={notifications} onClose={() => setShowNotifications(false)} onNotificationClick={onNotificationClick} />}
               </div>

               <button
                onClick={onLogout}
                className="flex items-center justify-center space-x-2 text-slate-600 hover:text-primary transition-all duration-300 px-4 py-2 rounded-lg shadow-digital active:shadow-digital-inset"
                aria-label="Logout"
              >
                <LogoutIcon className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MegaMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
      />
    </>
  );
};