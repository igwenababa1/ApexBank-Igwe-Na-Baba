
import React, { useState } from 'react';
import { Card, CardTransaction } from '../types';
import { ApexBankLogo, EyeIcon, EyeSlashIcon, LockClosedIcon } from './Icons';

interface CardManagementProps {
  card: Card;
  transactions: CardTransaction[];
  onToggleFreeze: () => void;
}

const CardTransactionRow: React.FC<{ transaction: CardTransaction }> = ({ transaction }) => (
    <li className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
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

export const CardManagement: React.FC<CardManagementProps> = ({ card, transactions, onToggleFreeze }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Card Visual */}
        <div className={`relative w-full max-w-md mx-auto p-6 rounded-xl text-white shadow-lg transition-all duration-300 ${card.isFrozen ? 'bg-slate-400' : 'bg-gradient-to-br from-primary to-primary-700'}`}>
          {card.isFrozen && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex flex-col items-center justify-center z-10">
                  <LockClosedIcon className="w-12 h-12 text-white" />
                  <p className="font-bold text-2xl mt-2">CARD FROZEN</p>
              </div>
          )}
          <div className="relative z-0">
            <div className="flex justify-between items-start mb-4">
              <ApexBankLogo />
              <div className="w-12 h-8 bg-yellow-400 rounded-md"></div>
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
        </div>
        
        {/* Card Actions */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <label htmlFor="showDetails" className="font-medium text-slate-700">Show Card Details</label>
                <button onClick={() => setShowDetails(!showDetails)} className="text-primary p-1 rounded-full hover:bg-primary-50">
                    {showDetails ? <EyeSlashIcon className="w-6 h-6"/> : <EyeIcon className="w-6 h-6"/>}
                </button>
            </div>
             <div className="flex justify-between items-center">
                <div className="flex items-start space-x-3">
                    <LockClosedIcon className="w-6 h-6 text-slate-500 mt-0.5"/>
                    <div>
                        <p className="font-medium text-slate-700">Freeze Card</p>
                        <p className="text-sm text-slate-500">Instantly block all transactions if your card is lost or stolen.</p>
                    </div>
                </div>
                 <label htmlFor="freeze-toggle" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="freeze-toggle" className="sr-only peer" checked={card.isFrozen} onChange={onToggleFreeze} />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Recent Card Activity</h2>
        </div>
        <ul className="divide-y divide-slate-200 px-6">
            {transactions.map(tx => <CardTransactionRow key={tx.id} transaction={tx} />)}
        </ul>
      </div>
    </div>
  );
};
