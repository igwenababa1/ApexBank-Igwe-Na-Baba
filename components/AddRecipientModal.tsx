import React, { useState, useEffect, useMemo } from 'react';
import { Country, Recipient } from '../types';
import { SUPPORTED_COUNTRIES, BANKS_BY_COUNTRY } from '../constants';
import { getCountryBankingTip, BankingTipResult } from '../services/geminiService';
import { sendSmsNotification, sendTransactionalEmail, generateOtpEmail, generateOtpSms } from '../services/notificationService';
import { InfoIcon, SpinnerIcon, ShieldCheckIcon } from './Icons';

interface AddRecipientModalProps {
  onClose: () => void;
  onAddRecipient: (data: {
    fullName: string;
    bankName: string;
    accountNumber: string;
    swiftBic: string;
    country: Country;
    cashPickupEnabled: boolean;
    streetAddress: string;
    city: string;
    stateProvince: string;
    postalCode: string;
  }) => void;
  recipientToEdit?: Recipient | null;
  onUpdateRecipient?: (recipientId: string, data: any) => void;
}

type ModalStep = 'form' | 'otp';
const USER_EMAIL = "randy.m.chitwood@apexbank.com";
const USER_NAME = "Randy M. Chitwood";
const USER_PHONE = "+1-555-012-1234";

