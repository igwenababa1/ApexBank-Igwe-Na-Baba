
import React, { useState } from 'react';
import { ClipboardDocumentIcon, DocumentTextIcon, CheckCircleIcon, PencilIcon } from './Icons';
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
  <div className="bg-white shadow-md rounded-lg">
    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
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

        <SettingsCard title="Transfer Limits" action={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Manage</span>
          </button>
        }>
          <div className="divide-y divide-slate-200">
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
                className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
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
                className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
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
          <ul className="divide-y divide-slate-200">
            {MONTHLY_STATEMENTS.map(statement => (
              <li key={statement.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-800">{statement.month} {statement.year} Statement</p>
                  <p className="text-sm text-slate-500">{statement.file}</p>
                </div>
                <button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
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
