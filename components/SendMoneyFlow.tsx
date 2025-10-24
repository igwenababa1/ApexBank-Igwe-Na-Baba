import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Recipient, Transaction, Account, SecuritySettings, View } from '../types';
import { FIXED_FEE, EXCHANGE_RATES, TRANSFER_PURPOSES, USER_PIN, NETWORK_AUTH_CODE } from '../constants';
import { LiveTransactionView } from './LiveTransactionView';
import { SpinnerIcon, CheckCircleIcon, ExclamationTriangleIcon, KeypadIcon, FaceIdIcon, ShieldCheckIcon, CameraIcon, ClipboardDocumentIcon, XIcon, XCircleIcon, NetworkIcon, GlobeAltIcon } from './Icons';
import { triggerHaptic } from '../utils/haptics';
import { PaymentReceipt } from './PaymentReceipt'; // Import the new component

interface SendMoneyFlowProps {
  recipients: Recipient[];
  accounts: Account[];
  createTransaction: (transaction: Omit<Transaction, 'id' | 'status' | 'estimatedArrival' | 'statusTimestamps' | 'type'>) => Transaction | null;
  transactions: Transaction[];
  securitySettings: SecuritySettings;
  hapticsEnabled: boolean;
  onAuthorizeTransaction: (transactionId: string) => void;
  setActiveView: (view: View) => void;
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
                                <div className="h-0.5 w-full bg-slate-700" />
                            </div>
                            <div className="relative w-8 h-8 flex items-center justify-center bg-slate-800 border-2 border-primary rounded-full">
                                <span className="h-2.5 w-2.5 bg-primary rounded-full" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-slate-700" />
                            </div>
                            <div className="relative w-8 h-8 flex items-center justify-center bg-slate-800 border-2 border-slate-700 rounded-full" />
                        </>
                    )}
                    <p className="absolute -bottom-6 text-xs text-center w-28 -left-10 font-medium text-slate-400">{step}</p>
                </li>
            ))}
        </ol>
    </nav>
);

