import React, { useState, useMemo } from 'react';
import { Recipient, Transaction, TransactionStatus } from '../types';
import { FIXED_FEE, EXCHANGE_RATES } from '../constants';
import { TransactionTracker } from './TransactionTracker';

interface SendMoneyFlowProps {
  recipients: Recipient[];
  accountBalance: number;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'status' | 'estimatedArrival' | 'statusTimestamps'>) => Transaction | null;
}

type FlowStep = 'form' | 'review' | 'success';

export const SendMoneyFlow: React.FC<SendMoneyFlowProps> = ({ recipients, accountBalance, createTransaction }) => {
  const [step, setStep] = useState<FlowStep>('form');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(recipients[0]?.id || '');
  const [sendAmount, setSendAmount] = useState('');
  const [description, setDescription] = useState('');
  const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);

  const selectedRecipient = useMemo(
    () => recipients.find(r => r.id === selectedRecipientId),
    [recipients, selectedRecipientId]
  );
  
  const exchangeRate = selectedRecipient ? EXCHANGE_RATES[selectedRecipient.country.currency] : 1;
  const receiveAmount = (parseFloat(sendAmount) || 0) * exchangeRate;
  const totalCost = (parseFloat(sendAmount) || 0) + FIXED_FEE;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient || !sendAmount || parseFloat(sendAmount) <= 0) {
      alert('Please select a recipient and enter a valid amount.');
      return;
    }
    if(totalCost > accountBalance) {
      alert('Insufficient funds.');
      return;
    }
    setStep('review');
  };

  const handleConfirm = () => {
    if (!selectedRecipient || !sendAmount) return;
    const newTx = createTransaction({
      recipient: selectedRecipient,
      sendAmount: parseFloat(sendAmount),
      receiveAmount,
      fee: FIXED_FEE,
      exchangeRate,
      description: description || `Transfer to ${selectedRecipient.fullName}`,
      type: 'debit',
    });
    
    // Only proceed if transaction was created (i.e., not blocked by limits)
    if (newTx) {
      setLatestTransaction(newTx);
      setStep('success');
    }
  };
  
  const handleStartNew = () => {
    setSendAmount('');
    setDescription('');
    setSelectedRecipientId(recipients[0]?.id || '');
    setLatestTransaction(null);
    setStep('form');
  }

  return (
    <div className="bg-white shadow-md rounded-lg max-w-2xl mx-auto">
      <div className="p-8">
        {step === 'form' && (
          <>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Send Money</h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-slate-700 mb-1">Recipient</label>
                <select id="recipient" value={selectedRecipientId} onChange={e => setSelectedRecipientId(e.target.value)} className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary">
                  {recipients.map(r => <option key={r.id} value={r.id}>{r.fullName} - {r.country.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">You send</label>
                <div className="relative">
                  <input type="number" id="amount" value={sendAmount} onChange={e => setSendAmount(e.target.value)} placeholder="0.00" className="block w-full rounded-md border-slate-300 shadow-sm pl-4 pr-16 focus:border-primary focus:ring-primary" />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 font-semibold">USD</span>
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <input 
                  type="text" 
                  id="description" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="e.g., Payment for services" 
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary"
                  maxLength={100}
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Exchange rate</span>
                  <span className="font-semibold text-slate-800">
                    {(1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} = {selectedRecipient ? exchangeRate.toLocaleString('en-US', { style: 'currency', currency: selectedRecipient.country.currency, minimumFractionDigits: 4 }) : '...'}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Fee</span>
                  <span className="font-semibold text-slate-800">{FIXED_FEE.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <hr className="my-2"/>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Recipient gets</span>
                  <span className="font-semibold text-slate-800">
                    {selectedRecipient ? receiveAmount.toLocaleString('en-US', { style: 'currency', currency: selectedRecipient.country.currency }) : '...'}
                  </span>
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors">
                Continue
              </button>
            </form>
          </>
        )}
        {step === 'review' && selectedRecipient && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Review Transfer</h2>
            <div className="space-y-4 text-slate-700">
              <div className="flex justify-between"><span>Sending to:</span><span className="font-semibold">{selectedRecipient.fullName}</span></div>
              <div className="flex justify-between"><span>Bank:</span><span className="font-semibold">{selectedRecipient.bankName}, {selectedRecipient.country.name}</span></div>
              <div className="flex justify-between"><span>Description:</span><span className="font-semibold truncate" title={description}>{description || 'N/A'}</span></div>
               <hr/>
              <div className="flex justify-between"><span>You send:</span><span className="font-semibold">{parseFloat(sendAmount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></div>
              <div className="flex justify-between"><span>Fee:</span><span className="font-semibold">{FIXED_FEE.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></div>
              <div className="flex justify-between text-lg font-bold"><span>Total to pay:</span><span>{totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></div>
              <hr/>
               <div className="flex justify-between text-lg font-bold text-primary">
                <span>Recipient gets:</span>
                <span>
                  {receiveAmount.toLocaleString('en-US', { style: 'currency', currency: selectedRecipient.country.currency })}
                </span>
               </div>
            </div>
            <div className="mt-8 flex space-x-4">
              <button onClick={() => setStep('form')} className="w-full bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors">Back</button>
              <button onClick={handleConfirm} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors">Confirm & Send</button>
            </div>
          </div>
        )}
        {step === 'success' && latestTransaction && (
           <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Transfer Submitted!</h2>
            <p className="text-slate-600 mb-8">Your transfer to {latestTransaction.recipient.fullName} is on its way.</p>
            <div className="bg-slate-50 p-6 rounded-lg mb-8">
                 <TransactionTracker transaction={latestTransaction} />
            </div>
            <div className="text-left space-y-3 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Transaction ID</span>
                    <span className="font-mono text-sm text-slate-800 bg-slate-100 px-2 py-1 rounded">{latestTransaction.id}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Description</span>
                    <span className="font-semibold text-slate-800">{latestTransaction.description}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Estimated Arrival</span>
                    <span className="font-semibold text-slate-800">{latestTransaction.estimatedArrival.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</span>
                </div>
            </div>
            <button onClick={handleStartNew} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors mt-8">
              Start a New Transfer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
