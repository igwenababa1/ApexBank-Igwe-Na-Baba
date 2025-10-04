import React from 'react';
import { Notification, NotificationType } from '../types';
import { BellIcon, CheckCircleIcon, CreditCardIcon, ShieldCheckIcon } from './Icons';

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
    switch(type) {
        case NotificationType.TRANSACTION:
            return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
        case NotificationType.CARD:
            return <CreditCardIcon className="w-6 h-6 text-blue-500" />;
        case NotificationType.SECURITY:
            return <ShieldCheckIcon className="w-6 h-6 text-yellow-500" />;
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

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 animate-fade-in-down">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
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
                <ul className="divide-y divide-slate-100">
                    {notifications.map(notification => (
                        <li key={notification.id} className={`p-4 transition-colors duration-200 ${notification.read ? 'bg-white' : 'bg-primary-50'}`}>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-slate-800">{notification.title}</p>
                                    <p className="text-sm text-slate-600">{notification.message}</p>
                                    <p className="text-xs text-slate-400 mt-1">{timeSince(notification.timestamp)}</p>
                                </div>
                            </div>
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
