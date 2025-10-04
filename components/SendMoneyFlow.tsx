import React, { useState, useMemo } from 'react';
import { Recipient, Transaction } from '../types';
import { FIXED_FEE, EXCHANGE_RATES, TRANSFER_PURPOSES, USER_PIN } from '../constants';
import { LiveTransactionView } from './LiveTransactionView';
import { SpinnerIcon, CheckCircleIcon, ExclamationTriangleIcon, KeypadIcon, BankIcon, CreditCardIcon, WithdrawIcon } from './Icons';

interface SendMoneyFlowProps {
  recipients: Recipient[];
  accountBalance: number;
  transactions: Transaction[]; // For live tracking on success
  createTransaction: (transaction: Omit<Transaction, 'id' | 'status' | 'estimatedArrival' | 'statusTimestamps' | 'type'>) => Transaction | null;
}

// Stepper component
const Stepper: React.FC<{ steps: string[], currentStep: number }> = ({ steps, currentStep }) => (
    <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => (
                <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                    {stepIdx < currentStep ? (
                        <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-primary" />
                            </div>
                            <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                                <CheckCircleIcon className="w-5 h-5 text-white" />
                            </div>
                        </>
                    ) : stepIdx === currentStep ? (
                        <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-slate-300" />
                            </div>
                            <div className="relative w-8 h-8 flex items-center justify-center bg-slate-200 border-2 border-primary rounded-full">
                                <span className="h-2.5 w-2.5 bg-primary rounded-full" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-slate-300" />
                            </div>
                            <div className="relative w-8 h-8 flex items-center justify-center bg-slate-200 border-2 border-slate-300 rounded-full" />
                        </>
                    )}
                    <p className="absolute -bottom-6 text-xs text-center w-28 -left-10 font-medium text-slate-500">{step}</p>
                </li>
            ))}
        </ol>
    </nav>
);


