import React, { useState, useMemo } from 'react';
import { CheckCircleIcon, PencilIcon, DevicePhoneMobileIcon, FingerprintIcon, LockClosedIcon, UserCircleIcon, NetworkIcon, IdentificationIcon } from './Icons';
import { TransferLimits, VerificationLevel } from '../types';
import { ManageLimitsModal } from './ManageLimitsModal';
import { VerificationCenter } from './VerificationCenter';

interface SettingsProps {
  transferLimits: TransferLimits;
  onUpdateLimits: (newLimits: TransferLimits) => void;
  verificationLevel: VerificationLevel;
  onVerificationComplete: (level: VerificationLevel) => void;
}

const SecurityScore: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference * (1 - score / 100);
    const scoreColor = score > 80 ? 'text-green-500' : score > 60 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" strokeWidth="12" className="text-slate-300" />
                <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-out ${scoreColor}`}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
                <span className="text-sm font-medium text-slate-500">Score</span>
            </div>
        </div>
    );
};


export const Security: React.FC<SettingsProps> = ({ transferLimits, onUpdateLimits, verificationLevel, onVerificationComplete }) => {
  const [isLimitsModalOpen, setIsLimitsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  const securityScore = useMemo(() => {
    let score = 25; // Base score
    if (mfaEnabled) score += 25;
    if (biometricsEnabled) score += 25;
    if (verificationLevel === VerificationLevel.LEVEL_1) score += 12.5;
    if (verificationLevel === VerificationLevel.LEVEL_2) score += 25;
    return Math.round(score);
  }, [mfaEnabled, biometricsEnabled, verificationLevel]);

  const handleSaveLimits = (newLimits: TransferLimits) => {
    onUpdateLimits(newLimits);
    setIsLimitsModalOpen(false);
  };
  
  const handleVerificationModalClose = (level: VerificationLevel) => {
    onVerificationComplete(level);
    setIsVerificationModalOpen(false);
  };

  const getVerificationStatusStyle = () => {
    switch(verificationLevel) {
        case VerificationLevel.LEVEL_2: return "text-green-600 bg-green-100";
        case VerificationLevel.LEVEL_1: return "text-blue-600 bg-blue-100";
        default: return "text-yellow-600 bg-yellow-100";
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Security Center</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your account security settings and connected services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-slate-200 rounded-2xl shadow-digital p-6">
            <div className="md:col-span-1">
                <SecurityScore score={securityScore} />
            </div>
            <div className="md:col-span-2">
                <h3 className="text-lg font-bold text-slate-800">Your Security Score is {securityScore > 80 ? 'Excellent' : 'Good'}</h3>
                <p className="text-sm text-slate-600 mt-1">Follow our recommendations to keep your account as secure as possible.</p>
                <div className="mt-4 space-y-3">
                    <div className={`flex items-center space-x-3 text-sm ${biometricsEnabled ? 'text-green-600' : 'text-slate-600'}`}>
                        <CheckCircleIcon className={`w-5 h-5 ${biometricsEnabled ? '' : 'text-slate-300'}`} />
                        <span>Biometric Login is {biometricsEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                     <div className={`flex items-center space-x-3 text-sm ${mfaEnabled ? 'text-green-600' : 'text-slate-600'}`}>
                        <CheckCircleIcon className={`w-5 h-5 ${mfaEnabled ? '' : 'text-slate-300'}`} />
                        <span>Multi-Factor Authentication is {mfaEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className={`flex items-center space-x-3 text-sm`}>
                         <CheckCircleIcon className={`w-5 h-5 ${verificationLevel !== VerificationLevel.UNVERIFIED ? 'text-green-600' : 'text-slate-300'}`} />
                        <span>Identity is {verificationLevel}</span>
                    </div>
                </div>
            </div>
        </div>

         <div className="bg-slate-200 rounded-2xl shadow-digital">
          <div className="p-6 border-b border-slate-300"><h2 className="text-xl font-bold text-slate-800">Identity Verification</h2></div>
          <div className="p-6">
            <div className="flex justify-between items-center">
                <div className="flex items-start space-x-4">
                    <IdentificationIcon className="w-6 h-6 text-slate-500 mt-0.5 flex-shrink-0"/>
                    <div>
                        <p className="font-medium text-slate-700">Verification Status</p>
                        <p className={`text-sm font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${getVerificationStatusStyle()}`}>{verificationLevel}</p>
                    </div>
                </div>
                 <button onClick={() => setIsVerificationModalOpen(true)} className="px-3 py-1.5 text-sm font-medium text-primary bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow disabled:opacity-50" disabled={verificationLevel === VerificationLevel.LEVEL_2}>
                    {verificationLevel === VerificationLevel.LEVEL_2 ? 'Fully Verified' : 'Increase Level'}
                </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-200 rounded-2xl shadow-digital">
          <div className="p-6 border-b border-slate-300"><h2 className="text-xl font-bold text-slate-800">Authentication Methods</h2></div>
          <div className="p-6 divide-y divide-slate-300">
             <div className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                <div className="flex items-start space-x-4">
                    <FingerprintIcon className="w-6 h-6 text-slate-500 mt-0.5 flex-shrink-0"/>
                    <div>
                        <p className="font-medium text-slate-700">Biometric Login</p>
                        <p className="text-sm text-slate-500">Sign in quickly with your face or fingerprint.</p>
                    </div>
                </div>
                 <label htmlFor="bio-toggle" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="bio-toggle" className="sr-only peer" checked={biometricsEnabled} onChange={() => setBiometricsEnabled(prev => !prev)} />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer shadow-digital-inset peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-digital peer-checked:bg-primary"></div>
                </label>
            </div>
            <div className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                <div className="flex items-start space-x-4">
                    <LockClosedIcon className="w-6 h-6 text-slate-500 mt-0.5 flex-shrink-0"/>
                    <div>
                        <p className="font-medium text-slate-700">Password</p>
                        <p className="text-sm text-slate-500">Last changed: 3 months ago</p>
                    </div>
                </div>
                <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                    Change Password
                </button>
            </div>
            <div className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                <div className="flex items-start space-x-4">
                    <DevicePhoneMobileIcon className="w-6 h-6 text-slate-500 mt-0.5 flex-shrink-0"/>
                    <div>
                        <p className="font-medium text-slate-700">Multi-Factor Authentication (MFA)</p>
                        <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                    </div>
                </div>
                <label htmlFor="mfa-toggle" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="mfa-toggle" className="sr-only peer" checked={mfaEnabled} onChange={() => setMfaEnabled(prev => !prev)} />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer shadow-digital-inset peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-digital peer-checked:bg-primary"></div>
                </label>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-200 rounded-2xl shadow-digital">
          <div className="p-6 border-b border-slate-300 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Transfer Limits</h2>
             <button onClick={() => setIsLimitsModalOpen(true)} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                <PencilIcon className="w-4 h-4" />
                <span>Manage</span>
              </button>
          </div>
          <div className="p-6 divide-y divide-slate-300">
             <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                <span className="text-slate-600">Daily Limit</span>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{transferLimits.daily.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                  <p className="text-sm text-slate-500">{transferLimits.daily.count} transactions</p>
                </div>
              </div>
            <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                <span className="text-slate-600">Weekly Limit</span>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{transferLimits.weekly.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                  <p className="text-sm text-slate-500">{transferLimits.weekly.count} transactions</p>
                </div>
              </div>
            <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                <span className="text-slate-600">Monthly Limit</span>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{transferLimits.monthly.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                  <p className="text-sm text-slate-500">{transferLimits.monthly.count} transactions</p>
                </div>
              </div>
          </div>
        </div>

        <div className="bg-slate-200 rounded-2xl shadow-digital">
          <div className="p-6 border-b border-slate-300"><h2 className="text-xl font-bold text-slate-800">Third-Party Access</h2></div>
          <div className="p-6 divide-y divide-slate-300">
             <div className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                <div className="flex items-start space-x-4">
                    <NetworkIcon className="w-6 h-6 text-slate-500 mt-0.5 flex-shrink-0"/>
                    <div>
                        <p className="font-medium text-slate-700">Apex Assurance</p>
                        <p className="text-sm text-slate-500">Access to transaction history for insurance quotes.</p>
                    </div>
                </div>
                <button className="px-3 py-1.5 text-sm font-medium text-red-600 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                    Revoke
                </button>
            </div>
          </div>
        </div>
      </div>
      {isLimitsModalOpen && (
        <ManageLimitsModal 
          limits={transferLimits}
          onSave={handleSaveLimits}
          onClose={() => setIsLimitsModalOpen(false)}
        />
      )}
      {isVerificationModalOpen && (
        <VerificationCenter 
            currentLevel={verificationLevel}
            onClose={handleVerificationModalClose}
        />
      )}
    </>
  );
};