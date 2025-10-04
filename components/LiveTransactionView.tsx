import React from 'react';
import { Transaction, TransactionStatus } from '../types';
import { CheckCircleIcon, UserGroupIcon, NetworkIcon, GlobeAltIcon, BankIcon, SendIcon } from './Icons';

interface LiveTransactionViewProps {
  transaction: Transaction;
}

const steps = [
  { status: TransactionStatus.SUBMITTED, label: 'Payment Initiated', icon: <UserGroupIcon className="w-6 h-6" /> },
  { status: TransactionStatus.CONVERTING, label: 'Processing & FX', icon: <NetworkIcon className="w-6 h-6" /> },
  { status: TransactionStatus.IN_TRANSIT, label: 'Sent via Network', icon: <GlobeAltIcon className="w-6 h-6" /> },
  { status: TransactionStatus.FUNDS_ARRIVED, label: 'Delivered to Bank', icon: <BankIcon className="w-6 h-6" /> },
];

export const LiveTransactionView: React.FC<LiveTransactionViewProps> = ({ transaction }) => {
  const { status, statusTimestamps } = transaction;
  const currentStepIndex = steps.findIndex(s => s.status === status);

  // Calculate progress percentage. Each step is a segment.
  // currentStepIndex 0 -> 0%, 1 -> 33%, 2 -> 67%, 3 -> 100%
  const progressPercentage = currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;
  const isComplete = status === TransactionStatus.FUNDS_ARRIVED;

  return (
    <div className="w-full font-sans">
        <div className="relative h-2 w-full bg-slate-300 rounded-full my-10">
            <div 
                className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-1000 ease-out ${isComplete ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${progressPercentage}%` }}
            ></div>
            <div 
                className={`absolute -top-3.5 transform -translate-x-1/2 transition-all duration-1000 ease-out`}
                style={{ left: `${progressPercentage}%` }}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg ${isComplete ? 'bg-green-500' : 'bg-primary'}`}>
                    <SendIcon className="w-5 h-5 transform rotate-45" />
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
                        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 mb-2 ${isStepCompleted ? 'bg-green-500 text-white shadow-digital' : isStepCurrent ? 'bg-primary text-white shadow-digital' : 'bg-slate-200 text-slate-400 shadow-digital-inset'}`}>
                            {isStepCompleted ? <CheckCircleIcon className="w-7 h-7" /> : step.icon}
                        </div>
                        <p className={`text-xs font-bold transition-colors duration-500 ${isStepCompleted || isStepCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.label}
                        </p>
                        {timestamp && (
                           <p className="text-xs text-slate-500 mt-1 transition-opacity duration-500 opacity-100">
                             {timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                           </p>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );
};
