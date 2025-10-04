
import React, { useState } from 'react';
import { Recipient, Country } from '../types';
import { AddRecipientModal } from './AddRecipientModal';
import { ChevronDownIcon, ClipboardDocumentIcon, CheckCircleIcon, BankIcon, CreditCardIcon, WithdrawIcon } from './Icons';

interface RecipientsProps {
    recipients: Recipient[];
    addRecipient: (data: {
        fullName: string;
        bankName: string;
        accountNumber: string;
        swiftBic: string;
        country: Country;
        cashPickupEnabled: boolean;
    }) => void;
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

const RecipientCard: React.FC<{ recipient: Recipient }> = ({ recipient }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { deliveryOptions, realDetails } = recipient;

    return (
        <div className="bg-slate-200 rounded-2xl shadow-digital transition-shadow duration-300">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left p-4 flex items-center justify-between"
                aria-expanded={isExpanded}
            >
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-600 text-xl shadow-digital-inset">
                        {recipient.fullName.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-lg">{recipient.fullName}</p>
                        <p className="text-sm text-slate-500">{recipient.bankName} &bull; {recipient.accountNumber}</p>
                        <div className="flex items-center space-x-4 mt-2" aria-label="Available delivery methods">
                            <div title="Bank Deposit" className={`transition-colors flex items-center space-x-1.5 ${deliveryOptions.bankDeposit ? 'text-slate-600' : 'text-slate-400 opacity-40'}`}>
                                <BankIcon className="w-5 h-5" />
                                <span className="text-xs font-medium">Bank Deposit</span>
                            </div>
                            <div title="Card Deposit" className={`transition-colors flex items-center space-x-1.5 ${deliveryOptions.cardDeposit ? 'text-slate-600' : 'text-slate-400 opacity-40'}`}>
                                <CreditCardIcon className="w-5 h-5" />
                                <span className="text-xs font-medium">Card Deposit</span>
                            </div>
                            <div title="Cash Pickup / Withdraw" className={`transition-colors flex items-center space-x-1.5 ${deliveryOptions.cashPickup ? 'text-slate-600' : 'text-slate-400 opacity-40'}`}>
                                <WithdrawIcon className="w-5 h-5" />
                                <span className="text-xs font-medium">Cash Pickup / Withdraw</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600 hidden sm:block">{recipient.country.name}</span>
                    <ChevronDownIcon className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {isExpanded && (
                <div className="border-t border-slate-300 p-4 animate-fade-in-down">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Delivery Methods */}
                        <div>
                            <h4 className="font-semibold text-slate-700 mb-3 text-sm">Enabled Features</h4>
                            <div className="space-y-3">
                                <DeliveryMethod icon={<BankIcon className="w-5 h-5"/>} label="Bank Deposit" enabled={deliveryOptions.bankDeposit} />
                                <DeliveryMethod icon={<CreditCardIcon className="w-5 h-5"/>} label="Card Deposit" enabled={deliveryOptions.cardDeposit} />
                                <DeliveryMethod icon={<WithdrawIcon className="w-5 h-5"/>} label="Cash Pickup / Withdraw" enabled={deliveryOptions.cashPickup} />
                            </div>
                        </div>

                        {/* Real Account Details */}
                        <div>
                            <h4 className="font-semibold text-slate-700 mb-3 text-sm">Account Details</h4>
                            <div className="space-y-4 p-4 rounded-lg shadow-digital-inset">
                                <AccountDetail label="Account Number / IBAN" value={realDetails.accountNumber} />
                                <AccountDetail label="SWIFT / BIC Code" value={realDetails.swiftBic} />
                            </div>
                        </div>
                    </div>
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

export const Recipients: React.FC<RecipientsProps> = ({ recipients, addRecipient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleAddRecipient = (data: { fullName: string; bankName: string; accountNumber: string; swiftBic: string; country: Country; cashPickupEnabled: boolean; }) => {
        addRecipient(data);
        setIsModalOpen(false);
    }

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Recipients</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage your saved recipients and their details.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        Add New Recipient
                    </button>
                </div>

                <div className="space-y-4">
                    {recipients.map(r => (
                        <RecipientCard key={r.id} recipient={r} />
                    ))}
                </div>
            </div>
            {isModalOpen && <AddRecipientModal onClose={() => setIsModalOpen(false)} onAddRecipient={handleAddRecipient} />}
        </>
    );
};