// Main Component
export const SendMoneyFlow: React.FC<SendMoneyFlowProps> = ({ recipients, accounts, createTransaction, transactions, securitySettings, hapticsEnabled, onAuthorizeTransaction, setActiveView }) => {
  const [step, setStep] = useState(0); // 0: Amount, 1: Review, 2: Authorize, 3: Success
  
  const availableSourceAccounts = accounts.filter(acc => acc.balance > 0);
  // Form State
  const [sourceAccountId, setSourceAccountId] = useState<string>(availableSourceAccounts.length > 0 ? availableSourceAccounts[0].id : '');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(recipients.length > 0 ? recipients[0] : null);
  const [sendAmount, setSendAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [tooltip, setTooltip] = useState({ show: false, message: '' });
  const tooltipTimeout = useRef<number | null>(null);

  // Cheque State
  const [chequeDetails, setChequeDetails] = useState<{ number: string; front: string | null; back: string | null }>({ number: '', front: null, back: null });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFor, setCameraFor] = useState<'front' | 'back' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});


  // Security State
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const authAttempted = useRef(false);

  // Transaction State
  const [createdTransaction, setCreatedTransaction] = useState<Transaction | null>(null);
  
  const sourceAccount = accounts.find(acc => acc.id === sourceAccountId);

  const isCheckPayment = purpose === 'Pay by Check';
  const numericSendAmount = parseFloat(sendAmount) || 0;
  const exchangeRate = selectedRecipient ? EXCHANGE_RATES[selectedRecipient.country.currency] : 0;
  const receiveAmount = numericSendAmount * exchangeRate;
  const totalCost = numericSendAmount + FIXED_FEE;
  
  const isChequeDetailsInvalid = isCheckPayment && (!chequeDetails.number || !chequeDetails.front || !chequeDetails.back);
  const isAmountInvalid = !sourceAccount || totalCost > sourceAccount.balance || numericSendAmount <= 0 || isChequeDetailsInvalid || !purpose;

  const liveTransaction = useMemo(() => {
    if (!createdTransaction) return null;
    return transactions.find(t => t.id === createdTransaction.id) || createdTransaction;
  }, [transactions, createdTransaction]);

  const hapticTrigger = useCallback(() => {
    if(hapticsEnabled) triggerHaptic();
  }, [hapticsEnabled]);

  const handleNextStep = useCallback(() => {
    hapticTrigger();
    setStep(prev => prev + 1);
  }, [hapticTrigger]);

  const handlePrevStep = useCallback(() => {
    hapticTrigger();
    setStep(prev => prev - 1);
  }, [hapticTrigger]);
  
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
    } else if (!purpose) {
      message = 'Please select a purpose for the transfer.';
    } else if (!sourceAccount || totalCost > sourceAccount.balance) {
      message = 'Insufficient balance for this transaction.';
    } else if (isChequeDetailsInvalid) {
      message = 'Please provide all cheque details.';
    } else if (!selectedRecipient) {
      message = 'Please select a recipient.';
    }
    
    if (message) showTooltip(message, isClick);
  };
  
  const handleConfirmAndSend = useCallback(() => {
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
      chequeDetails: isCheckPayment ? {
        chequeNumber: chequeDetails.number,
        images: {
          front: chequeDetails.front!,
          back: chequeDetails.back!,
        }
      } : undefined
    });
    
    if(newTransaction) {
        setCreatedTransaction(newTransaction);
        handleNextStep();
    }
  }, [createTransaction, exchangeRate, hapticTrigger, numericSendAmount, purpose, receiveAmount, selectedRecipient, sourceAccount, handleNextStep, isCheckPayment, chequeDetails]);

  const handlePurposeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPurpose(e.target.value);
    if (e.target.value !== 'Pay by Check') {
        setChequeDetails({ number: '', front: null, back: null });
        setErrors({});
    }
  };

  const handleImageUpload = (side: 'front' | 'back', file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setChequeDetails(prev => ({ ...prev, [side]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const openCamera = (side: 'front' | 'back') => {
    setCameraFor(side);
    setIsCameraOpen(true);
  };

  const handleCapture = (imageDataUrl: string) => {
    if (cameraFor) {
      setChequeDetails(prev => ({ ...prev, [cameraFor]: imageDataUrl }));
    }
    setIsCameraOpen(false);
  };


  const handlePinSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    hapticTrigger();
    setIsAuthenticating(true);
    setPinError('');
    setTimeout(() => { // Simulate API call
      if (pin === USER_PIN) {
        handleConfirmAndSend();
      } else {
        setPinError('Incorrect PIN. Please try again.');
        setIsAuthenticating(false);
      }
    }, 500);
  }, [hapticTrigger, pin, handleConfirmAndSend]);

  const handleBiometricAuth = useCallback(async () => {
    hapticTrigger();
    setIsAuthenticating(true);
    setPinError('');
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        handleConfirmAndSend();
    } catch (error) {
        console.error("Biometric auth failed", error);
        setPinError('Biometric authentication failed. Please use your PIN.');
        setIsAuthenticating(false);
    }
  }, [hapticTrigger, handleConfirmAndSend]);
  
  useEffect(() => {
    if (step === 2 && securitySettings.biometricsEnabled && !authAttempted.current) {
      authAttempted.current = true;
      handleBiometricAuth();
    }
    if (step !== 2) authAttempted.current = false;
  }, [step, securitySettings.biometricsEnabled, handleBiometricAuth]);

  
  const handleAuthCodeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!liveTransaction) return;

      setIsAuthorizing(true);
      setAuthError('');
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
    setPurpose('');
    setPin('');
    setPinError('');
    setCreatedTransaction(null);
    setChequeDetails({ number: '', front: null, back: null });
  };

  const steps = ['Amount', 'Review', 'Authorize', 'Complete'];

  const renderStepContent = () => {
    switch(step) {
      case 0:
        return (
          <>
            <div className="space-y-6">
               <div>
                <label htmlFor="sourceAccount" className="block text-sm font-medium text-slate-300">Send From</label>
                <select id="sourceAccount" value={sourceAccountId} onChange={e => setSourceAccountId(e.target.value)} className="mt-1 block w-full bg-slate-800/50 text-white border-slate-700 p-3 rounded-md shadow-inner focus:ring-2 focus:ring-primary-400">
                  {availableSourceAccounts.map(acc => ( <option key={acc.id} value={acc.id}> {acc.nickname || acc.type} ({acc.accountNumber}) - {acc.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} </option> ))}
                </select>
                {availableSourceAccounts.length === 0 && <p className="mt-2 text-sm text-yellow-400">You have no accounts with a positive balance to send from.</p>}
              </div>
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-slate-300">Recipient</label>
                <select id="recipient" value={selectedRecipient?.id || ''} onChange={e => setSelectedRecipient(recipients.find(r => r.id === e.target.value) || null)} className="mt-1 block w-full bg-slate-800/50 text-white border-slate-700 p-3 rounded-md shadow-inner focus:ring-2 focus:ring-primary-400">
                  {recipients.map(r => <option key={r.id} value={r.id}> {r.nickname ? `${r.nickname} (${r.fullName})` : r.fullName} - {r.bankName} </option> )}
                </select>
              </div>
              <div>
                <label htmlFor="sendAmount" className="block text-sm font-medium text-slate-300">You Send</label>
                <div className="mt-1 relative rounded-md shadow-inner bg-slate-800/50 flex items-center">
                  <input type="number" id="sendAmount" value={sendAmount} onChange={e => setSendAmount(e.target.value)} className="w-full bg-transparent border-0 p-3 pr-4 text-lg font-mono text-white flex-grow" placeholder="0.00"/>
                  <div className="p-3 flex items-center space-x-2 border-l border-slate-700 pointer-events-none">
                     <img src={`https://flagcdn.com/w40/us.png`} alt="USD flag" className="w-5 h-auto" />
                    <span className="text-slate-400 font-semibold">USD</span>
                  </div>
                </div>
                {isAmountInvalid && numericSendAmount > 0 && !isChequeDetailsInvalid && purpose && <p className="mt-2 text-sm text-red-400">Insufficient balance in selected account.</p>}
              </div>
              <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-slate-300">Purpose of Transfer</label>
                  <select id="purpose" value={purpose} onChange={handlePurposeChange} className="mt-1 block w-full bg-slate-800/50 text-white border-slate-700 p-3 rounded-md shadow-inner focus:ring-2 focus:ring-primary-400">
                      <option value="" disabled>Select a purpose...</option>
                      {TRANSFER_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
              </div>
              
              {isCheckPayment && (
                <div className="space-y-4 p-4 bg-black/20 rounded-lg shadow-inner animate-fade-in-up">
                    <h3 className="font-semibold text-slate-200">Cheque Details</h3>
                    <div>
                        <label htmlFor="chequeNumber" className="block text-sm font-medium text-slate-300">Cheque Number</label>
                        <input type="text" id="chequeNumber" value={chequeDetails.number} onChange={(e) => setChequeDetails(p => ({...p, number: e.target.value.replace(/\D/g, '')}))} className="mt-1 w-full bg-slate-800/50 text-white p-3 rounded-md shadow-inner"/>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ImageCaptureBox label="Front of Cheque" image={chequeDetails.front} onUpload={(e) => handleImageUpload('front', e.target.files?.[0] || null)} onCapture={() => openCamera('front')} onClear={() => setChequeDetails(p => ({...p, front: null}))} />
                        <ImageCaptureBox label="Back of Cheque" image={chequeDetails.back} onUpload={(e) => handleImageUpload('back', e.target.files?.[0] || null)} onCapture={() => openCamera('back')} onClear={() => setChequeDetails(p => ({...p, back: null}))} />
                    </div>
                </div>
              )}

              <div className="p-4 bg-black/20 rounded-lg shadow-inner space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Exchange Rate</span>
                  <span className="font-mono text-slate-200">1 USD = {exchangeRate.toFixed(4)} {selectedRecipient?.country.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Fee</span>
                  <span className="font-mono text-slate-200">{FIXED_FEE.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-400">Total to Pay</span>
                  <span className="font-mono text-slate-200">{totalCost.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700 items-center">
                  <span className="text-slate-300">Recipient Gets</span>
                   <div className="flex items-center space-x-2">
                    {selectedRecipient && ( <img key={selectedRecipient.country.code} src={`https://flagcdn.com/w40/${selectedRecipient.country.code.toLowerCase()}.png`} alt={`${selectedRecipient.country.currency} flag`} className="w-5 h-auto animate-pop-in"/> )}
                    <span className="text-primary">{receiveAmount.toFixed(2)} {selectedRecipient?.country.currency}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <button onClick={handleNextStep} disabled={isAmountInvalid || !selectedRecipient} className="w-full py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg disabled:bg-primary/50 disabled:cursor-not-allowed transition-all">
                  Continue
                </button>
                {(isAmountInvalid || !selectedRecipient) && (
                    <div className="absolute inset-0 cursor-not-allowed" onClick={() => handleDisabledInteraction(true)} onMouseEnter={() => handleDisabledInteraction(false)} onMouseLeave={hideTooltip}/>
                )}
                {tooltip.show && ( <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-sm font-medium text-white bg-slate-800 rounded-md shadow-lg whitespace-nowrap z-10 animate-fade-in-up"> {tooltip.message} </div> )}
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-100 text-center">Review Your Transfer</h3>
            <div className="p-4 bg-black/20 rounded-lg shadow-inner space-y-3 divide-y divide-slate-700">
                <div className="pt-2"> <span className="text-sm text-slate-400">From</span> <p className="font-semibold text-slate-100">{sourceAccount?.nickname || sourceAccount?.type} ({sourceAccount?.accountNumber})</p> </div>
                <div className="pt-3"> <span className="text-sm text-slate-400">To</span> <p className="font-semibold text-slate-100">{selectedRecipient?.nickname ? `${selectedRecipient?.nickname} (${selectedRecipient?.fullName})` : selectedRecipient?.fullName}</p> <p className="text-sm text-slate-300">{selectedRecipient?.bankName} ({selectedRecipient?.country.name})</p> </div>
                <div className="pt-3"> <span className="text-sm text-slate-400">You Send</span> <p className="font-semibold text-slate-100">{numericSendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p> </div>
                <div className="pt-3"> <span className="text-sm text-slate-400">Recipient Gets</span> <p className="font-semibold text-primary">{receiveAmount.toLocaleString('en-US', { style: 'currency', currency: selectedRecipient?.country.currency })}</p> </div>
                <div className="pt-3"> <span className="text-sm text-slate-400">Purpose</span> <p className="font-semibold text-slate-100">{purpose}</p> </div>
                {isCheckPayment && chequeDetails.front && chequeDetails.back && (
                    <div className="pt-3">
                        <span className="text-sm text-slate-400">Cheque Details</span>
                        <p className="font-semibold text-slate-100">Cheque #{chequeDetails.number}</p>
                        <div className="flex gap-4 mt-2">
                            <img src={chequeDetails.front} alt="Front of cheque" className="w-1/2 rounded-md border border-slate-700"/>
                            <img src={chequeDetails.back} alt="Back of cheque" className="w-1/2 rounded-md border border-slate-700"/>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 bg-black/20 rounded-lg shadow-inner">
                <div className="flex justify-between items-center font-bold text-lg">
                    <span className="text-slate-300">Total Debited</span>
                    <span className="text-slate-100">{totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
            </div>
             <div className="mt-6 flex space-x-3">
                <button onClick={handlePrevStep} className="w-full py-3 text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all">Back</button>
                <button onClick={handleNextStep} className="w-full py-3 text-white bg-green-500 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"> Confirm & Authorize </button>
            </div>
          </div>
        );
      case 2:
          return (
              <div className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/50 rounded-full mb-4 shadow-inner"> {isAuthenticating ? <SpinnerIcon className="w-8 h-8 text-primary"/> : <KeypadIcon className="w-8 h-8 text-primary"/>} </div>
                  <h2 className="text-2xl font-bold text-slate-100">Authorize Payment</h2>
                  <div className="my-4 p-4 bg-yellow-900/50 text-yellow-200 rounded-lg shadow-inner text-sm text-left flex items-start space-x-3">
                      <ExclamationTriangleIcon className="w-8 h-8 flex-shrink-0 text-yellow-400" />
                      <p> <strong>Stop. Think. Is this transfer safe?</strong><br/> Scammers are clever. Only send money to people you personally know and trust. We cannot recover funds once they are sent. </p>
                  </div>
                  <form onSubmit={handlePinSubmit}>
                      <label htmlFor="pin-input" className="text-slate-300 my-4 block">Please enter your 4-digit security PIN to authorize this transfer.</label>
                      <input id="pin-input" type="password" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} className="w-48 mx-auto bg-slate-800/50 text-white border-0 p-3 text-center text-3xl tracking-[.75em] rounded-md shadow-inner focus:ring-2 focus:ring-primary-400" maxLength={4} placeholder="----" autoComplete="off" disabled={isAuthenticating} />
                      {pinError && <p className="mt-2 text-sm text-red-400">{pinError}</p>}
                       <div className="mt-6 flex space-x-3">
                          <button type="button" onClick={handlePrevStep} className="w-full py-3 text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all" disabled={isAuthenticating}>Back</button>
                          <button type="submit" disabled={pin.length !== 4 || isAuthenticating} className="w-full py-3 text-white bg-primary rounded-lg font-semibold shadow-md hover:shadow-lg disabled:bg-primary/50 transition-all"> Authorize & Send </button>
                      </div>
                  </form>
                  {securitySettings.biometricsEnabled && !isAuthenticating && (
                    <>
                      <div className="my-4 flex items-center">
                          <div className="flex-grow border-t border-slate-700"></div> <span className="flex-shrink mx-4 text-xs text-slate-500">OR</span> <div className="flex-grow border-t border-slate-700"></div>
                      </div>
                      <button onClick={() => handleBiometricAuth()} disabled={isAuthenticating} className="w-full flex justify-center items-center space-x-2 py-3 rounded-lg font-semibold text-slate-200 bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-shadow">
                          <FaceIdIcon className="w-5 h-5"/> <span>Use Face ID</span>
                      </button>
                    </>
                  )}
              </div>
          );
      case 3:
        if (!liveTransaction || !sourceAccount) return <div className="text-center p-8"> <SpinnerIcon className="w-12 h-12 text-primary mx-auto"/> <p className="mt-4 text-slate-400">Finalizing transaction...</p> </div>;
        
        return (
            <PaymentReceipt 
                transaction={liveTransaction}
                sourceAccount={sourceAccount}
                onStartOver={handleStartOver}
                onViewActivity={() => setActiveView('history')}
            />
        );
      default: return null;
    }
  };

  return (
    <>
      <div className="bg-slate-900 relative overflow-hidden shadow-2xl p-8 rounded-2xl max-w-2xl mx-auto">
        <div className="absolute inset-0 z-0 flex pointer-events-none">
            <video
                className="w-1/2 h-full object-cover"
                src="https://videos.pexels.com/video-files/4493309/4493309-sd_960_540_25fps.mp4"
                autoPlay
                loop
                muted
                playsInline
            />
            <video
                className="w-1/2 h-full object-cover transform scale-x-[-1]"
                src="https://videos.pexels.com/video-files/4493309/4493309-sd_960_540_25fps.mp4"
                autoPlay
                loop
                muted
                playsInline
            />
        </div>
        <div className="absolute inset-0 z-0 bg-slate-900/80 backdrop-blur-sm"></div>
        
        <div className="relative z-10">
            <div className="mb-10 h-10">
                {step < 3 && <Stepper steps={steps} currentStep={step} />}
            </div>
            {renderStepContent()}
        </div>
      </div>
      {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} onCapture={handleCapture} />}
    </>
  );
};

// --- Sub-components for Cheque Feature ---

const ImageCaptureBox: React.FC<{ label: string; image: string | null; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; onCapture: () => void; onClear: () => void; }> = ({ label, image, onUpload, onCapture, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      {image ? (
        <div className="relative w-full aspect-video bg-slate-900 rounded-lg shadow-inner overflow-hidden">
          <img src={image} alt={label} className="w-full h-full object-cover"/>
          <button onClick={onClear} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors">
            <XCircleIcon className="w-5 h-5"/>
          </button>
        </div>
      ) : (
        <div className="w-full aspect-video bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center p-4 text-center">
            <ClipboardDocumentIcon className="w-8 h-8 text-slate-500 mb-2"/>
            <div className="flex gap-2">
                 <button type="button" onClick={onCapture} className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-700/50 hover:bg-slate-700 rounded-lg">Use Camera</button>
                <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-700/50 hover:bg-slate-700 rounded-lg">Upload</button>
            </div>
            <input type="file" accept="image/*" ref={inputRef} onChange={onUpload} className="hidden"/>
        </div>
      )}
    </div>
  )
};

const CameraModal: React.FC<{ onClose: () => void; onCapture: (imageDataUrl: string) => void; }> = ({ onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("Could not access the camera. Please check permissions.");
                onClose();
            }
        };
        startCamera();

        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, [onClose]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            onCapture(canvas.toDataURL('image/jpeg'));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex flex-col items-center justify-center p-4 animate-fade-in">
            <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-[70%] rounded-lg shadow-2xl"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="mt-6 flex items-center space-x-6">
                <button onClick={onClose} className="px-6 py-3 text-sm font-medium text-white bg-slate-700/50 rounded-lg">Cancel</button>
                <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg ring-4 ring-white/30">
                    <div className="w-16 h-16 rounded-full bg-white active:bg-slate-200"></div>
                </button>
                <div className="w-20"></div> {/* Spacer */}
            </div>
        </div>
    );
};