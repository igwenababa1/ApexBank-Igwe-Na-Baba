import React, { useState, useEffect } from 'react';
import { Recipient, Country } from '../types';
import { SUPPORTED_COUNTRIES } from '../constants';
import { getCountryBankingTip } from '../services/geminiService';
import { InfoIcon, SpinnerIcon } from './Icons';

interface AddRecipientModalProps {
  onClose: () => void;
  onAddRecipient: (recipient: Omit<Recipient, 'id'>) => void;
}

export const AddRecipientModal: React.FC<AddRecipientModalProps> = ({ onClose, onAddRecipient }) => {
  const [fullName, setFullName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [swiftBic, setSwiftBic] = useState('');
  const [country, setCountry] = useState<Country | undefined>(undefined);
  const [bankingTip, setBankingTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  useEffect(() => {
    if (country) {
      setIsLoadingTip(true);
      setBankingTip(null);
      getCountryBankingTip(country.name).then(tip => {
        setBankingTip(tip);
        setIsLoadingTip(false);
      });
    }
  }, [country]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !bankName || !accountNumber || !swiftBic || !country) {
      alert('Please fill all fields');
      return;
    }
    onAddRecipient({ fullName, bankName, accountNumber, swiftBic, country });
  };
  
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = SUPPORTED_COUNTRIES.find(c => c.code === e.target.value);
    setCountry(selectedCountry);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Recipient</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
              <select id="country" onChange={handleCountryChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary" required>
                <option value="">Select a country</option>
                {SUPPORTED_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
             {(isLoadingTip || bankingTip) && (
              <div className="bg-primary-50 border-l-4 border-primary text-primary-700 p-3 rounded-md flex items-start space-x-3">
                {isLoadingTip ? <SpinnerIcon className="w-5 h-5 mt-0.5" /> : <InfoIcon className="w-5 h-5 mt-0.5" />}
                <p className="text-sm">{isLoadingTip ? 'Getting banking tips...' : bankingTip}</p>
              </div>
            )}
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-slate-700">Bank Name</label>
              <input type="text" id="bankName" value={bankName} onChange={e => setBankName(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700">Account Number / IBAN</label>
              <input type="text" id="accountNumber" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary" required />
            </div>
            <div>
              <label htmlFor="swiftBic" className="block text-sm font-medium text-slate-700">SWIFT / BIC Code</label>
              <input type="text" id="swiftBic" value={swiftBic} onChange={e => setSwiftBic(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Government ID (for KYC)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md bg-slate-50 opacity-60 cursor-not-allowed">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm text-slate-600">
                    ID Upload for verification
                  </p>
                  <p className="text-xs text-slate-500 font-semibold bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full inline-block">
                    Functionality Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600">Add Recipient</button>
          </div>
        </form>
      </div>
    </div>
  );
};
