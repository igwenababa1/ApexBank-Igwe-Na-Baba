
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionStatus } from '../types';
import { ChevronDownIcon, CheckCircleIcon, ClockIcon } from './Icons';

interface ActivityLogProps {
  transactions: Transaction[];
  accountBalance: number;
}

const ActivityRow: React.FC<{ transaction: Transaction; runningBalance: number }> = ({ transaction, runningBalance }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalDebited = transaction.sendAmount + transaction.fee;

  return (
    <>
      <tr className="border-b border-slate-200 cursor-pointer hover:bg-slate-50" onClick={() => setIsExpanded(!isExpanded)}>
        <td className="py-4 px-6">
          <p className="font-medium text-slate-800">{transaction.statusTimestamps[TransactionStatus.SUBMITTED].toLocaleDateString()}</p>
        </td>
        <td className="py-4 px-6">
          <p className="font-semibold text-slate-800">{transaction.description}</p>
          <p className="text-sm text-slate-500">
            To: {transaction.recipient.fullName} ({transaction.recipient.bankName}, {transaction.recipient.country.name})
          </p>
        </td>
        <td className="py-4 px-6 text-red-600 font-mono">
          - {totalDebited.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </td>
        <td className="py-4 px-6 text-slate-700 font-mono">
          {runningBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </td>
        <td className="py-4 px-6 text-slate-400">
          <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-slate-50">
          <td colSpan={5} className="p-4">
            <div className="p-4 bg-white rounded-md border border-slate-200">
              <h4 className="font-semibold text-sm mb-3">Transaction Details</h4>
              <ul className="space-y-2 text-sm">
                {Object.entries(transaction.statusTimestamps)
                    .sort(([, dateA], [, dateB]) => dateA.getTime() - dateB.getTime())
                    .map(([status, timestamp]) => (
                    <li key={status} className="flex items-center space-x-3">
                      {status === TransactionStatus.FUNDS_ARRIVED || transaction.status === TransactionStatus.FUNDS_ARRIVED ?
                        <CheckCircleIcon className="w-5 h-5 text-green-500" /> :
                        <ClockIcon className="w-5 h-5 text-slate-400" />
                      }
                      <span className="font-medium text-slate-700 w-40">{status}:</span>
                      <span className="text-slate-500">{timestamp.toLocaleString()}</span>
                    </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export const ActivityLog: React.FC<ActivityLogProps> = ({ transactions, accountBalance }) => {
  const transactionsWithBalance = useMemo(() => {
    const sortedTxns = [...transactions].sort((a, b) => 
      a.statusTimestamps[TransactionStatus.SUBMITTED].getTime() - b.statusTimestamps[TransactionStatus.SUBMITTED].getTime()
    );
    
    const totalDebits = sortedTxns.reduce((sum, tx) => sum + tx.sendAmount + tx.fee, 0);
    let currentBalance = accountBalance + totalDebits;
    
    return sortedTxns.map(tx => {
      const balanceBefore = currentBalance;
      currentBalance -= (tx.sendAmount + tx.fee);
      return { ...tx, runningBalance: balanceBefore };
    }).reverse();
  }, [transactions, accountBalance]);

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Transaction Activity</h2>
        <p className="text-sm text-slate-500 mt-1">A complete history of your account transactions.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
            <tr>
              <th scope="col" className="py-3 px-6">Date</th>
              <th scope="col" className="py-3 px-6">Description</th>
              <th scope="col" className="py-3 px-6">Amount</th>
              <th scope="col" className="py-3 px-6">Balance</th>
              <th scope="col" className="py-3 px-6 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {transactionsWithBalance.map(tx => (
              <ActivityRow key={tx.id} transaction={tx} runningBalance={tx.runningBalance} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
