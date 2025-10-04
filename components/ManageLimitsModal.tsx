
import React, { useState } from 'react';
import { TransferLimits } from '../types';

interface ManageLimitsModalProps {
  limits: TransferLimits;
  onSave: (newLimits: TransferLimits) => void;
  onClose: () => void;
}

const LimitInputGroup: React.FC<{
  period: 'daily' | 'weekly' | 'monthly';
  values: { amount: number; count: number };
  onChange: (period: 'daily' | 'weekly' | 'monthly', field: 'amount' | 'count', value: number) => void;
}> = ({ period, values, onChange }) => {
  const title = period.charAt(0).toUpperCase() + period.slice(1);
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title} Limits</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${period}-amount`} className="block text-sm font-medium text-slate-600">Max Amount (USD)</label>
          <input
            type="number"
            id={`${period}-amount`}
            value={values.amount}
            onChange={e => onChange(period, 'amount', parseInt(e.target.value, 10) || 0)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary"
            min="0"
          />
        </div>
        <div>
          <label htmlFor={`${period}-count`} className="block text-sm font-medium text-slate-600">Max Transactions</label>
          <input
            type="number"
            id={`${period}-count`}
            value={values.count}
            onChange={e => onChange(period, 'count', parseInt(e.target.value, 10) || 0)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};


export const ManageLimitsModal: React.FC<ManageLimitsModalProps> = ({ limits, onSave, onClose }) => {
  const [currentLimits, setCurrentLimits] = useState<TransferLimits>(limits);

  const handleChange = (period: 'daily' | 'weekly' | 'monthly', field: 'amount' | 'count', value: number) => {
    setCurrentLimits(prev => ({
      ...prev,
      [period]: {
        ...prev[period],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentLimits);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg m-4 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Manage Transfer Limits</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <LimitInputGroup period="daily" values={currentLimits.daily} onChange={handleChange} />
          <LimitInputGroup period="weekly" values={currentLimits.weekly} onChange={handleChange} />
          <LimitInputGroup period="monthly" values={currentLimits.monthly} onChange={handleChange} />

          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
