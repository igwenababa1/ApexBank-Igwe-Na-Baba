import React from 'react';
import { Transaction, Account } from '../types';
import { USER_PROFILE } from '../constants';
import { LiveTransactionView } from './LiveTransactionView';
import { 
    CheckCircleIcon, 
    ArrowDownTrayIcon, 
    ArrowPathIcon,
    UserCircleIcon,
    ArrowRightIcon,
    BankIcon,
    ClipboardDocumentIcon
} from './Icons';

interface PaymentReceiptProps {
    transaction: Transaction;
    sourceAccount: Account;
    onStartOver: () => void;
    onViewActivity: () => void;
}

const DetailRow: React.FC<{ label: string; value: string | React.ReactNode; isMono?: boolean }> = ({ label, value, isMono = false }) => (
    <div className="flex justify-between items-start py-2">
        <p className="text-sm text-slate-400">{label}</p>
        <p className={`text-sm text-slate-200 text-right ${isMono ? 'font-mono' : 'font-semibold'}`}>{value}</p>
    </div>
);

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ transaction, sourceAccount, onStartOver, onViewActivity }) => {
    const totalDebited = transaction.sendAmount + transaction.fee;
    const isCredit = transaction.type === 'credit';
    
    const recipientAddress = [
        transaction.recipient.streetAddress,
        `${transaction.recipient.city}, ${transaction.recipient.stateProvince} ${transaction.recipient.postalCode}`,
        transaction.recipient.country.name
    ].filter(Boolean).join('\n');

    return (
        <div className="text-left p-2 space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4 shadow-inner">
                    <CheckCircleIcon className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">Transfer Sent Successfully!</h2>
                <p className="text-slate-400 mt-2">Total amount debited from your account:</p>
                <p className="text-4xl font-bold text-white mt-1 font-mono">
                    {totalDebited.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
            </div>

            {/* Transaction Details Card */}
            <div className="bg-black/20 rounded-xl shadow-inner p-6 space-y-4">
                {/* From/To Section */}
                <div className="flex items-center justify-between text-center">
                    <div className="w-2/5">
                        <UserCircleIcon className="w-10 h-10 mx-auto text-slate-400 mb-1" />
                        <p className="text-xs text-slate-400 uppercase">From</p>
                        <p className="font-semibold text-slate-200 truncate">{USER_PROFILE.name}</p>
                        <p className="text-xs text-slate-400 truncate">{sourceAccount.nickname} ({sourceAccount.accountNumber})</p>
                    </div>
                    <div className="w-1/5">
                        <ArrowRightIcon className="w-6 h-6 text-slate-500" />
                    </div>
                    <div className="w-2/5">
                        <BankIcon className="w-10 h-10 mx-auto text-slate-400 mb-1 p-1.5 border-2 border-slate-500 rounded-full" />
                        <p className="text-xs text-slate-400 uppercase">To</p>
                        <p className="font-semibold text-slate-200 truncate">{transaction.recipient.fullName}</p>
                        <p className="text-xs text-slate-400 truncate">{transaction.recipient.bankName}</p>
                    </div>
                </div>

                <div className="border-t border-slate-700 my-4"></div>

                {/* Financial Breakdown */}
                <div className="divide-y divide-slate-700">
                    <DetailRow label="Amount Sent" value={transaction.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} isMono />
                    {!isCredit && <DetailRow label="Fee" value={transaction.fee.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} isMono />}
                    {!isCredit && transaction.exchangeRate !== 1 && (
                        <>
                            <DetailRow label="Exchange Rate" value={`1 USD = ${transaction.exchangeRate.toFixed(4)} ${transaction.recipient.country.currency}`} isMono />
                            <DetailRow label="Recipient Gets" value={transaction.receiveAmount.toLocaleString('en-US', { style: 'currency', currency: transaction.recipient.country.currency })} isMono />
                        </>
                    )}
                </div>

                <div className="border-t border-slate-700 my-4"></div>
                
                {/* More Details */}
                 <div className="divide-y divide-slate-700">
                    <DetailRow label="Reference Number" value={transaction.id} isMono />
                    <DetailRow label="Purpose of Transfer" value={transaction.purpose} />
                    <DetailRow label="Initiated Date" value={transaction.statusTimestamps.Submitted.toLocaleString()} />
                    {recipientAddress && <DetailRow label="Recipient Address" value={<pre className="text-sm text-slate-200 text-right font-semibold whitespace-pre-wrap text-wrap">{recipientAddress}</pre>} />}
                </div>
            </div>

            {/* Live Tracker */}
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <LiveTransactionView transaction={transaction} />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm font-semibold">
                <button className="flex items-center justify-center space-x-2 py-3 bg-white/10 text-slate-200 hover:bg-white/20 rounded-lg transition-colors">
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span>Download Receipt</span>
                </button>
                 <button onClick={onStartOver} className="flex items-center justify-center space-x-2 py-3 bg-white/10 text-slate-200 hover:bg-white/20 rounded-lg transition-colors">
                    <ArrowPathIcon className="w-5 h-5" />
                    <span>Send Another</span>
                </button>
                 <button onClick={onViewActivity} className="flex items-center justify-center space-x-2 py-3 bg-white/10 text-slate-200 hover:bg-white/20 rounded-lg transition-colors">
                    <ClipboardDocumentIcon className="w-5 h-5" />
                    <span>View All Activity</span>
                </button>
            </div>
            <style>{`
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};
