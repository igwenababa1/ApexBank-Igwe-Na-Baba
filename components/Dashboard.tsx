
import React, { useState } from 'react';
import { Transaction, TransactionStatus, CustomerGroup, Country } from '../types';
import { CheckCircleIcon, ClockIcon, EyeIcon, EyeSlashIcon, VerifiedBadgeIcon, DepositIcon, WithdrawIcon, ChevronDownIcon } from './Icons';
import { sendPushNotification } from '../services/notificationService';
import { CurrencyConverter } from './CurrencyConverter';
import { SUPPORTED_COUNTRIES, EXCHANGE_RATES } from '../constants';

interface DashboardProps {
  accountBalance: number;
  transactions: Transaction[];
}

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isCompleted = transaction.status === TransactionStatus.FUNDS_ARRIVED;
  const statusIcon = isCompleted ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <ClockIcon className="w-5 h-5 text-yellow-500" />;
  const statusColor = isCompleted ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                {transaction.recipient.fullName.charAt(0)}
            </div>
            <div>
                <p className="font-semibold text-slate-800">{transaction.recipient.fullName}</p>
                <p className="text-sm text-slate-500">{transaction.recipient.bankName}</p>
            </div>
        </div>
      </td>
      <td className="py-4 px-6 text-slate-600">
        - {transaction.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </td>
      <td className="py-4 px-6">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center space-x-1 ${statusColor}`}>
            {statusIcon}
            <span>{transaction.status}</span>
        </span>
      </td>
      <td className="py-4 px-6 text-slate-600 text-sm">
        {transaction.statusTimestamps[TransactionStatus.SUBMITTED].toLocaleDateString()}
      </td>
    </tr>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ accountBalance, transactions }) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isRatesVisible, setIsRatesVisible] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };
  
  const handleSendWelcomePush = () => {
    sendPushNotification(
      CustomerGroup.NEW_USERS,
      'Welcome to ApexBank!',
      'Your new account is ready. Start sending money globally with transparent fees and bank-grade security.'
    );
    alert('Simulated push notification has been sent. Check the console for details.');
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-slate-800">Eleanor Vance</h3>
            <VerifiedBadgeIcon className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-sm text-slate-500 mt-1">ApexBank Global Checking Account (**** 1234)</p>
        
        <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-slate-500">Available Balance</h2>
              <button 
                onClick={toggleBalanceVisibility} 
                className="text-slate-400 hover:text-slate-600 transition-colors" 
                aria-label="Toggle balance visibility"
              >
                {isBalanceVisible ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
              </button>
            </div>
            <p className="text-4xl font-bold text-slate-800 mt-2 tracking-wider">
              {isBalanceVisible ? accountBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$ ********'}
            </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 flex items-center space-x-4">
            <button
              disabled
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-200 text-slate-500 rounded-lg cursor-not-allowed opacity-70"
            >
              <DepositIcon className="w-5 h-5" />
              <div className="text-left">
                <span className="font-semibold">Deposit Funds</span>
                <span className="block text-xs">Coming Soon</span>
              </div>
            </button>
            <button
              disabled
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-200 text-slate-500 rounded-lg cursor-not-allowed opacity-70"
            >
              <WithdrawIcon className="w-5 h-5" />
               <div className="text-left">
                <span className="font-semibold">Withdraw Funds</span>
                <span className="block text-xs">Coming Soon</span>
              </div>
            </button>
        </div>
      </div>

      <CurrencyConverter />

      <div className="bg-white shadow-md rounded-lg">
        <button
          onClick={() => setIsRatesVisible(!isRatesVisible)}
          className="w-full text-left p-6 flex justify-between items-center hover:bg-slate-50 transition-colors rounded-lg"
          aria-expanded={isRatesVisible}
        >
          <h2 className="text-xl font-bold text-slate-800">Supported Currencies & Rates</h2>
          <ChevronDownIcon className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${isRatesVisible ? 'rotate-180' : ''}`} />
        </button>
        {isRatesVisible && (
          <div className="p-6 pt-0">
             <div className="border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600 mb-4">
                Live exchange rates used for your transfers. Rates are based against 1 USD.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                    <tr>
                      <th scope="col" className="py-3 px-6">Country</th>
                      <th scope="col" className="py-3 px-6">Currency</th>
                      <th scope="col" className="py-3 px-6">Exchange Rate (1 USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SUPPORTED_COUNTRIES.map((country: Country) => (
                      <tr key={country.code} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="py-4 px-6 font-medium text-slate-800">{country.name}</td>
                        <td className="py-4 px-6 text-slate-600">{country.currency}</td>
                        <td className="py-4 px-6 text-slate-800 font-mono">
                          {EXCHANGE_RATES[country.currency].toLocaleString('en-US', { style: 'currency', currency: country.currency, minimumFractionDigits: 4 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Admin Actions (Demo)</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4">Use these controls to simulate server-side events.</p>
          <button
            onClick={handleSendWelcomePush}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600"
          >
            Send Welcome Push to New Users
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Recent Transactions</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                    <tr>
                        <th scope="col" className="py-3 px-6">Recipient</th>
                        <th scope="col" className="py-3 px-6">Amount</th>
                        <th scope="col" className="py-3 px-6">Status</th>
                        <th scope="col" className="py-3 px-6">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => <TransactionRow key={tx.id} transaction={tx} />)}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
