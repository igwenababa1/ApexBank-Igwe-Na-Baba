import React, { useState } from 'react';
import { ClipboardDocumentIcon, DocumentTextIcon, CheckCircleIcon, PencilIcon, DevicePhoneMobileIcon, FingerprintIcon, ClockIcon, LockClosedIcon } from './Icons';
import { TransferLimits } from '../types';
import { ManageLimitsModal } from './ManageLimitsModal';

const ACCOUNT_DETAILS = {
  routing: '123456789',
  account: '987654321',
};

const MONTHLY_STATEMENTS = [
  { id: 'stmt_1', month: 'August', year: 2024, file: 'statement-2024-08.pdf' },
  { id: 'stmt_2', month: 'July', year: 2024, file: 'statement-2024-07.pdf' },
  { id: 'stmt_3', month: 'June', year: 2024, file: 'statement-2024-06.pdf' },
];

interface SettingsProps {
  transferLimits: TransferLimits;
  onUpdateLimits: (newLimits: TransferLimits) => void;
}

const SettingsCard: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <div className="bg-slate-200 rounded-2xl shadow-digital">
    <div className="p-6 border-b border-slate-300 flex justify-between items-center">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {action}
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const LimitDisplay: React.FC<{ label: string; amount: number; count: number }> = ({ label, amount, count }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-slate-600">{label}</span>
    <div className="text-right">
      <p className="font-semibold text-slate-800">{amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
      <p className="text-sm text-slate-500">{count} transactions</p>
    </div>
  </div>
);

export const Settings: React.FC<SettingsProps> = ({ transferLimits, onUpdateLimits }) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  const handleCopyToClipboard = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };
  
  const handleSaveLimits = (newLimits: TransferLimits) => {
    onUpdateLimits(newLimits);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        <SettingsCard title="Profile Information">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500">Full Name</label>
              <p className="text-slate-800 font-semibold">Eleanor Vance</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500">Email Address</label>
              <p className="text-slate-800 font-semibold">eleanor.vance@apexbank.com</p>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Security Settings">
            <div className="divide-y divide-slate-300">
                <div className="py-4 flex justify-between items-center">
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

                <div className="py-4 flex justify-between items-center">
                    <div className="flex items-start space-x-4">
                        <FingerprintIcon className="w-6 h-6 text-slate-500 mt-0.5 flex-shrink-0"/>
                        <div>
                            <p className="font-medium text-slate-700">Biometric Login</p>
                            <p className="text-sm text-slate-500">Sign in quickly and securely with your face or fingerprint.</p>
                        </div>
                    </div>
                     <label htmlFor="bio-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="bio-toggle" className="sr-only peer" checked={biometricsEnabled} onChange={() => setBiometricsEnabled(prev => !prev)} />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer shadow-digital-inset peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-digital peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="py-4 flex justify-between items-center">
                    <div className="flex items-start space-x-4">
                        <ClockIcon className="w-6 h-6 text-slate-500 mt-0.5 flex-shrink-0"/>
                        <div>
                            <p className="font-medium text-slate-700">Login History</p>
                            <p className="text-sm text-slate-500">Review recent sign-in activity on your account.</p>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                        View Activity
                    </button>
                </div>
                
                <div className="py-4 flex justify-between items-center">
                    <div className="flex items-start space-x-4">
                        <LockClosedIcon className="w-6 h-6 text-slate-500 mt-0.5 flex-shrink-0"/>
                        <div>
                            <p className="font-medium text-slate-700">Change Password</p>
                            <p className="text-sm text-slate-500">Keep your account secure by regularly updating your password.</p>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                        Change
                    </button>
                </div>
            </div>
        </SettingsCard>

        <SettingsCard title="Transfer Limits" action={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Manage</span>
          </button>
        }>
          <div className="divide-y divide-slate-300">
            <LimitDisplay label="Daily Limit" amount={transferLimits.daily.amount} count={transferLimits.daily.count} />
            <LimitDisplay label="Weekly Limit" amount={transferLimits.weekly.amount} count={transferLimits.weekly.count} />
            <LimitDisplay label="Monthly Limit" amount={transferLimits.monthly.amount} count={transferLimits.monthly.count} />
          </div>
        </SettingsCard>

        <SettingsCard title="Account Details">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium text-slate-500">Routing Number (ACH)</label>
                <p className="text-slate-800 font-mono text-lg">{ACCOUNT_DETAILS.routing}</p>
              </div>
              <button
                onClick={() => handleCopyToClipboard(ACCOUNT_DETAILS.routing, 'routing')}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-all"
              >
                {copiedItem === 'routing' ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium text-slate-500">Account Number</label>
                <p className="text-slate-800 font-mono text-lg">{ACCOUNT_DETAILS.account}</p>
              </div>
              <button
                onClick={() => handleCopyToClipboard(ACCOUNT_DETAILS.account, 'account')}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-all"
              >
                {copiedItem === 'account' ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </SettingsCard>
        
        <SettingsCard title="Monthly Statements">
          <ul className="divide-y divide-slate-300">
            {MONTHLY_STATEMENTS.map(statement => (
              <li key={statement.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-800">{statement.month} {statement.year} Statement</p>
                  <p className="text-sm text-slate-500">{statement.file}</p>
                </div>
                <button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </li>
            ))}
          </ul>
        </SettingsCard>
      </div>
      {isModalOpen && (
        <ManageLimitsModal 
          limits={transferLimits}
          onSave={handleSaveLimits}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
