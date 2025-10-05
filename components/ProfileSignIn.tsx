import React from 'react';
import { UserProfile } from '../types';
import { ApexBankLogo, ShieldCheckIcon } from './Icons';

interface ProfileSignInProps {
  user: UserProfile;
  onEnterDashboard: () => void;
}

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
          <img
            src={user.profilePictureUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 shadow-digital"
          />
          <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-sm text-slate-500">{user.email}</p>

          <button
            onClick={onEnterDashboard}
            className="w-full mt-8 py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Enter Dashboard
          </button>

          <div className="mt-6 text-xs text-slate-500 border-t border-slate-300 pt-4 flex items-center justify-center space-x-2">
            <ShieldCheckIcon className="w-4 h-4 text-slate-400" />
            <span>
              Last login: {user.lastLogin.date.toLocaleDateString()} from {user.lastLogin.from}
            </span>
          </div>
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