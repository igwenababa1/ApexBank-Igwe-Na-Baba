import React from 'react';
import { UserProfile } from '../types';
import { ApexBankLogo, MapPinIcon, ClockIcon } from './Icons';

interface ProfileSignInProps {
  user: UserProfile;
  onEnterDashboard: () => void;
}

const timeSince = (date: Date): string => {
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
};

export const ProfileSignIn: React.FC<ProfileSignInProps> = ({ user, onEnterDashboard }) => {
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-block p-2 rounded-full shadow-digital">
            <ApexBankLogo />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">ApexBank</h1>
        </div>

        <div className="bg-slate-200 rounded-2xl shadow-digital p-8 text-center animate-fade-in-up">
            <div className="relative inline-block">
                <img
                    src={user.profilePictureUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-4 shadow-digital"
                />
                 <span className="absolute bottom-4 right-1 block h-4 w-4 rounded-full bg-green-500 ring-2 ring-slate-200 shadow-md" title="Active Session"></span>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>

            <div className="mt-6 p-4 bg-slate-200 rounded-lg shadow-digital-inset text-left space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Login</p>
                <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <MapPinIcon className="w-5 h-5 flex-shrink-0 text-slate-400" />
                    <span>{user.lastLogin.from}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <ClockIcon className="w-5 h-5 flex-shrink-0 text-slate-400" />
                    <span>{timeSince(user.lastLogin.date)} &bull; {user.lastLogin.date.toLocaleDateString()}</span>
                </div>
            </div>

            <button
                onClick={onEnterDashboard}
                className="w-full mt-8 py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >
                Enter Dashboard
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};