const getCountryConfig = (countryCode?: string) => {
  switch (countryCode) {
    case 'US':
      return {
        field1: { name: 'routingNumber', label: 'Routing Number', placeholder: 'e.g., 110000000', maxLength: 9, format: (v: string) => v.replace(/\D/g, ''), validate: (v: string) => /^\d{9}$/.test(v) ? null : 'Must be 9 digits.' },
        field2: { name: 'accountNumber', label: 'Account Number', placeholder: 'e.g., 123456789', maxLength: 17, format: (v: string) => v.replace(/\D/g, ''), validate: (v: string) => v.length > 5 ? null : 'Account number is too short.' },
      };
    case 'GB':
       return {
        field1: { name: 'sortCode', label: 'Sort Code', placeholder: 'e.g., 20-30-40', maxLength: 8, format: (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1-').slice(0, 8), validate: (v: string) => v.replace(/-/g, '').length === 6 ? null : 'Must be 6 digits.' },
        field2: { name: 'accountNumber', label: 'Account Number', placeholder: 'e.g., 12345678', maxLength: 8, format: (v: string) => v.replace(/\D/g, ''), validate: (v: string) => v.length === 8 ? null : 'Must be 8 digits.' },
      };
    case 'DE':
    case 'FR':
      return {
        field1: { name: 'iban', label: 'IBAN', placeholder: 'e.g., DE89370400440532013000', maxLength: 34, format: (v: string) => v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(), validate: (v: string) => v.length >= 15 ? null : 'IBAN is too short.' },
        field2: { name: 'swiftBic', label: 'BIC/SWIFT', placeholder: 'e.g., COBADEFFXXX', maxLength: 11, format: (v: string) => v.toUpperCase(), validate: (v: string) => /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(v) ? null : 'Invalid BIC/SWIFT code.' },
      };
    default:
      return {
        field1: { name: 'accountNumber', label: 'Account Number / IBAN', placeholder: 'Enter account number or IBAN', maxLength: 34, format: (v: string) => v, validate: (v: string) => v.length > 5 ? null : 'Number is too short.' },
        field2: { name: 'swiftBic', label: 'SWIFT / BIC', placeholder: 'Enter SWIFT / BIC code', maxLength: 11, format: (v: string) => v.toUpperCase(), validate: (v: string) => /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(v) ? null : 'Invalid SWIFT/BIC code.' },
      };
  }
};

const getAddressConfig = (countryCode?: string) => {
    switch (countryCode) {
        case 'US':
            return {
                stateLabel: 'State',
                postalCodeLabel: 'ZIP Code',
                postalCodePlaceholder: 'e.g., 90210',
                validatePostalCode: (v: string) => /^\d{5}(-\d{4})?$/.test(v) ? null : 'Must be a 5-digit ZIP code.'
            };
        case 'GB':
            return {
                stateLabel: 'County (Optional)',
                postalCodeLabel: 'Postcode',
                postalCodePlaceholder: 'e.g., SW1A 0AA',
                validatePostalCode: (v: string) => /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(v) ? null : 'Invalid UK postcode format.'
            };
        case 'CA':
            return {
                stateLabel: 'Province',
                postalCodeLabel: 'Postal Code',
                postalCodePlaceholder: 'e.g., A1A 1A1',
                validatePostalCode: (v: string) => /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/i.test(v) ? null : 'Invalid Canadian postal code format.'
            };
        default:
            return {
                stateLabel: 'State / Province',
                postalCodeLabel: 'Postal Code',
                postalCodePlaceholder: 'Enter postal code',
                validatePostalCode: (v: string) => v.length > 2 ? null : 'Postal code is too short.'
            };
    }
};


export const AddRecipientModal: React.FC<AddRecipientModalProps> = ({ onClose, onAddRecipient, recipientToEdit, onUpdateRecipient }) => {
  const isEditMode = !!recipientToEdit;
  
  const [step, setStep] = useState<ModalStep>('form');
  const [formData, setFormData] = useState({
    fullName: recipientToEdit?.fullName || '',
    bankName: recipientToEdit?.bankName || '',
    country: recipientToEdit?.country || SUPPORTED_COUNTRIES[0],
    cashPickupEnabled: recipientToEdit?.deliveryOptions.cashPickup || false,
    streetAddress: recipientToEdit?.streetAddress || '',
    city: recipientToEdit?.city || '',
    stateProvince: recipientToEdit?.stateProvince || '',
    postalCode: recipientToEdit?.postalCode || '',
  });

  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    swiftBic: '',
    routingNumber: '',
    sortCode: '',
    iban: '',
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [bankingTip, setBankingTip] = useState<BankingTipResult | null>(null);
  const [isTipLoading, setIsTipLoading] = useState(false);
  
  const [otp, setOtp] = useState('');
  const [formDataForOtp, setFormDataForOtp] = useState<any>(null);

  const countryConfig = useMemo(() => getCountryConfig(formData.country.code), [formData.country.code]);
  const addressConfig = useMemo(() => getAddressConfig(formData.country.code), [formData.country.code]);

  useEffect(() => {
    if (!recipientToEdit) return;

    let detailsToSet = { accountNumber: '', swiftBic: '', routingNumber: '', sortCode: '', iban: '' };

    switch (recipientToEdit.country.code) {
        case 'US':
            detailsToSet.routingNumber = recipientToEdit.realDetails.swiftBic; // Remap
            detailsToSet.accountNumber = recipientToEdit.realDetails.accountNumber;
            break;
        case 'GB':
            detailsToSet.sortCode = recipientToEdit.realDetails.swiftBic; // Remap
            detailsToSet.accountNumber = recipientToEdit.realDetails.accountNumber;
            break;
        case 'DE':
        case 'FR':
            detailsToSet.iban = recipientToEdit.realDetails.accountNumber; // Remap
            detailsToSet.swiftBic = recipientToEdit.realDetails.swiftBic;
            break;
        default:
            detailsToSet.accountNumber = recipientToEdit.realDetails.accountNumber;
            detailsToSet.swiftBic = recipientToEdit.realDetails.swiftBic;
            break;
    }
    setBankDetails(detailsToSet);
  }, [recipientToEdit]);

  useEffect(() => {
    const fetchTip = async () => {
        setIsTipLoading(true);
        const result = await getCountryBankingTip(formData.country.name);
        setBankingTip(result);
        setIsTipLoading(false);
    };
    fetchTip();
  }, [formData.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const config = name === 'routingNumber' || name === 'accountNumber'
        ? countryConfig.field2.name === name ? countryConfig.field2 : countryConfig.field1
        : countryConfig.field1.name === name ? countryConfig.field1 : countryConfig.field2;
    
    // @ts-ignore
    const formattedValue = config.format ? config.format(value) : value;

    setBankDetails(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = SUPPORTED_COUNTRIES.find(c => c.code === e.target.value);
    if (country) {
      setFormData(prev => ({ ...prev, country, bankName: '', stateProvince: '', postalCode: '' }));
      // Reset bank details when country changes to avoid validation issues
      setBankDetails({ accountNumber: '', swiftBic: '', routingNumber: '', sortCode: '', iban: '' });
      setErrors({});
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string | null> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required.';

    // Address validations
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (addressConfig.stateLabel.includes('Optional') === false && !formData.stateProvince.trim()) {
        newErrors.stateProvince = `${addressConfig.stateLabel} is required.`;
    }
    const postalCodeError = addressConfig.validatePostalCode(formData.postalCode);
    if (postalCodeError) newErrors.postalCode = postalCodeError;


    if (countryConfig.field1) {
        // @ts-ignore
        const value = bankDetails[countryConfig.field1.name] || '';
        const error = countryConfig.field1.validate(value);
        if (error) newErrors[countryConfig.field1.name] = error;
    }
     if (countryConfig.field2) {
        // @ts-ignore
        const value = bankDetails[countryConfig.field2.name] || '';
        const error = countryConfig.field2.validate(value);
        if (error) newErrors[countryConfig.field2.name] = error;
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(e => e === null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let finalAccountNumber = '';
    let finalSwiftBic = '';

    switch (formData.country.code) {
        case 'US':
            finalAccountNumber = bankDetails.accountNumber;
            finalSwiftBic = bankDetails.routingNumber;
            break;
        case 'GB':
            finalAccountNumber = bankDetails.accountNumber;
            finalSwiftBic = bankDetails.sortCode.replace(/-/g, '');
            break;
        case 'DE':
        case 'FR':
            finalAccountNumber = bankDetails.iban;
            finalSwiftBic = bankDetails.swiftBic;
            break;
        default:
            finalAccountNumber = bankDetails.accountNumber;
            finalSwiftBic = bankDetails.swiftBic;
            break;
    }

    const dataForOtp = {
      ...formData,
      accountNumber: finalAccountNumber,
      swiftBic: finalSwiftBic
    };

    setFormDataForOtp(dataForOtp);
    setIsProcessing(true);
    
    // Simulate OTP sending
    const { subject, body } = generateOtpEmail(USER_NAME);
    sendTransactionalEmail(USER_EMAIL, subject, body);
    sendSmsNotification(USER_PHONE, generateOtpSms());
    
    setTimeout(() => {
        setIsProcessing(false);
        setStep('otp');
    }, 1500);
  };
  
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) { // Simple validation
        setIsProcessing(true);
        setTimeout(() => {
            if (isEditMode && onUpdateRecipient) {
                onUpdateRecipient(recipientToEdit.id, formDataForOtp);
            } else {
                onAddRecipient(formDataForOtp);
            }
            onClose();
        }, 1000);
    } else {
        setErrors({ otp: 'Please enter a valid 6-digit code.' });
    }
  };

  const renderField = (fieldConfig: any) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{fieldConfig.label}</label>
        <input 
            type="text" 
            name={fieldConfig.name} 
            // @ts-ignore
            value={bankDetails[fieldConfig.name]} 
            onChange={handleBankDetailsChange}
            className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors[fieldConfig.name] ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`}
            placeholder={fieldConfig.placeholder}
            maxLength={fieldConfig.maxLength}
        />
        {errors[fieldConfig.name] && <p className="text-red-500 text-xs mt-1">{errors[fieldConfig.name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-slate-200 rounded-2xl shadow-digital p-8 w-full max-w-lg m-4 overflow-y-auto max-h-screen">
        {step === 'form' ? (
        <>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{isEditMode ? 'Edit' : 'Add New'} Recipient</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Recipient's Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset ${errors.fullName ? 'ring-2 ring-red-500' : ''}`} />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Receiving Country</label>
                    <select name="country" value={formData.country.code} onChange={handleCountryChange} className="mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset">
                        {SUPPORTED_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                </div>

                <div className="pt-2">
                    <h3 className="font-semibold text-slate-700 mb-2">Recipient's Address</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Street Address</label>
                            <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.streetAddress ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} />
                            {errors.streetAddress && <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.city ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} />
                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">{addressConfig.stateLabel}</label>
                                <input type="text" name="stateProvince" value={formData.stateProvince} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.stateProvince ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} />
                                {errors.stateProvince && <p className="text-red-500 text-xs mt-1">{errors.stateProvince}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">{addressConfig.postalCodeLabel}</label>
                            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.postalCode ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} placeholder={addressConfig.postalCodePlaceholder} />
                            {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Bank Name</label>
                    <select name="bankName" value={formData.bankName} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset ${errors.bankName ? 'ring-2 ring-red-500' : ''}`}>
                        <option value="">Select a bank...</option>
                        {(BANKS_BY_COUNTRY[formData.country.code] || []).map(bank => <option key={bank} value={bank}>{bank}</option>)}
                    </select>
                     {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
                </div>
                
                <div className="pt-2">
                    <h3 className="font-semibold text-slate-700 mb-2">Bank Details</h3>
                    <div className="space-y-4">
                       {countryConfig.field1 && renderField(countryConfig.field1)}
                       {countryConfig.field2 && renderField(countryConfig.field2)}
                    </div>
                </div>

                {bankingTip && (
                    <div className={`flex items-start space-x-3 p-3 rounded-lg text-sm ${bankingTip.isError ? 'bg-yellow-100 text-yellow-800' : 'bg-primary-50 text-primary-800'}`}>
                        {isTipLoading ? <SpinnerIcon className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                        <span>{bankingTip.tip}</span>
                    </div>
                )}
                
                <div className="flex items-center">
                    <input type="checkbox" id="cashPickup" name="cashPickupEnabled" checked={formData.cashPickupEnabled} onChange={handleChange} className="h-4 w-4 rounded" />
                    <label htmlFor="cashPickup" className="ml-2 text-sm text-slate-700">Enable cash pickup for this recipient (where available)</label>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset">Cancel</button>
                    <button type="submit" disabled={isProcessing} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-md hover:shadow-lg flex items-center">
                       {isProcessing ? <SpinnerIcon className="w-5 h-5 mr-2"/> : null}
                       {isProcessing ? 'Proceeding...' : 'Continue'}
                    </button>
                </div>
            </form>
        </>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4 shadow-digital">
                <ShieldCheckIcon className="w-8 h-8 text-primary"/>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Final Security Check</h2>
            <p className="text-slate-500 my-4">For your protection, please enter the 6-digit verification code sent to your registered phone and email address.</p>
            <form onSubmit={handleOtpSubmit}>
                <input 
                    type="text" 
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    className={`w-48 mx-auto bg-slate-200 border-0 p-3 text-center text-3xl tracking-[.75em] rounded-md shadow-digital-inset focus:ring-2 ${errors.otp ? 'ring-2 ring-red-500' : 'focus:ring-primary-400'}`}
                    maxLength={6}
                    placeholder="------"
                    autoFocus
                />
                {errors.otp && <p className="text-red-500 text-xs mt-2">{errors.otp}</p>}
                <div className="mt-8 flex justify-end space-x-3">
                    <button type="button" onClick={() => setStep('form')} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset">Back</button>
                    <button type="submit" disabled={isProcessing} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-md hover:shadow-lg flex items-center">
                        {isProcessing ? <SpinnerIcon className="w-5 h-5 mr-2"/> : null}
                        {isProcessing ? 'Verifying...' : (isEditMode ? 'Update Recipient' : 'Add Recipient')}
                    </button>
                </div>
            </form>
          </div>  
        )}
      </div>
    </div>
  );
};