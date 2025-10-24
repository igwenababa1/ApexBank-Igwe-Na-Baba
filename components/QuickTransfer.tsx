import React, { useState, useMemo, useRef } from 'react';
import { Account, Recipient, Transaction } from '../types';
import { SELF_RECIPIENT, FIXED_FEE, EXCHANGE_RATES } from '../constants';
import { SpinnerIcon, CheckCircleIcon, getBankIcon, UserCircleIcon, SendIcon } from './Icons';

interface QuickTransferProps {
    accounts: Account[];
    recipients: Recipient[];
    createTransaction: (transaction: Omit<Transaction, 'id' | 'status' | 'estimatedArrival' | 'statusTimestamps' | 'type'>) => Transaction | null;
}

export const QuickTransfer: React.FC<QuickTransferProps> = ({ accounts, recipients, createTransaction }) => {
    const availableAccounts = accounts.filter(acc => acc.balance > 0);
    const quickRecipients = [SELF_RECIPIENT, ...recipients.slice(0, 3)];

    const [sourceAccountId, setSourceAccountId] = useState(availableAccounts[0]?.id || '');
    const [selectedRecipientId, setSelectedRecipientId] = useState(quickRecipients[0]?.id || '');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
    const [error, setError] = useState('');
    const [tooltip, setTooltip] = useState({ show: false, message: '' });
    const tooltipTimeout = useRef<number | null>(null);

    const sourceAccount = accounts.find(acc => acc.id === sourceAccountId);
    const selectedRecipient = quickRecipients.find(rec => rec.id === selectedRecipientId);

    const numericAmount = parseFloat(amount) || 0;
    const exchangeRate = selectedRecipient ? EXCHANGE_RATES[selectedRecipient.country.currency] : 1;
    const receiveAmount = numericAmount * exchangeRate;
    const totalCost = numericAmount > 0 ? numericAmount + FIXED_FEE : 0;
    const isAmountInvalid = !sourceAccount || totalCost > sourceAccount.balance || numericAmount <= 0;

    const showTooltip = (message: string, autoHide: boolean = false) => {
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        setTooltip({ show: true, message });
        if (autoHide) {
            tooltipTimeout.current = window.setTimeout(() => {
                setTooltip({ show: false, message: '' });
            }, 2500);
        }
    };

    const hideTooltip = () => {
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        setTooltip({ show: false, message: '' });
    };

    const handleDisabledInteraction = (isClick: boolean) => {
        let message = '';
        if (numericAmount <= 0) {
            message = 'Please enter an amount to send.';
        } else if (isAmountInvalid) {
            message = 'Insufficient balance for this transaction.';
        }

        if (message) {
            showTooltip(message, isClick);
        }
    };

    const handleSend = () => {
        if (isAmountInvalid || !selectedRecipient || !sourceAccount) return;

        setStatus('sending');
        setError('');

        // Simulate network delay
        setTimeout(() => {
            const newTransaction = createTransaction({
                accountId: sourceAccount.id,
                recipient: selectedRecipient,
                sendAmount: numericAmount,
                receiveAmount: receiveAmount,
                fee: FIXED_FEE,
                exchangeRate: exchangeRate,
                description: `Quick transfer to ${selectedRecipient.fullName}`,
                purpose: 'Personal Transfer',
            });

            if (newTransaction) {
                setStatus('success');
                setTimeout(() => {
                    setStatus('idle');
                    setAmount('');
                }, 3000); // Reset after 3 seconds
            } else {
                setError('Transaction failed. Check your balance and try again.');
                setStatus('idle');
            }
        }, 1500);
    };

    const RecipientAvatar: React.FC<{ recipient: Recipient }> = ({ recipient }) => {
        const isSelected = recipient.id === selectedRecipientId;
        const BankIconComponent = getBankIcon(recipient.bankName);

        return (
            <button
                onClick={() => setSelectedRecipientId(recipient.id)}
                className={`flex flex-col items-center space-y-2 p-2 rounded-lg transition-all duration-200 w-24 ${isSelected ? 'shadow-digital-inset' : 'shadow-digital active:shadow-digital-inset'}`}
                aria-label={`Select ${recipient.fullName}`}
                aria-pressed={isSelected}
            >
                <div className={`w-12 h-12 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 shadow-digital-inset relative ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-slate-200' : ''}`}>
                    {recipient.id === SELF_RECIPIENT.id ? <UserCircleIcon className="w-8 h-8" /> : <BankIconComponent className="w-8 h-8" />}
                </div>
                <p className="text-xs font-semibold text-slate-700 truncate">{recipient.nickname || recipient.fullName}</p>
            </button>
        );
    };

    return (
        <div className="bg-slate-200 rounded-2xl shadow-digital">
            <div className="p-6 border-b border-slate-300">
                <h2 className="text-xl font-bold text-slate-800">Quick Transfer</h2>
            </div>
            <div className="p-6 space-y-4">
                {status === 'success' ? (
                     <div className="text-center p-8 flex flex-col items-center justify-center">
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
                        <h3 className="text-lg font-bold text-slate-800">Transfer Submitted!</h3>
                        <p className="text-sm text-slate-600">Your funds are on their way.</p>
                    </div>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
                             <select
                                id="sourceAccount"
                                value={sourceAccountId}
                                onChange={e => setSourceAccountId(e.target.value)}
                                className="w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400"
                                disabled={status === 'sending'}
                            >
                                {availableAccounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.nickname || acc.type} - {acc.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
                            <div className="flex space-x-3 overflow-x-auto pb-2">
                                {quickRecipients.map(rec => <RecipientAvatar key={rec.id} recipient={rec} />)}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="quick-amount" className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                            <div className="mt-1 relative rounded-md shadow-digital-inset">
                                <input
                                    type="number"
                                    id="quick-amount"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="w-full bg-transparent border-0 p-3 pr-16"
                                    placeholder="0.00"
                                    disabled={status === 'sending'}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-slate-500 font-semibold">USD</span>
                                </div>
                            </div>
                            {isAmountInvalid && numericAmount > 0 && <p className="mt-1 text-xs text-red-600">Insufficient funds for this amount.</p>}
                            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                        </div>
                         <div className="p-3 bg-slate-200 rounded-lg shadow-digital-inset text-sm space-y-1">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Fee</span>
                                <span className="font-mono text-slate-800">{FIXED_FEE.toFixed(2)} USD</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span className="text-slate-600">Total</span>
                                <span className="font-mono text-slate-800">{totalCost.toFixed(2)} USD</span>
                            </div>
                         </div>
                        <div className="relative">
                            <button
                                onClick={handleSend}
                                disabled={isAmountInvalid || status === 'sending'}
                                className="w-full flex items-center justify-center space-x-2 py-3 bg-primary text-white rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:bg-primary-300 disabled:cursor-not-allowed"
                            >
                                {status === 'sending' ? (
                                    <>
                                        <SpinnerIcon className="w-5 h-5"/>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <SendIcon className="w-5 h-5"/>
                                        <span>Send Now</span>
                                    </>
                                )}
                            </button>
                            {isAmountInvalid && status !== 'sending' && (
                                <div
                                    className="absolute inset-0 cursor-not-allowed"
                                    onClick={() => handleDisabledInteraction(true)}
                                    onMouseEnter={() => handleDisabledInteraction(false)}
                                    onMouseLeave={hideTooltip}
                                />
                            )}
                            {tooltip.show && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-sm font-medium text-white bg-slate-800 rounded-md shadow-lg whitespace-nowrap z-10 animate-fade-in-up">
                                    {tooltip.message}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};