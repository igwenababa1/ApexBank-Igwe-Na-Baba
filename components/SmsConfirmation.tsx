import React, { useEffect, useState } from 'react';
import { Transaction } from '../types';
import { CheckCircleIcon } from './Icons';

interface SmsConfirmationProps {
    transaction: Transaction;
    phone: string;
}

export const SmsConfirmation: React.FC<SmsConfirmationProps> = ({ transaction, phone }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500); // Delay appearance for effect
        return () => clearTimeout(timer);
    }, []);

    const maskedPhone = phone.replace(/(\d{3})-(\d{3})/, '***-***');
    const message = `ApexBank: Your transfer of ${transaction.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} to ${transaction.recipient.fullName} has been submitted.`;

    return (
        <div className={`my-6 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="p-4 bg-slate-800/50 rounded-lg shadow-inner text-left flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1 p-2 bg-green-500/20 rounded-full">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-100">SMS Alert Sent</h4>
                    <p className="text-sm text-slate-300">A confirmation receipt has been sent to your registered phone number ({maskedPhone}).</p>
                    <div className="mt-3 p-3 bg-black/30 rounded-lg text-xs text-slate-200 font-mono shadow-inner whitespace-pre-wrap">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
};