// Main Component
export const SendMoneyFlow: React.FC<SendMoneyFlowProps> = ({ recipients, accountBalance, createTransaction, transactions }) => {
  const [step, setStep] = useState(0); // 0: Amount, 1: Security, 2: PIN, 3: Review, 4: Success
  
  // Form State
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(recipients.length > 0 ? recipients[0] : null);
  const [sendAmount, setSendAmount] = useState('');
  const [purpose, setPurpose] = useState(TRANSFER_PURPOSES[0]);

  // Security State
  const [securityAcknowledged, setSecurityAcknowledged] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Transaction State
  const [createdTransaction, setCreatedTransaction] = useState<Transaction | null>(null);

  const numericSendAmount = parseFloat(sendAmount) || 0;
  const exchangeRate = selectedRecipient ? EXCHANGE_RATES[selectedRecipient.country.currency] : 0;
  const receiveAmount = numericSendAmount * exchangeRate;
  const totalCost = numericSendAmount + FIXED_FEE;
  const isAmountInvalid = totalCost > accountBalance || numericSendAmount <= 0;

  const liveTransaction = useMemo(() => {
    if (!createdTransaction) return null;
    return transactions.find(t => t.id === createdTransaction.id) || createdTransaction;
  }, [transactions, createdTransaction]);

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    if (pin === USER_PIN) {
      handleNextStep();
    } else {
      setPinError('Incorrect PIN. Please try again.');
    }
  };

  const handleConfirmAndSend = () => {
    if (!selectedRecipient) return;

    const newTransaction = createTransaction({
      recipient: selectedRecipient,
      sendAmount: numericSendAmount,
      receiveAmount: receiveAmount,
      fee: FIXED_FEE,
      exchangeRate: exchangeRate,
      description: `Transfer to ${selectedRecipient.fullName}`,
      purpose,
    });
    
    if(newTransaction) {
        setCreatedTransaction(newTransaction);
        handleNextStep();
    }
  };

  const handleStartOver = () => {
    setStep(0);
    setSelectedRecipient(recipients.length > 0 ? recipients[0] : null);
    setSendAmount('');
    setPurpose(TRANSFER_PURPOSES[0]);
    setSecurityAcknowledged(false);
    setPin('');
    setPinError('');
    setCreatedTransaction(null);
  };

  const steps = ['Amount', 'Security', 'Authorize', 'Review', 'Complete'];

  const renderStepContent = () => {
    switch(step) {
      // Amount & Recipient
      case 0:
        return (
          <>
            <div className="space-y-6">
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-slate-700">Recipient</label>
                <select
                  id="recipient"
                  value={selectedRecipient?.id || ''}
                  onChange={e => setSelectedRecipient(recipients.find(r => r.id === e.target.value) || null)}
                  className="mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400"
                >
                  {recipients.map(r => <option key={r.id} value={r.id}>{r.fullName} - {r.bankName}</option>)}
                </select>
              </div>

              {selectedRecipient && (
                  <div className="p-4 rounded-lg shadow-digital-inset bg-slate-100/50 space-y-3 transition-all duration-300 animate-fade-in">
                      <h4 className="text-sm font-bold text-slate-700">Recipient Details</h4>
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Full Name</span>
                          <span className="font-semibold text-slate-800">{selectedRecipient.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Bank</span>
                          <span className="font-semibold text-slate-800">{selectedRecipient.bankName}, {selectedRecipient.country.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Account Number</span>
                          <span className="font-mono text-sm text-slate-800">{selectedRecipient.accountNumber}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-300">
                          <span className="text-sm text-slate-500">Available Methods</span>
                          <div className="flex items-center space-x-4 mt-1">
                              <div title="Bank Deposit" className={`transition-colors flex items-center space-x-1 ${selectedRecipient.deliveryOptions.bankDeposit ? 'text-slate-600' : 'text-slate-400 opacity-40'}`}>
                                  <BankIcon className="w-4 h-4" />
                                  <span className="text-xs font-medium">Bank</span>
                              </div>
                              <div title="Card Deposit" className={`transition-colors flex items-center space-x-1 ${selectedRecipient.deliveryOptions.cardDeposit ? 'text-slate-600' : 'text-slate-400 opacity-40'}`}>
                                  <CreditCardIcon className="w-4 h-4" />
                                  <span className="text-xs font-medium">Card</span>
                              </div>
                              <div title="Cash Pickup / Withdraw" className={`transition-colors flex items-center space-x-1 ${selectedRecipient.deliveryOptions.cashPickup ? 'text-slate-600' : 'text-slate-400 opacity-40'}`}>
                                  <WithdrawIcon className="w-4 h-4" />
                                  <span className="text-xs font-medium">Cash</span>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              <div>
                <label htmlFor="sendAmount" className="block text-sm font-medium text-slate-700">You Send</label>
                <div className="mt-1 relative rounded-md shadow-digital-inset">
                  <input
                    type="number"
                    id="sendAmount"
                    value={sendAmount}
                    onChange={e => setSendAmount(e.target.value)}
                    className="w-full bg-transparent border-0 p-3 pr-16"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-semibold">USD</span>
                  </div>
                </div>
                {isAmountInvalid && numericSendAmount > 0 && <p className="mt-2 text-sm text-red-600">Insufficient balance.</p>}
              </div>
              <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-slate-700">Purpose of Transfer</label>
                  <select
                      id="purpose"
                      value={purpose}
                      onChange={e => setPurpose(e.target.value)}
                      className="mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400"
                  >
                      {TRANSFER_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
              </div>
              <div className="p-4 bg-slate-200 rounded-lg shadow-digital-inset space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Exchange Rate</span>
                  <span className="font-mono text-slate-800">1 USD = {exchangeRate.toFixed(4)} {selectedRecipient?.country.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Fee</span>
                  <span className="font-mono text-slate-800">{FIXED_FEE.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-600">Total to Pay</span>
                  <span className="font-mono text-slate-800">{totalCost.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-300">
                  <span className="text-slate-700">Recipient Gets</span>
                  <span className="text-primary">{receiveAmount.toFixed(2)} {selectedRecipient?.country.currency}</span>
                </div>
              </div>
              <button onClick={handleNextStep} disabled={isAmountInvalid || !selectedRecipient} className="w-full py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg disabled:bg-primary-300 transition-all">
                Continue
              </button>
            </div>
             <style>{`
              @keyframes fade-in {
                0% { opacity: 0; transform: translateY(-5px); }
                100% { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
          </>
        );

      // Security Warning
      case 1:
          return (
              <div className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 shadow-digital-inset">
                      <ExclamationTriangleIcon className="w-8 h-8 text-red-600"/>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Stop. Think. Is this transfer safe?</h2>
                  <p className="text-slate-600 my-4">
                      Scammers and fraudsters are clever. Only send money to people you personally know and trust. We cannot recover funds once they are sent.
                  </p>
                  <div className="p-4 rounded-lg shadow-digital-inset text-left">
                      <label htmlFor="security-check" className="flex items-start space-x-3 cursor-pointer">
                          <input 
                              type="checkbox"
                              id="security-check"
                              checked={securityAcknowledged}
                              onChange={() => setSecurityAcknowledged(!securityAcknowledged)}
                              className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                          />
                          <p className="text-sm font-medium text-slate-700">I confirm that I know and trust the recipient, and I understand that this transaction is final.</p>
                      </label>
                  </div>
                   <div className="mt-6 flex space-x-3">
                      <button onClick={handlePrevStep} className="w-full py-3 text-slate-700 bg-slate-200 rounded-lg font-semibold shadow-digital active:shadow-digital-inset transition-all">Back</button>
                      <button onClick={handleNextStep} disabled={!securityAcknowledged} className="w-full py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg disabled:bg-primary-300 transition-all">
                        Continue
                      </button>
                  </div>
              </div>
          );

      // PIN Authorization
      case 2:
          return (
              <div className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4 shadow-digital">
                      <KeypadIcon className="w-8 h-8 text-primary"/>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Authorize Payment</h2>
                  <p className="text-slate-600 my-4">Please enter your 4-digit security PIN to authorize this transfer.</p>
                  <form onSubmit={handlePinSubmit}>
                      <input 
                          type="password" 
                          value={pin}
                          onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-48 mx-auto bg-slate-200 border-0 p-3 text-center text-3xl tracking-[.75em] rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400"
                          maxLength={4}
                          placeholder="----"
                      />
                      {pinError && <p className="mt-2 text-sm text-red-600">{pinError}</p>}
                       <div className="mt-6 flex space-x-3">
                          <button type="button" onClick={handlePrevStep} className="w-full py-3 text-slate-700 bg-slate-200 rounded-lg font-semibold shadow-digital active:shadow-digital-inset transition-all">Back</button>
                          <button type="submit" disabled={pin.length !== 4} className="w-full py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg disabled:bg-primary-300 transition-all">
                            Authorize
                          </button>
                      </div>
                  </form>
              </div>
          );

      // Review
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 text-center">Review Your Transfer</h3>
            <div className="p-4 bg-slate-200 rounded-lg shadow-digital-inset space-y-3 divide-y divide-slate-300">
                <div className="pt-2">
                    <span className="text-sm text-slate-500">To</span>
                    <p className="font-semibold text-slate-800">{selectedRecipient?.fullName}</p>
                    <p className="text-sm text-slate-600">{selectedRecipient?.bankName} ({selectedRecipient?.country.name})</p>
                </div>
                 <div className="pt-3">
                    <span className="text-sm text-slate-500">You Send</span>
                    <p className="font-semibold text-slate-800">{numericSendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
                 <div className="pt-3">
                    <span className="text-sm text-slate-500">Recipient Gets</span>
                    <p className="font-semibold text-primary">{receiveAmount.toLocaleString('en-US', { style: 'currency', currency: selectedRecipient?.country.currency })}</p>
                </div>
                <div className="pt-3">
                    <span className="text-sm text-slate-500">Purpose</span>
                    <p className="font-semibold text-slate-800">{purpose}</p>
                </div>
            </div>
            <div className="p-4 bg-slate-200 rounded-lg shadow-digital-inset">
                <div className="flex justify-between items-center font-bold text-lg">
                    <span className="text-slate-600">Total Debited</span>
                    <span className="text-slate-800">{totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
            </div>
             <div className="mt-6 flex space-x-3">
                <button onClick={handlePrevStep} className="w-full py-3 text-slate-700 bg-slate-200 rounded-lg font-semibold shadow-digital active:shadow-digital-inset transition-all">Back</button>
                <button onClick={handleConfirmAndSend} className="w-full py-3 text-white bg-green-500 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                  Confirm & Send
                </button>
            </div>
          </div>
        );

      // Success
      case 4:
        if (!liveTransaction) {
            return (
                <div className="text-center p-8">
                    <SpinnerIcon className="w-12 h-12 text-primary mx-auto"/>
                    <p className="mt-4 text-slate-600">Finalizing transaction...</p>
                </div>
            );
        }
        return (
          <div className="text-center p-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 shadow-digital-inset">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Transfer in Progress!</h2>
            
            <div className="bg-slate-200 rounded-lg shadow-digital-inset p-4 my-6 text-left">
              <div className="grid grid-cols-2 gap-4 items-start border-b border-slate-300 pb-4 mb-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">From</p>
                  <p className="font-bold text-slate-800">Eleanor Vance</p>
                  <p className="text-sm text-slate-600">ApexBank Global Checking</p>
                  <p className="text-sm text-slate-500 font-mono">**** 1234</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">To</p>
                  <p className="font-bold text-slate-800">{liveTransaction.recipient.fullName}</p>
                  <p className="text-sm text-slate-600">{liveTransaction.recipient.bankName}</p>
                  <p className="text-sm text-slate-500 font-mono">{liveTransaction.recipient.accountNumber}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">You sent</span>
                  <span className="font-semibold text-slate-800 font-mono">{liveTransaction.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Exchange rate</span>
                  <span className="text-slate-800 font-mono">1 USD = {liveTransaction.exchangeRate.toFixed(4)} {liveTransaction.recipient.country.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Fee</span>
                  <span className="font-semibold text-slate-800 font-mono">{liveTransaction.fee.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-300 pt-2 mt-2">
                  <span className="text-slate-700">Total debited</span>
                  <span className="text-slate-800 font-mono">{(liveTransaction.sendAmount + liveTransaction.fee).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-primary bg-primary-50/50 p-2 rounded-md mt-2">
                  <span>Recipient gets</span>
                  <span>{liveTransaction.receiveAmount.toLocaleString('en-US', { style: 'currency', currency: liveTransaction.recipient.country.currency })}</span>
                </div>
              </div>
              
              <div className="text-center mt-4 pt-4 border-t border-slate-300">
                  <p className="text-xs text-slate-500">Transaction ID</p>
                  <p className="font-mono text-sm text-slate-600 break-all">{liveTransaction.id}</p>
              </div>
            </div>

            <p className="text-slate-600 mb-4">You can track its live progress below.</p>
            <div className="p-4 rounded-lg shadow-digital-inset my-6">
                <LiveTransactionView transaction={liveTransaction} />
            </div>
            <button onClick={handleStartOver} className="w-full py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
              Send Another Transfer
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-200 p-8 rounded-2xl shadow-digital max-w-2xl mx-auto">
      <div className="mb-10 h-10">
        {step < 4 && <Stepper steps={steps} currentStep={step} />}
      </div>
      {renderStepContent()}
    </div>
  );
};