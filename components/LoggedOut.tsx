import React from 'react';
import { UserProfile } from '../types';
import { ApexBankLogo } from './Icons';

interface LoggedOutProps {
  user: UserProfile;
  onLogin: () => void;
  onSwitchUser: () => void;
}

export const LoggedOut: React.FC<LoggedOutProps> = ({ user, onLogin, onSwitchUser }) => {
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
          <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
          
          <button
            onClick={onLogin}
            className="w-full mt-6 py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Sign In as {user.name.split(' ')[0]}
          </button>
          
          <div className="mt-4 text-center text-sm">
            <button onClick={onSwitchUser} className="font-medium text-primary hover:underline">
                Not you? Sign in with a different account.
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
