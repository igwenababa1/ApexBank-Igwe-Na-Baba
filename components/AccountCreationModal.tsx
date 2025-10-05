import React, { useState, useEffect } from 'react';
import {
    SpinnerIcon,
    UserCircleIcon,
    HomeIcon,
    IdentificationIcon,
    LockClosedIcon,
    CheckCircleIcon,
    ApexBankLogo
} from './Icons';
import { SUPPORTED_COUNTRIES } from '../constants';
import { Country } from '../types';
import { AccountProvisioningAnimation } from './AccountProvisioningAnimation';

interface AccountCreationModalProps {
    onClose: () => void;
    onCreateAccountSuccess: () => void;
}

const StepIndicator: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; isCompleted: boolean }> = ({ icon, label, isActive, isCompleted }) => (
    <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500 shadow-digital-inset'}`}>
            {isCompleted ? <CheckCircleIcon className="w-7 h-7" /> : icon}
        </div>
        <p className={`mt-2 text-xs text-center font-medium ${isActive || isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>{label}</p>
    </div>
);


export const AccountCreationModal: React.FC<AccountCreationModalProps> = ({ onClose, onCreateAccountSuccess }) => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: SUPPORTED_COUNTRIES[0],
        password: '',
        confirmPassword: '',
        pin: '',
        agreedToTerms: false,
    });
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [isProvisioning, setIsProvisioning] = useState(false);
    const [idFileName, setIdFileName] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const steps = [
        { label: 'Personal Info', icon: <UserCircleIcon className="w-6 h-6" /> },
        { label: 'Address', icon: <HomeIcon className="w-6 h-6" /> },
        { label: 'Identity', icon: <IdentificationIcon className="w-6 h-6" /> },
        { label: 'Security', icon: <LockClosedIcon className="w-6 h-6" /> },
        { label: 'Review', icon: <CheckCircleIcon className="w-6 h-6" /> },
    ];
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const country = SUPPORTED_COUNTRIES.find(c => c.code === e.target.value);
        if (country) {
            setFormData(prev => ({ ...prev, country }));
        }
    };
    
    const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIdFileName(file.name);
            setUploadProgress(0);
            
            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 150);
        }
    };

    const validateStep = () => {
        const newErrors: Record<string, string | null> = {};
        switch (step) {
            case 0: // Personal Info
                if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address.';
                if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number format.';
                break;
            case 1: // Address
                if (!formData.address.trim()) newErrors.address = 'Address is required.';
                if (!formData.city.trim()) newErrors.city = 'City is required.';
                if (!formData.state.trim()) newErrors.state = 'State/Province is required.';
                if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required.';
                break;
            case 2: // Identity
                if (!idFileName) newErrors.idFile = 'ID upload is required.';
                if (uploadProgress < 100) newErrors.idFile = 'Please wait for upload to complete.';
                break;
            case 3: // Security
                if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
                if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
                if (!/^\d{4}$/.test(formData.pin)) newErrors.pin = 'PIN must be exactly 4 digits.';
                break;
            case 4: // Review
                if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms.';
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 0));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep()) {
            setIsProvisioning(true);
        }
    };

    if (isProvisioning) {
        return <AccountProvisioningAnimation onComplete={onCreateAccountSuccess} />;
    }

    const renderStepContent = () => {
        switch (step) {
            case 0: // Personal Info
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.fullName ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.email ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} />
                             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.phone ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} placeholder="+15551234567" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                    </div>
                );
            case 1: // Address
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800">Home Address</h3>
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Street Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.address ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} />
                             {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.city ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} />
                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">State / Province</label>
                                <input type="text" name="state" value={formData.state} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.state ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} />
                                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Postal / ZIP Code</label>
                                <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.postalCode ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} />
                                {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Country</label>
                                <select name="country" value={formData.country.code} onChange={handleCountryChange} className="mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary">
                                    {SUPPORTED_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                );
             case 2: // Identity
                return (
                     <div className="space-y-4 text-center">
                        <h3 className="text-xl font-bold text-slate-800">Identity Verification</h3>
                        <p className="text-sm text-slate-600">To comply with financial regulations and keep your account secure, please upload a government-issued photo ID (e.g., Passport, Driver's License).</p>
                        <div className="p-4 rounded-lg shadow-digital-inset border-2 border-dashed border-slate-300">
                           <input type="file" id="id-upload" className="hidden" onChange={handleIdUpload} accept="image/png, image/jpeg, application/pdf" />
                           <label htmlFor="id-upload" className="cursor-pointer font-medium text-primary hover:underline">
                                {idFileName ? 'Change file...' : 'Choose a file to upload...'}
                           </label>
                           {idFileName && (
                               <div className="mt-3">
                                   <p className="text-sm text-slate-700 font-medium truncate">{idFileName}</p>
                                   <div className="w-full bg-slate-300 rounded-full h-2.5 mt-2">
                                       <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{width: `${uploadProgress}%`}}></div>
                                   </div>
                                   <p className="text-xs text-slate-500 mt-1">{uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Upload Complete!'}</p>
                               </div>
                           )}
                        </div>
                        {errors.idFile && <p className="text-red-500 text-xs mt-1">{errors.idFile}</p>}
                    </div>
                );
            case 3: // Security
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800">Account Security</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.password ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} />
                             {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 ${errors.confirmPassword ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700">4-Digit Security PIN</label>
                            <input type="password" name="pin" value={formData.pin} onChange={e => setFormData(prev => ({...prev, pin: e.target.value.replace(/\D/g, '').slice(0, 4)}))} maxLength={4} className={`mt-1 w-full bg-slate-200 p-3 rounded-md shadow-digital-inset focus:ring-2 text-center tracking-[1em] ${errors.pin ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`} placeholder="----" />
                            {errors.pin && <p className="text-red-500 text-xs mt-1">{errors.pin}</p>}
                        </div>
                    </div>
                );
            case 4: // Review
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800">Review & Confirm</h3>
                        <div className="p-4 rounded-lg shadow-digital-inset space-y-2 text-sm">
                            <p><strong>Name:</strong> {formData.fullName}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Address:</strong> {`${formData.address}, ${formData.city}, ${formData.state} ${formData.postalCode}, ${formData.country.name}`}</p>
                        </div>
                        <div className="flex items-start">
                            <input type="checkbox" id="terms" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} className="h-4 w-4 rounded mt-1" />
                            <label htmlFor="terms" className="ml-2 text-sm text-slate-700">I agree to the ApexBank <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</label>
                        </div>
                         {errors.agreedToTerms && <p className="text-red-500 text-xs">{errors.agreedToTerms}</p>}
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-slate-200 rounded-2xl shadow-digital p-8 w-full max-w-2xl m-4 relative max-h-[90vh] flex flex-col">
                <div className="text-center mb-6">
                    <div className="inline-block p-2 rounded-full shadow-digital">
                        <ApexBankLogo />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mt-2">Create Your ApexBank Account</h2>
                </div>
                
                <div className="mb-8 px-4">
                    <div className="flex justify-between items-start">
                        {steps.map((s, index) => (
                             <React.Fragment key={s.label}>
                                <StepIndicator icon={s.icon} label={s.label} isActive={step === index} isCompleted={step > index} />
                                {index < steps.length - 1 && <div className={`flex-1 h-0.5 mt-6 transition-colors duration-300 ${step > index ? 'bg-green-500' : 'bg-slate-300'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                    {renderStepContent()}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-300 flex justify-between">
                    <button onClick={handleBack} disabled={step === 0} className="px-6 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset disabled:opacity-50">Back</button>
                    {step < steps.length - 1 ? (
                        <button onClick={handleNext} className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-md hover:shadow-lg">Next</button>
                    ) : (
                        <button onClick={handleSubmit} className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 flex items-center">
                            Finish & Create Account
                        </button>
                    )}
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};