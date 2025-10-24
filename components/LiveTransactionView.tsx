import React, { useState, useEffect, useRef } from 'react';
import { Transaction, TransactionStatus } from '../types';
import { CheckCircleIcon, UserGroupIcon, NetworkIcon, GlobeAltIcon, BankIcon, CurrencyDollarIcon, ExclamationTriangleIcon, XIcon, DocumentCheckIcon, BanknotesIcon } from './Icons';
import { SmsConfirmation } from './SmsConfirmation';

interface LiveTransactionViewProps {
  transaction: Transaction;
  phone?: string;
}

const steps = [
  { status: TransactionStatus.SUBMITTED, label: 'Payment Initiated', icon: <UserGroupIcon className="w-6 h-6" /> },
  { status: TransactionStatus.CONVERTING, label: 'Processing & FX', icon: <NetworkIcon className="w-6 h-6" /> },
  { status: TransactionStatus.IN_TRANSIT, label: 'Sent via Network', icon: <GlobeAltIcon className="w-6 h-6" /> },
  { status: TransactionStatus.FUNDS_ARRIVED, label: 'Delivered to Bank', icon: <BankIcon className="w-6 h-6" /> },
];

interface NotificationModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ transaction, onClose }) => {
    const isHighValue = transaction.sendAmount >= 1000;

    if (isHighValue) {
        const taxAmount = transaction.sendAmount * 0.15;
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg m-4 border border-yellow-500/50 animate-fade-in-up">
                    <div className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4 ring-8 ring-yellow-500/10">
                            <DocumentCheckIcon className="w-8 h-8 text-yellow-400"/>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-100">Action Required: Authorization Paperwork</h3>
                        <p className="text-slate-400 mt-2">To comply with international financial regulations for transfers of $1,000.00 or more, additional documentation is required for clearance.</p>
                    </div>

                    <div className="px-6 text-left">
                        <h4 className="font-bold text-slate-200 mb-2">Steps to Release Your Funds:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300 bg-black/20 p-4 rounded-lg shadow-inner">
                            <li>You must obtain the required **IMF Authorization paperwork**. This involves processing fees and requires an **Approved Inter-Transaction ID**.</li>
                            <li>A mandatory **15% tax** ({taxAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}) must be paid to clear the funds.</li>
                            <li>To begin, kindly send us a positive confirmation email, and we will direct you step-by-step. You may also contact our customer service for clarification.</li>
                        </ol>
                    </div>

                    <div className="m-6 mt-4 p-4 bg-red-900/50 border-l-4 border-red-500 text-red-200 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-bold text-red-300">⚠️ Powerful Advanced Security Warning</h3>
                                <div className="mt-2 text-sm text-red-200">
                                    <p>Official banks **NEVER** ask for taxes or fees to be paid separately after a transfer has been sent. All fees are declared upfront. Be extremely cautious of requests to send more money to 'release' funds, as this is a common scam tactic. Contact us through official channels only.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-0">
                        <button onClick={onClose} className="w-full py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                            I Understand
                        </button>
                    </div>
                </div>
                 <style>{`
                    @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                    .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                    @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
                `}</style>
            </div>
        );
    }
    
    // Original modal for lower value transfers
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg m-4 border border-primary/50 animate-fade-in-up">
                <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4 ring-8 ring-primary/10">
                        <GlobeAltIcon className="w-8 h-8 text-primary"/>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100">Funds in Transit</h3>
                    <p className="text-slate-400 mt-2">Your funds have been successfully converted and sent to the international banking network. The recipient's bank will now process the incoming payment.</p>
                </div>
                
                <div className="m-6 mt-0 p-4 bg-yellow-500/10 border-l-4 border-yellow-400 text-yellow-200 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-bold text-yellow-300">Advanced Security Warning</h3>
                            <div className="mt-2 text-sm text-yellow-200">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Your transfer is now **irrevocable** and cannot be canceled.</li>
                                    <li>**NEVER** share your transaction ID with anyone claiming to be from support.</li>
                                    <li>We will **NEVER** ask you to cancel, reverse, or send more money to 'release' funds.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div className="p-6 pt-0">
                    <button onClick={onClose} className="w-full py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                        Understood
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes fade-in-up {
                  0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                  100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};


export const LiveTransactionView: React.FC<LiveTransactionViewProps> = ({ transaction, phone }) => {
  const { status, statusTimestamps } = transaction;
  const currentStepIndex = steps.findIndex(s => s.status === status);
  const [showNotification, setShowNotification] = useState(false);
  const notificationShown = useRef(false);

  useEffect(() => {
    // Trigger notification only once when transaction enters 'In Transit' state
    if (transaction.status === TransactionStatus.IN_TRANSIT && !notificationShown.current) {
      setShowNotification(true);
      notificationShown.current = true;
    }
    // Reset for subsequent different transactions
    if (transaction.status !== TransactionStatus.IN_TRANSIT && transaction.status !== TransactionStatus.FUNDS_ARRIVED) {
        notificationShown.current = false;
    }
  }, [transaction.status]);

  const progressPercentage = currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;
  const isComplete = status === TransactionStatus.FUNDS_ARRIVED;

  return (
    <div className="w-full font-sans">
      {showNotification && <NotificationModal transaction={transaction} onClose={() => setShowNotification(false)} />}
      <div className="relative h-2.5 w-full bg-slate-700/50 rounded-full my-10 shadow-inner">
        <div 
          className="absolute top-0 left-0 h-2.5 rounded-full transition-all duration-[5000ms] ease-in-out"
          style={{ width: `${progressPercentage}%`, background: isComplete ? '#22c55e' : 'linear-gradient(to right, #2dd4bf, #0052FF)' }}
        ></div>
        {/* Animated Money Icon */}
        <div 
          className="absolute -top-4 transform -translate-x-1/2 transition-all duration-[5000ms] ease-in-out"
          style={{ left: `${progressPercentage}%` }}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-slate-800/50 transition-colors duration-500 ${isComplete ? 'bg-green-500' : 'bg-gradient-to-br from-green-400 to-emerald-600'}`}>
            <CurrencyDollarIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-start text-center">
        {steps.map((step, index) => {
          const isStepCompleted = index < currentStepIndex || isComplete;
          const isStepCurrent = index === currentStepIndex && !isComplete;
          const timestamp = statusTimestamps[step.status as keyof typeof statusTimestamps];

          return (
            <div key={step.status} className="w-1/4 px-1">
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 mb-2 ${isStepCompleted ? 'bg-green-500/20 text-green-300' : isStepCurrent ? 'bg-primary/20 text-primary-300 ring-2 ring-primary' : 'bg-slate-800 text-slate-500 shadow-inner'}`}>
                {isStepCompleted ? <CheckCircleIcon className="w-7 h-7" /> : step.icon}
              </div>
              <p className={`text-xs font-bold transition-colors duration-500 ${isStepCompleted || isStepCurrent ? 'text-slate-200' : 'text-slate-500'}`}>
                {step.label}
              </p>
              {timestamp && (
                 <p className="text-xs text-slate-400 mt-1 transition-opacity duration-500 opacity-100">
                   {timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                 </p>
              )}
            </div>
          );
        })}
      </div>

      {isComplete && phone && (
        <div className="mt-6 text-left">
            <SmsConfirmation transaction={transaction} phone={phone} />
        </div>
      )}
    </div>
  );
};