import React, { useState } from 'react';
import { Recipient, Country } from '../types';
import { AddRecipientModal } from './AddRecipientModal';
import { ChevronDownIcon, ClipboardDocumentIcon, CheckCircleIcon, BankIcon, CreditCardIcon, WithdrawIcon, getBankIcon, PencilIcon, getServiceIcon } from './Icons';

interface RecipientsProps {
    recipients: Recipient[];
    addRecipient: (data: {
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
    onUpdateRecipient: (recipientId: string, data: any) => void;
}

const DeliveryMethod: React.FC<{ icon: React.ReactNode; label: string; enabled: boolean }> = ({ icon, label, enabled }) => (
    <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${enabled ? 'bg-slate-200 shadow-digital' : 'bg-slate-200 opacity-50'}`}>
        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${enabled ? 'bg-green-100 text-green-600' : 'bg-slate-300 text-slate-500'}`}>
            {icon}
        </div>
        <div>
            <p className={`font-semibold text-sm ${enabled ? 'text-slate-700' : 'text-slate-500'}`}>{label}</p>
            <p className={`text-xs ${enabled ? 'text-green-600' : 'text-slate-500'}`}>{enabled ? 'Enabled' : 'Not Available'}</p>
        </div>
    </div>
);

const AccountDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex justify-between items-center">
            <div>
                <label className="block text-sm font-medium text-slate-500">{label}</label>
                <p className="text-slate-800 font-mono text-base">{value}</p>
            </div>
            <button
                onClick={handleCopy}
                className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-lg shadow-digital active:shadow-digital-inset transition-all duration-200 ${copied ? 'text-green-600' : 'text-primary'}`}
            >
                {copied ? (
                    <>
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Copied</span>
                    </>
                ) : (
                    <>
                        <ClipboardDocumentIcon className="w-4 h-4" />
                        <span>Copy</span>
                    </>
                )}
            </button>
        </div>
    );
};

const RecipientCard: React.FC<{ recipient: Recipient; onEdit: (recipient: Recipient) => void; }> = ({ recipient, onEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { deliveryOptions, realDetails, recipientType, serviceName } = recipient;
    
    const isServiceRecipient = recipientType === 'service' && serviceName;
    const Icon = isServiceRecipient ? getServiceIcon(serviceName) : getBankIcon(recipient.bankName);

    return (
        <div className="bg-slate-200 rounded-2xl shadow-digital transition-shadow duration-300">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-grow cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-600 text-xl shadow-digital-inset p-1">
                        <Icon className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-lg">{recipient.nickname || recipient.fullName}</p>
                        <p className="text-sm text-slate-500">{recipient.nickname ? recipient.fullName : (isServiceRecipient ? recipient.bankName : `${recipient.bankName} • ${recipient.accountNumber}`)}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600 hidden sm:block">{recipient.country.name}</span>
                    <button onClick={() => onEdit(recipient)} className="p-2 text-slate-500 hover:text-primary rounded-full shadow-digital active:shadow-digital-inset transition-all" aria-label={`Edit ${recipient.fullName}`}>
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-slate-500" aria-expanded={isExpanded} aria-label="Toggle details">
                      <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-slate-300 p-4 animate-fade-in-down">
                    {isServiceRecipient ? (
                         <div>
                            <h4 className="font-semibold text-slate-700 mb-3 text-sm">Service Details</h4>
                            <div className="space-y-4 p-4 rounded-lg shadow-digital-inset">
                                <AccountDetail label={`${serviceName} Identifier`} value={realDetails.accountNumber} />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Delivery Methods */}
                            <div className="md:col-span-1">
                                <h4 className="font-semibold text-slate-700 mb-3 text-sm">Enabled Features</h4>
                                <div className="space-y-3">
                                    <DeliveryMethod icon={<BankIcon className="w-5 h-5"/>} label="Bank Deposit" enabled={deliveryOptions.bankDeposit} />
                                    <DeliveryMethod icon={<CreditCardIcon className="w-5 h-5"/>} label="Card Deposit" enabled={deliveryOptions.cardDeposit} />
                                    <DeliveryMethod icon={<WithdrawIcon className="w-5 h-5"/>} label="Cash Pickup / Withdraw" enabled={deliveryOptions.cashPickup} />
                                </div>
                            </div>

                            {/* Real Account Details & Address */}
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <h4 className="font-semibold text-slate-700 mb-3 text-sm">Account Details</h4>
                                    <div className="space-y-4 p-4 rounded-lg shadow-digital-inset">
                                        <AccountDetail label="Account Number / IBAN" value={realDetails.accountNumber} />
                                        <AccountDetail label="SWIFT / BIC Code" value={realDetails.swiftBic} />
                                    </div>
                                </div>
                                {recipient.streetAddress && (
                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-3 text-sm">Address</h4>
                                        <div className="p-4 rounded-lg shadow-digital-inset text-slate-700 text-sm leading-relaxed">
                                            <p>{recipient.streetAddress}</p>
                                            <p>{recipient.city}, {recipient.stateProvince} {recipient.postalCode}</p>
                                            <p>{recipient.country.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <style>{`
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export const Recipients: React.FC<RecipientsProps> = ({ recipients, addRecipient, onUpdateRecipient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipientToEdit, setRecipientToEdit] = useState<Recipient | null>(null);
    
    const handleAddRecipient = (data: { 
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
    }) => {
        addRecipient(data);
        setIsModalOpen(false);
    }

    const handleOpenEditModal = (recipient: Recipient) => {
        setRecipientToEdit(recipient);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRecipientToEdit(null);
    };

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Recipients</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage your saved recipients and their details.</p>
                    </div>
                    <button onClick={() => { setRecipientToEdit(null); setIsModalOpen(true); }} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        Add New Recipient
                    </button>
                </div>

                <div className="space-y-4">
                    {recipients.map(r => (
                        <RecipientCard key={r.id} recipient={r} onEdit={handleOpenEditModal} />
                    ))}
                </div>
            </div>
            {isModalOpen && <AddRecipientModal onClose={handleCloseModal} onAddRecipient={handleAddRecipient} recipientToEdit={recipientToEdit} onUpdateRecipient={onUpdateRecipient} />}
        </>
    );
};