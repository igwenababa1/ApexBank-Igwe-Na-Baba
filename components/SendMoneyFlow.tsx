import React, { useState, useMemo, useRef } from 'react';
import { Recipient, Transaction, Account, SecuritySettings } from '../types';
import { FIXED_FEE, EXCHANGE_RATES, TRANSFER_PURPOSES, USER_PIN, NETWORK_AUTH_CODE } from '../constants';
import { LiveTransactionView } from './LiveTransactionView';
import { SpinnerIcon, CheckCircleIcon, ExclamationTriangleIcon, KeypadIcon, BankIcon, CreditCardIcon, WithdrawIcon, FaceIdIcon, ShieldCheckIcon } from './Icons';
import { triggerHaptic } from '../utils/haptics';

interface SendMoneyFlowProps {
  recipients: Recipient[];
  accounts: Account[];
  createTransaction: (transaction: Omit<Transaction, 'id' | 'status' | 'estimatedArrival' | 'statusTimestamps' | 'type'>) => Transaction | null;
  transactions: Transaction[];
  securitySettings: SecuritySettings;
  hapticsEnabled: boolean;
  onAuthorizeTransaction: (transactionId: string) => void;
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
export const SendMoneyFlow: React.FC<SendMoneyFlowProps> = ({ recipients, accounts, createTransaction, transactions, securitySettings, hapticsEnabled, onAuthorizeTransaction }) => {
  const [step, setStep] = useState(0); // 0: Amount, 1: Authorize, 2: Review, 3: Success
  
  const availableSourceAccounts = accounts.filter(acc => acc.balance > 0);
  // Form State
  const [sourceAccountId, setSourceAccountId] = useState<string>(availableSourceAccounts.length > 0 ? availableSourceAccounts[0].id : '');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(recipients.length > 0 ? recipients[0] : null);
  const [sendAmount, setSendAmount] = useState('');
  const [purpose, setPurpose] = useState(TRANSFER_PURPOSES[0]);
  const [tooltip, setTooltip] = useState({ show: false, message: '' });
  const tooltipTimeout = useRef<number | null>(null);

  // Security State
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Transaction State
  const [createdTransaction, setCreatedTransaction] = useState<Transaction | null>(null);
  
  const sourceAccount = accounts.find(acc => acc.id === sourceAccountId);

  const numericSendAmount = parseFloat(sendAmount) || 0;
  const exchangeRate = selectedRecipient ? EXCHANGE_RATES[selectedRecipient.country.currency] : 0;
  const receiveAmount = numericSendAmount * exchangeRate;
  const totalCost = numericSendAmount + FIXED_FEE;
  const isAmountInvalid = !sourceAccount || totalCost > sourceAccount.balance || numericSendAmount <= 0;

  const liveTransaction = useMemo(() => {
    if (!createdTransaction) return null;
    return transactions.find(t => t.id === createdTransaction.id) || createdTransaction;
  }, [transactions, createdTransaction]);

  const hapticTrigger = () => {
    if(hapticsEnabled) triggerHaptic();
  }

  const handleNextStep = () => {
    hapticTrigger();
    setStep(prev => prev + 1);
  }
  const handlePrevStep = () => {
    hapticTrigger();
    setStep(prev => prev - 1);
  }
  
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
    if (numericSendAmount <= 0) {
        message = 'Please enter an amount to send.';
    } else if (isAmountInvalid) {
        message = 'Insufficient balance for this transaction.';
    } else if (!selectedRecipient) {
        message = 'Please select a recipient.';
    }
    
    if (message) {
        showTooltip(message, isClick); // Auto-hide only on click
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hapticTrigger();
    setIsAuthenticating(true);
    setPinError('');
    setTimeout(() => { // Simulate API call
      if (pin === USER_PIN) {
        handleNextStep();
      } else {
        setPinError('Incorrect PIN. Please try again.');
      }
      setIsAuthenticating(false);
    }, 500);
  };

  const handleBiometricAuth = () => {
    hapticTrigger();
    setIsAuthenticating(true);
    setPinError('');
    setTimeout(() => { // Simulate biometric prompt
        // In a real app, this would use WebAuthn API
        // For demo, we just approve it
        handleNextStep();
        setIsAuthenticating(false);
    }, 1500);
  };

  const handleConfirmAndSend = () => {
    if (!selectedRecipient || !sourceAccount) return;
    hapticTrigger();

    const newTransaction = createTransaction({
      accountId: sourceAccount.id,
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
  
  const handleAuthCodeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!liveTransaction) return;

      setIsAuthorizing(true);
      setAuthError('');
      // Simulate network delay
      setTimeout(() => {
          if (authCode === NETWORK_AUTH_CODE) {
              onAuthorizeTransaction(liveTransaction.id);
          } else {
              setAuthError('Invalid Authorization Code. Please try again.');
          }
          setIsAuthorizing(false);
          setAuthCode('');
      }, 1000);
  };

  const handleStartOver = () => {
    hapticTrigger();
    setStep(0);
    setSelectedRecipient(recipients.length > 0 ? recipients[0] : null);
    setSourceAccountId(availableSourceAccounts.length > 0 ? availableSourceAccounts[0].id : '');
    setSendAmount('');
    setPurpose(TRANSFER_PURPOSES[0]);
    setPin('');
    setPinError('');
    setCreatedTransaction(null);
  };

  const steps = ['Amount', 'Authorize', 'Review', 'Complete'];

  const renderStepContent = () => {
    switch(step) {
      // Amount & Recipient
      case 0:
        return (
          <>
            <div className="space-y-6">
               <div>
                <label htmlFor="sourceAccount" className="block text-sm font-medium text-slate-700">Send From</label>
                <select
                  id="sourceAccount"
                  value={sourceAccountId}
                  onChange={e => setSourceAccountId(e.target.value)}
                  className="mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400"
                >
                  {availableSourceAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.nickname || acc.type} ({acc.accountNumber}) - {acc.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </option>
                  ))}
                </select>
                {availableSourceAccounts.length === 0 && <p className="mt-2 text-sm text-yellow-600">You have no accounts with a positive balance to send from.</p>}
              </div>

              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-slate-700">Recipient</label>
                <select
                  id="recipient"
                  value={selectedRecipient?.id || ''}
                  onChange={e => setSelectedRecipient(recipients.find(r => r.id === e.target.value) || null)}
                  className="mt-1 block w-full bg-slate-200 border-0 p-3 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400"
                >
                  {recipients.map(r => 
                    <option key={r.id} value={r.id}>
                      {r.nickname ? `${r.nickname} (${r.fullName})` : r.fullName} - {r.bankName}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="sendAmount" className="block text-sm font-medium text-slate-700">You Send</label>
                <div className="mt-1 relative rounded-md shadow-digital-inset bg-slate-200 flex items-center">
                  <input
                    type="number"
                    id="sendAmount"
                    value={sendAmount}
                    onChange={e => setSendAmount(e.target.value)}
                    className="w-full bg-transparent border-0 p-3 pr-4 text-lg font-mono flex-grow"
                    placeholder="0.00"
                  />
                  <div className="p-3 flex items-center space-x-2 border-l border-slate-300 pointer-events-none">
                     <img src={`https://flagcdn.com/w40/us.png`} alt="USD flag" className="w-5 h-auto" />
                    <span className="text-slate-500 font-semibold">USD</span>
                  </div>
                </div>
                {isAmountInvalid && numericSendAmount > 0 && <p className="mt-2 text-sm text-red-600">Insufficient balance in selected account.</p>}
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
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-300 items-center">
                  <span className="text-slate-700">Recipient Gets</span>
                   <div className="flex items-center space-x-2">
                    {selectedRecipient && (
                      <img 
                          key={selectedRecipient.country.code}
                          src={`https://flagcdn.com/w40/${selectedRecipient.country.code.toLowerCase()}.png`} 
                          alt={`${selectedRecipient.country.currency} flag`}
                          className="w-5 h-auto animate-pop-in"
                      />
                    )}
                    <span className="text-primary">{receiveAmount.toFixed(2)} {selectedRecipient?.country.currency}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <button onClick={handleNextStep} disabled={isAmountInvalid || !selectedRecipient} className="w-full py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg disabled:bg-primary-300 transition-all">
                  Continue
                </button>
                {(isAmountInvalid || !selectedRecipient) && (
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
            </div>
          </>
        );

      // PIN Authorization
      case 1:
          return (
              <div className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4 shadow-digital">
                      {isAuthenticating ? <SpinnerIcon className="w-8 h-8 text-primary"/> : <KeypadIcon className="w-8 h-8 text-primary"/>}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Authorize Payment</h2>
                  
                  <div className="my-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-digital-inset text-sm text-left flex items-start space-x-3">
                      <ExclamationTriangleIcon className="w-8 h-8 flex-shrink-0" />
                      <p>
                          <strong>Stop. Think. Is this transfer safe?</strong><br/>
                          Scammers are clever. Only send money to people you personally know and trust. We cannot recover funds once they are sent.
                      </p>
                  </div>

                  <form onSubmit={handlePinSubmit}>
                      <label htmlFor="pin-input" className="text-slate-600 my-4 block">Please enter your 4-digit security PIN to authorize this transfer.</label>
                      <input 
                          id="pin-input"
                          type="password" 
                          value={pin}
                          onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-48 mx-auto bg-slate-200 border-0 p-3 text-center text-3xl tracking-[.75em] rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400"
                          maxLength={4}
                          placeholder="----"
                          autoComplete="off"
                          disabled={isAuthenticating}
                      />
                      {pinError && <p className="mt-2 text-sm text-red-600">{pinError}</p>}
                       <div className="mt-6 flex space-x-3">
                          <button type="button" onClick={handlePrevStep} className="w-full py-3 text-slate-700 bg-slate-200 rounded-lg font-semibold shadow-digital active:shadow-digital-inset transition-all" disabled={isAuthenticating}>Back</button>
                          <button type="submit" disabled={pin.length !== 4 || isAuthenticating} className="w-full py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg disabled:bg-primary-300 transition-all">
                            Authorize
                          </button>
                      </div>
                  </form>
                  {securitySettings.biometricsEnabled && (
                    <>
                      <div className="my-4 flex items-center">
                          <div className="flex-grow border-t border-slate-300"></div>
                          <span className="flex-shrink mx-4 text-xs text-slate-400">OR</span>
                          <div className="flex-grow border-t border-slate-300"></div>
                      </div>
                      <button onClick={handleBiometricAuth} disabled={isAuthenticating} className="w-full flex justify-center items-center space-x-2 py-3 rounded-lg font-semibold text-slate-700 bg-slate-200 shadow-digital active:shadow-digital-inset disabled:opacity-50 transition-shadow">
                          {isAuthenticating ? (
                              <SpinnerIcon className="w-5 h-5"/>
                          ) : (
                              <FaceIdIcon className="w-5 h-5"/>
                          )}
                          <span>{isAuthenticating ? 'Scanning...' : 'Use Face ID'}</span>
                      </button>
                    </>
                  )}
              </div>
          );

      // Review
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 text-center">Review Your Transfer</h3>
            <div className="p-4 bg-slate-200 rounded-lg shadow-digital-inset space-y-3 divide-y divide-slate-300">
                <div className="pt-2">
                    <span className="text-sm text-slate-500">From</span>
                    <p className="font-semibold text-slate-800">{sourceAccount?.nickname || sourceAccount?.type} ({sourceAccount?.accountNumber})</p>
                </div>
                <div className="pt-3">
                    <span className="text-sm text-slate-500">To</span>
                    <p className="font-semibold text-slate-800">{selectedRecipient?.nickname ? `${selectedRecipient?.nickname} (${selectedRecipient?.fullName})` : selectedRecipient?.fullName}</p>
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
      case 3:
        if (!liveTransaction) {
            return (
                <div className="text-center p-8">
                    <SpinnerIcon className="w-12 h-12 text-primary mx-auto"/>
                    <p className="mt-4 text-slate-600">Finalizing transaction...</p>
                </div>
            );
        }
        
        const isAwaitingAuth = liveTransaction.status === 'In Transit' && liveTransaction.requiresAuth;

        return (
          <div className="text-center p-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 shadow-digital-inset">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Transfer in Progress!</h2>
            <p className="text-slate-600 my-4">You can track its live progress below.</p>
            
            <div className="p-4 rounded-lg shadow-digital-inset my-6">
                <LiveTransactionView transaction={liveTransaction} />
            </div>

            {isAwaitingAuth && (
              <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded-lg shadow-digital text-left animate-fade-in-up">
                  <div className="flex items-start space-x-3">
                      <ShieldCheckIcon className="w-8 h-8 flex-shrink-0 text-blue-500" />
                      <div>
                          <h4 className="font-bold">Advanced Authorization Required</h4>
                          <p className="text-sm mt-1">For your security, this international transfer has been flagged for final authorization. Please enter the 6-digit code sent to your registered authenticator app to release the funds to the recipient's bank.</p>
                          <form onSubmit={handleAuthCodeSubmit} className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <input
                                  type="text"
                                  value={authCode}
                                  onChange={e => setAuthCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                  className="flex-grow bg-white/70 border-blue-300 p-2 text-center text-lg tracking-[.5em] rounded-md shadow-inner focus:ring-2 focus:ring-blue-500"
                                  maxLength={6}
                                  placeholder="------"
                                  disabled={isAuthorizing}
                              />
                              <button type="submit" disabled={isAuthorizing || authCode.length !== 6} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center">
                                  {isAuthorizing ? <SpinnerIcon className="w-5 h-5"/> : 'Submit Code'}
                              </button>
                          </form>
                          {authError && <p className="text-red-600 text-xs mt-2 text-center">{authError}</p>}
                      </div>
                  </div>
              </div>
            )}
            
            <button onClick={handleStartOver} className="w-full mt-6 py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
              Send Another Transfer
            </button>
             <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-200 p-8 rounded-2xl shadow-digital max-w-2xl mx-auto">
      <div className="mb-10 h-10">
        {step < 3 && <Stepper steps={steps} currentStep={step} />}
      </div>
      {renderStepContent()}
    </div>
  );
};