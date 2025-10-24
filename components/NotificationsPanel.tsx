import React from 'react';
import { Notification, NotificationType, View } from '../types';
import { BellIcon, CheckCircleIcon, CreditCardIcon, ShieldCheckIcon, LifebuoyIcon, CashIcon } from './Icons';

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onNotificationClick: (view: View) => void;
}

const getNotificationIcon = (type: NotificationType) => {
    switch(type) {
        case NotificationType.TRANSACTION:
            return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
        case NotificationType.CARD:
            return <CreditCardIcon className="w-6 h-6 text-blue-500" />;
        case NotificationType.SECURITY:
            return <ShieldCheckIcon className="w-6 h-6 text-yellow-500" />;
        case NotificationType.INSURANCE:
            return <LifebuoyIcon className="w-6 h-6 text-indigo-500" />;
        case NotificationType.LOAN:
            return <CashIcon className="w-6 h-6 text-teal-500" />;
        default:
            return <BellIcon className="w-6 h-6 text-slate-500" />;
    }
}

const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return "Just now";
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose, onNotificationClick }) => {
    
  const handleClick = (notification: Notification) => {
    if (notification.linkTo) {
      onNotificationClick(notification.linkTo);
    }
    onClose();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-slate-200 rounded-2xl shadow-digital z-50 animate-fade-in-down overflow-hidden">
        <div className="p-4 border-b border-slate-300 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            {/* Can add a "Mark all as read" button here in the future */}
        </div>
        <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
                <div className="text-center p-8 text-slate-500">
                    <BellIcon className="w-12 h-12 mx-auto text-slate-300 mb-2"/>
                    <p>No new notifications</p>
                </div>
            ) : (
                <ul className="divide-y divide-slate-300">
                    {notifications.map(notification => (
                        <li key={notification.id} className={`transition-colors duration-200 ${notification.read ? '' : 'bg-primary-50/50'}`}>
                            <button
                              onClick={() => handleClick(notification)}
                              className="w-full text-left p-4 cursor-pointer hover:bg-slate-300/50"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-1 p-2 bg-slate-200 rounded-full shadow-digital">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800">{notification.title}</p>
                                        <p className="text-sm text-slate-600">{notification.message}</p>
                                        <p className="text-xs text-slate-400 mt-1">{timeSince(notification.timestamp)}</p>
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        <style>{`
          @keyframes fade-in-down {
            0% {
              opacity: 0;
              transform: translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.2s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
