import React, { useState, useEffect } from 'react';
import { Country } from '../types';
import { SUPPORTED_COUNTRIES, BANKS_BY_COUNTRY } from '../constants';
// FIX: The notification-related functions were being imported from `geminiService` instead of `notificationService`.
import { getCountryBankingTip, BankingTipResult } from '../services/geminiService';
import { sendSmsNotification, sendTransactionalEmail, generateOtpEmail, generateOtpSms } from '../services/notificationService';
import { InfoIcon, SpinnerIcon, ShieldCheckIcon } from './Icons';
import { validateAccountNumber, validateSwiftBic } from '../utils/validation';

interface AddRecipientModalProps {
  onClose: () => void;
  onAddRecipient: (data: {
    fullName: string;
    bankName: string;
    accountNumber: string;
    swiftBic: string;
    country: Country;
    cashPickupEnabled: boolean;
  }) => void;
}

type ModalStep = 'form' | 'otp';
const USER_EMAIL = "eleanor.vance@apexbank.com";
const USER_NAME = "Eleanor Vance";
const USER_PHONE = "+1-555-012-1234";

export const AddRecipientModal: React.FC<AddRecipientModalProps> = ({ onClose, onAddRecipient }) => {
  // Form state
  const [fullName, setFullName] = useState('');
  const [bankName, setBankName] = useState('');
  const [otherBankName, setOtherBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [swiftBic, setSwiftBic] = useState('');
  const [country, setCountry] = useState<Country | undefined>(undefined);
  const [cashPickupEnabled, setCashPickupEnabled] = useState(false);
  
  // Tip state
  const [bankingTip, setBankingTip] = useState<string | null>(null);
  const [isTipError, setIsTipError] = useState(false);
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  
  // Control state
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [modalStep, setModalStep] = useState<ModalStep>('form');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [recipientData, setRecipientData] = useState<{ fullName: string; bankName: string; accountNumber: string; swiftBic: string; country: Country; cashPickupEnabled: boolean; }>();


  useEffect(() => {
    if (country) {
      setIsLoadingTip(true);
      setBankingTip(null);
      setIsTipError(false);
      getCountryBankingTip(country.name).then((result: BankingTipResult) => {
        setBankingTip(result.tip);
        setIsTipError(result.isError);
        setIsLoadingTip(false);
      });
    } else {
      setBankingTip(null);
      setIsTipError(false);
    }
  }, [country]);

  const validateField = (name: string, value: string) => {
    let error: string | null = null;
    switch (name) {
        case 'fullName':
            error = !value.trim() ? "Full name is required." : null;
            break;
        case 'bankName':
            const finalBank = value === 'Other' ? otherBankName : value;
            error = !finalBank.trim() ? "Bank name is required." : null;
            setErrors(prev => ({ ...prev, bankName: error }));
            return;
        case 'accountNumber':
            error = validateAccountNumber(value);
            break;
        case 'swiftBic':
            error = validateSwiftBic(value);
            break;
        case 'country':
            error = !value ? "Country is required." : null;
            break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBankName = bankName === 'Other' ? otherBankName : bankName;
    const submissionErrors: Record<string, string | null> = {
      fullName: !fullName.trim() ? "Full name is required." : null,
      bankName: !finalBankName.trim() ? "Bank name is required." : null,
      country: !country ? "Country is required." : null,
      accountNumber: validateAccountNumber(accountNumber),
      swiftBic: validateSwiftBic(swiftBic),
    };

    const validErrors = Object.fromEntries(Object.entries(submissionErrors).filter(([_, v]) => v != null));
    setErrors(validErrors);

    if (Object.keys(validErrors).length === 0 && country) {
      const data = { fullName, bankName: finalBankName, accountNumber, swiftBic, country, cashPickupEnabled };
      setRecipientData(data);
      setModalStep('otp');

      // Simulate sending OTP alerts
      const { subject, body } = generateOtpEmail(USER_NAME);
      sendTransactionalEmail(USER_EMAIL, subject, body);
      sendSmsNotification(USER_PHONE, generateOtpSms());
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setErrors(prev => ({...prev, otp: null}));
    
    // Simulate API call for OTP verification
    setTimeout(() => {
        if (otp.length === 6) { // Simple validation for demo
            onAddRecipient(recipientData!);
        } else {
            setErrors(prev => ({...prev, otp: 'Please enter a valid 6-digit code.'}));
        }
        setIsVerifying(false);
    }, 1000);
  };
  
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    validateField('country', selectedCode);
    setBankName('');
    setOtherBankName('');
    setErrors(prev => ({ ...prev, bankName: null }));
    if (selectedCode === '') {
      setCountry(undefined);
    } else {
      const selectedCountry = SUPPORTED_COUNTRIES.find(c => c.code === selectedCode);
      setCountry(selectedCountry);
    }
  }

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[\W_]/g, ''); // Removes all non-word characters and underscores
    const formattedValue = rawValue.toUpperCase().replace(/(.{4})/g, '$1 ').trim();
    setAccountNumber(formattedValue);
  };

  const finalBankName = bankName === 'Other' ? otherBankName : bankName;
  const isFormInvalid = !fullName || !finalBankName || !accountNumber || !swiftBic || !country || Object.values(errors).some(e => e !== null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-200 rounded-2xl shadow-digital p-8 w-full max-w-md m-4 overflow-y-auto max-h-screen">
        {modalStep === 'form' ? (
          <>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Recipient</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" id="fullName" name="fullName" value={fullName} onChange={e => setFullName(e.target.value)} onBlur={handleBlur} className={`mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400 ${errors.fullName ? 'ring-2 ring-red-500' : ''}`} required />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
                  <select id="country" name="country" onChange={handleCountryChange} onBlur={handleBlur} defaultValue="" className={`mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400 ${errors.country ? 'ring-2 ring-red-500' : ''}`} required>
                    <option value="" disabled>Select a country</option>
                    {SUPPORTED_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                  {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                </div>
                 {(isLoadingTip || bankingTip) && (
                  <div className={`p-3 rounded-md flex items-start space-x-3 shadow-digital-inset ${isTipError ? 'bg-yellow-50 text-yellow-800' : 'bg-primary-50 text-primary-700'}`}>
                    {isLoadingTip ? <SpinnerIcon className="w-5 h-5 mt-0.5" /> : <InfoIcon className="w-5 h-5 mt-0.5" />}
                    <p className="text-sm">{isLoadingTip ? 'Getting banking tips...' : bankingTip}</p>
                  </div>
                )}
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-slate-700">Bank Name</label>
                   {country && BANKS_BY_COUNTRY[country.code] ? (
                    <select
                        id="bankName"
                        name="bankName"
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        onBlur={handleBlur}
                        className={`mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400 ${errors.bankName ? 'ring-2 ring-red-500' : ''}`}
                        required
                    >
                        <option value="" disabled>Select a bank</option>
                        {BANKS_BY_COUNTRY[country.code].map(b => <option key={b} value={b}>{b}</option>)}
                        <option value="Other">Other...</option>
                    </select>
                  ) : (
                      <input
                        type="text"
                        id="bankNameInput"
                        name="bankName"
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        onBlur={handleBlur}
                        className={`mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400 ${errors.bankName ? 'ring-2 ring-red-500' : ''}`}
                        required
                        placeholder={country ? "Enter bank name" : "Select a country first"}
                        disabled={!country}
                    />
                  )}
                  {bankName === 'Other' && (
                      <input
                          type="text"
                          id="otherBankName"
                          name="otherBankName"
                          value={otherBankName}
                          onChange={e => setOtherBankName(e.target.value)}
                          onBlur={(e) => validateField('bankName', 'Other')}
                          className={`mt-2 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400 ${errors.bankName ? 'ring-2 ring-red-500' : ''}`}
                          placeholder="Enter bank name"
                          required
                          autoFocus
                      />
                  )}
                  {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>}
                </div>
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700">Account Number / IBAN</label>
                  <input type="text" id="accountNumber" name="accountNumber" value={accountNumber} onChange={handleAccountNumberChange} onBlur={handleBlur} className={`mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400 font-mono tracking-wider ${errors.accountNumber ? 'ring-2 ring-red-500' : ''}`} required maxLength={42} placeholder="e.g., GB29 NWBK 6016 1331 9268 19"/>
                  {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>}
                </div>
                <div>
                  <label htmlFor="swiftBic" className="block text-sm font-medium text-slate-700">SWIFT / BIC Code</label>
                  <input type="text" id="swiftBic" name="swiftBic" value={swiftBic} onChange={e => setSwiftBic(e.target.value.toUpperCase())} onBlur={handleBlur} className={`mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400 font-mono tracking-wider ${errors.swiftBic ? 'ring-2 ring-red-500' : ''}`} required maxLength={11} placeholder="e.g., CHASUS33"/>
                  {errors.swiftBic && <p className="mt-1 text-sm text-red-600">{errors.swiftBic}</p>}
                </div>
                <div className="flex items-start pt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="cash-pickup"
                      name="cash-pickup"
                      type="checkbox"
                      checked={cashPickupEnabled}
                      onChange={(e) => setCashPickupEnabled(e.target.checked)}
                      className="focus:ring-primary h-4 w-4 text-primary border-slate-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="cash-pickup" className="font-medium text-slate-700">Enable Cash Pickup</label>
                    <p className="text-slate-500">Allow this recipient to pick up cash at designated locations.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:bg-primary-300 disabled:cursor-not-allowed" disabled={isFormInvalid}>Continue to Verification</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4 shadow-digital">
                  <ShieldCheckIcon className="w-8 h-8 text-primary"/>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Confirm New Recipient</h2>
              <p className="text-slate-500 text-sm">
                  To protect your account, please enter the 6-digit verification code sent to your phone and email to confirm adding <strong>{recipientData?.fullName}</strong>.
              </p>
            </div>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 sr-only">Verification Code</label>
                <input 
                  type="text" 
                  id="otp" 
                  value={otp} 
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                  className={`mt-1 block w-full bg-slate-200 border-0 p-3 text-center text-2xl tracking-[.5em] rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400 ${errors.otp ? 'ring-2 ring-red-500' : ''}`}
                  required 
                  placeholder="------"
                  maxLength={6}
                />
              </div>
              {errors.otp && <p className="text-sm text-red-600 text-center">{errors.otp}</p>}
              <div className="mt-8 flex space-x-3">
                 <button type="button" onClick={() => setModalStep('form')} className="w-full px-4 py-3 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow disabled:opacity-70" disabled={isVerifying}>Back</button>
                 <button 
                    type="submit" 
                    disabled={isVerifying}
                    className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-primary shadow-md hover:shadow-lg disabled:opacity-50 transition-shadow"
                  >
                    {isVerifying ? <SpinnerIcon className="w-5 h-5" /> : 'Verify & Add Recipient'}
                 </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};