import React, { useState } from 'react';
import { Card, CardTransaction } from '../types';
import { ApexBankLogo, EyeIcon, EyeSlashIcon, LockClosedIcon, PlusCircleIcon, AppleWalletIcon } from './Icons';
import { AddFundsModal } from './AddFundsModal';

interface CardManagementProps {
  card: Card;
  transactions: CardTransaction[];
  onToggleFreeze: () => void;
  accountBalance: number;
  onAddFunds: (amount: number, cardLastFour: string, cardNetwork: 'Visa' | 'Mastercard') => void;
}

const CardTransactionRow: React.FC<{ transaction: CardTransaction }> = ({ transaction }) => (
    <li className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center shadow-digital-inset">
                <span className="text-xl">🛍️</span>
            </div>
            <div>
                <p className="font-semibold text-slate-800">{transaction.description}</p>
                <p className="text-sm text-slate-500">{transaction.date.toLocaleDateString()}</p>
            </div>
        </div>
        <p className="font-semibold text-slate-800 font-mono">
            -{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p>
    </li>
);

export const CardManagement: React.FC<CardManagementProps> = ({ card, transactions, onToggleFreeze, accountBalance, onAddFunds }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isAddingToWallet, setIsAddingToWallet] = useState(false);

  const handleAddToWallet = () => {
    setIsAddingToWallet(true);
    setTimeout(() => {
        // In a real app, you would use the Apple Pay JS API here.
        // For this demo, we just simulate the success state.
        alert("Card added to Apple Wallet! (Simulation)");
        setIsAddingToWallet(false);
    }, 1500);
  };


  return (
    <>
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Card Visual */}
           <div 
            className={`relative w-full max-w-md mx-auto p-6 rounded-2xl text-white shadow-lg transition-all duration-500 ${card.isFrozen ? 'bg-slate-500 grayscale' : 'bg-primary'} ${isAddingToWallet ? 'animate-add-to-wallet' : ''}`}
            >
                <div className="flex justify-between items-start mb-4">
                    <ApexBankLogo />
                    <div className="w-12 h-8 bg-yellow-400 rounded-md shadow-inner"></div>
                </div>
                <div className="font-mono text-2xl tracking-widest mb-4">
                    {showDetails ? card.fullNumber : `**** **** **** ${card.lastFour}`}
                </div>
                <div className="flex justify-between items-end text-sm">
                    <div>
                    <span className="block text-xs opacity-70">Card Holder</span>
                    <span>{card.cardholderName}</span>
                    </div>
                    <div>
                    <span className="block text-xs opacity-70">Expires</span>
                    <span>{card.expiryDate}</span>
                    </div>
                </div>
            </div>
          
          {/* Card Actions */}
          <div className="bg-slate-200 shadow-digital rounded-2xl p-6 space-y-4 divide-y divide-slate-300">
              <div className="flex justify-between items-center pb-4">
                  <label htmlFor="showDetails" className="font-medium text-slate-700">Show Card Details</label>
                  <button onClick={() => setShowDetails(!showDetails)} className="text-primary p-1 rounded-full shadow-digital active:shadow-digital-inset">
                      {showDetails ? <EyeSlashIcon className="w-6 h-6"/> : <EyeIcon className="w-6 h-6"/>}
                  </button>
              </div>
               <div className="flex justify-between items-center pt-4">
                  <div className="flex items-start space-x-3">
                      <LockClosedIcon className="w-6 h-6 text-slate-500 mt-0.5"/>
                      <div>
                          <p className="font-medium text-slate-700">Freeze Card</p>
                          <p className="text-sm text-slate-500">Instantly block all transactions.</p>
                      </div>
                  </div>
                   <label htmlFor="freeze-toggle" className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="freeze-toggle" className="sr-only peer" checked={card.isFrozen} onChange={onToggleFreeze} />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer shadow-digital-inset peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-digital peer-checked:bg-primary"></div>
                  </label>
              </div>
              <div className="pt-4">
                 <button onClick={handleAddToWallet} disabled={isAddingToWallet} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-black text-white rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50">
                    <AppleWalletIcon className="w-6 h-6" />
                    <span className="font-semibold">Add to Apple Wallet</span>
                </button>
              </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
            {/* Add Funds */}
            <div className="bg-slate-200 shadow-digital rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-800">Add Funds</h3>
                <p className="text-sm text-slate-500 mt-1">Deposit money from a Visa or Mastercard debit card.</p>
                <div className="mt-4 pt-4 border-t border-slate-300">
                    <p className="text-sm text-slate-600">Current Balance</p>
                    <p className="text-2xl font-bold text-slate-800">{accountBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
                <button
                    onClick={() => setIsAddFundsModalOpen(true)}
                    className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Add Funds</span>
                </button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-slate-200 shadow-digital rounded-2xl">
              <div className="p-6 border-b border-slate-300">
                  <h2 className="text-xl font-bold text-slate-800">Recent Card Activity</h2>
              </div>
              <ul className="divide-y divide-slate-300 px-6">
                  {transactions.map(tx => <CardTransactionRow key={tx.id} transaction={tx} />)}
              </ul>
            </div>
        </div>
      </div>
      {isAddFundsModalOpen && <AddFundsModal onClose={() => setIsAddFundsModalOpen(false)} onAddFunds={onAddFunds} />}
      <style>{`
        @keyframes add-to-wallet {
            0% { transform: scale(1) translateY(0); opacity: 1; }
            50% { transform: scale(0.8) translateY(0); opacity: 1; }
            100% { transform: scale(0.3) translateY(-300px); opacity: 0; }
        }
        .animate-add-to-wallet {
            animation: add-to-wallet 1.5s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};