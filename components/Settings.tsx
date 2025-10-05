import React, { useState, useMemo } from 'react';
import { CheckCircleIcon, PencilIcon, DevicePhoneMobileIcon, FingerprintIcon, LockClosedIcon, UserCircleIcon, NetworkIcon, IdentificationIcon, ComputerDesktopIcon } from './Icons';
import { TransferLimits, VerificationLevel, SecuritySettings, TrustedDevice } from '../types';
import { ManageLimitsModal } from './ManageLimitsModal';
import { VerificationCenter } from './VerificationCenter';
import { Setup2FAModal } from './Setup2FAModal';
import { SetupBiometricsModal } from './SetupBiometricsModal';

interface SettingsProps {
  transferLimits: TransferLimits;
  onUpdateLimits: (newLimits: TransferLimits) => void;
  verificationLevel: VerificationLevel;
  onVerificationComplete: (level: VerificationLevel) => void;
  securitySettings: SecuritySettings;
  onUpdateSecuritySettings: (newSettings: Partial<SecuritySettings>) => void;
  trustedDevices: TrustedDevice[];
  onRevokeDevice: (deviceId: string) => void;
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


export const Security: React.FC<SettingsProps> = ({ 
    transferLimits, 
    onUpdateLimits, 
    verificationLevel, 
    onVerificationComplete,
    securitySettings,
    onUpdateSecuritySettings,
    trustedDevices,
    onRevokeDevice
}) => {
  const [isLimitsModalOpen, setIsLimitsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isBiometricsModalOpen, setIsBiometricsModalOpen] = useState(false);

  const securityScore = useMemo(() => {
    let score = 25; // Base score
    if (securitySettings.mfaEnabled) score += 25;
    if (securitySettings.biometricsEnabled) score += 25;
    if (verificationLevel === VerificationLevel.LEVEL_1) score += 12.5;
    if (verificationLevel === VerificationLevel.LEVEL_2) score += 25;
    return Math.round(score);
  }, [securitySettings, verificationLevel]);

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

    const TrustedDeviceRow: React.FC<{ device: TrustedDevice }> = ({ device }) => {
    const DeviceIcon = device.deviceType === 'desktop' ? ComputerDesktopIcon : DevicePhoneMobileIcon;
    return (
        <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center first:pt-0 last:pb-0">
            <div className="flex items-start space-x-4">
                <DeviceIcon className="w-6 h-6 text-slate-500 mt-0.5 flex-shrink-0"/>
                <div>
                    <p className="font-medium text-slate-700 flex items-center">{device.browser} {device.isCurrent && <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Current</span>}</p>
                    <p className="text-sm text-slate-500">{device.location} • Last login: {new Date(device.lastLogin).toLocaleDateString()}</p>
                </div>
            </div>
            {!device.isCurrent && (
                <button onClick={() => onRevokeDevice(device.id)} className="mt-2 sm:mt-0 px-3 py-1.5 text-sm font-medium text-red-600 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                    Revoke
                </button>
            )}
        </div>
    );
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
                    <div className={`flex items-center space-x-3 text-sm ${securitySettings.biometricsEnabled ? 'text-green-600' : 'text-slate-600'}`}>
                        <CheckCircleIcon className={`w-5 h-5 ${securitySettings.biometricsEnabled ? '' : 'text-slate-300'}`} />
                        <span>Biometric Login is {securitySettings.biometricsEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                     <div className={`flex items-center space-x-3 text-sm ${securitySettings.mfaEnabled ? 'text-green-600' : 'text-slate-600'}`}>
                        <CheckCircleIcon className={`w-5 h-5 ${securitySettings.mfaEnabled ? '' : 'text-slate-300'}`} />
                        <span>Two-Factor Authentication is {securitySettings.mfaEnabled ? 'Enabled' : 'Disabled'}</span>
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
                 {securitySettings.biometricsEnabled ? (
                    <button onClick={() => onUpdateSecuritySettings({ biometricsEnabled: false })} className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                        Disable
                    </button>
                 ) : (
                    <button onClick={() => setIsBiometricsModalOpen(true)} className="px-3 py-1.5 text-sm font-medium text-primary bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                        Enable
                    </button>
                 )}
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
                        <p className="font-medium text-slate-700">Two-Factor Authentication (2FA)</p>
                        <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                    </div>
                </div>
                {securitySettings.mfaEnabled ? (
                    <button onClick={() => onUpdateSecuritySettings({ mfaEnabled: false })} className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                        Disable
                    </button>
                ) : (
                    <button onClick={() => setIs2FAModalOpen(true)} className="px-3 py-1.5 text-sm font-medium text-primary bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                        Enable
                    </button>
                )}
            </div>
          </div>
        </div>
        
        <div className="bg-slate-200 rounded-2xl shadow-digital">
          <div className="p-6 border-b border-slate-300"><h2 className="text-xl font-bold text-slate-800">Trusted Devices & Sessions</h2></div>
          <div className="p-6 divide-y divide-slate-300">
             {trustedDevices.map(device => <TrustedDeviceRow key={device.id} device={device} />)}
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
       {is2FAModalOpen && (
          <Setup2FAModal 
            onClose={() => setIs2FAModalOpen(false)}
            onEnable={() => onUpdateSecuritySettings({ mfaEnabled: true })}
          />
      )}
      {isBiometricsModalOpen && (
          <SetupBiometricsModal 
            onClose={() => setIsBiometricsModalOpen(false)}
            onEnable={() => onUpdateSecuritySettings({ biometricsEnabled: true })}
          />
      )}
    </>
  );
};