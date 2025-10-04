

import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, TransactionStatus } from '../types';
import { CheckCircleIcon, ClockIcon, SearchIcon, XCircleIcon } from './Icons';

interface ActivityLogProps {
  transactions: Transaction[];
}

const Highlight: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
    if (!highlight.trim()) {
        return <>{text}</>;
    }
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-yellow-200 text-slate-800 rounded px-1 py-0.5">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </>
    );
};

const TransactionRow: React.FC<{ transaction: Transaction; searchTerm: string }> = ({ transaction, searchTerm }) => {
  const isCompleted = transaction.status === TransactionStatus.FUNDS_ARRIVED;
  const statusIcon = isCompleted ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <ClockIcon className="w-5 h-5 text-yellow-500" />;
  const statusColor = isCompleted ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';
  
  const isCredit = transaction.type === 'credit';
  const amount = isCredit ? transaction.sendAmount : transaction.sendAmount + transaction.fee;


  return (
    <tr className="border-b border-slate-300 last:border-b-0">
      <td className="py-4 px-6 text-sm text-slate-600">
        {transaction.statusTimestamps[TransactionStatus.SUBMITTED].toLocaleDateString()}
      </td>
      <td className="py-4 px-6">
        <p className="font-semibold text-slate-800">
            <Highlight text={isCredit ? 'Deposit' : transaction.recipient.fullName} highlight={searchTerm} />
        </p>
        <p className="text-xs text-slate-500">
            <Highlight text={transaction.description} highlight={searchTerm} />
        </p>
      </td>
      <td className={`py-4 px-6 font-mono text-right ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
        {isCredit ? '+' : '-'} {amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </td>
      <td className="py-4 px-6">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center space-x-1 ${statusColor}`}>
          {statusIcon}
          <span>{transaction.status}</span>
        </span>
      </td>
    </tr>
  );
};

const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const maxPagesToShow = 5;
        const half = Math.floor(maxPagesToShow / 2);
        
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage > 1 + half + 1) pageNumbers.push('...');
            
            let start = Math.max(2, currentPage - half);
            let end = Math.min(totalPages - 1, currentPage + half);

            if (currentPage <= half + 1) {
                end = maxPagesToShow - 1;
            }
            if (currentPage >= totalPages - half) {
                start = totalPages - maxPagesToShow + 2;
            }

            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }

            if (currentPage < totalPages - half - 1) pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };
    
    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex items-center justify-between px-6 py-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-200 rounded-md shadow-digital active:shadow-digital-inset disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            <div className="hidden sm:flex items-center space-x-1">
                {pageNumbers.map((number, index) =>
                    typeof number === 'number' ? (
                        <button
                            key={index}
                            onClick={() => onPageChange(number)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-shadow ${
                                currentPage === number
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-slate-200 text-slate-600 shadow-digital active:shadow-digital-inset'
                            }`}
                        >
                            {number}
                        </button>
                    ) : (
                        <span key={index} className="px-4 py-2 text-sm font-medium text-slate-600">
                            {number}
                        </span>
                    )
                )}
            </div>
             <p className="sm:hidden text-sm text-slate-600">Page {currentPage} of {totalPages}</p>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-200 rounded-md shadow-digital active:shadow-digital-inset disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </nav>
    );
};


export const ActivityLog: React.FC<ActivityLogProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  
  const statusOptions = [
      'all', 
      ...Object.values(TransactionStatus)
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        if (statusFilter === 'all') return true;
        return tx.status === statusFilter;
      })
      .filter(tx => {
        const term = debouncedSearchTerm.toLowerCase();
        if (!term) return true;
        const recipientName = tx.type === 'credit' ? 'deposit' : tx.recipient.fullName.toLowerCase();
        return (
          recipientName.includes(term) ||
          tx.description.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => b.statusTimestamps[TransactionStatus.SUBMITTED].getTime() - a.statusTimestamps[TransactionStatus.SUBMITTED].getTime());
  }, [transactions, debouncedSearchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredTransactions, currentPage, ITEMS_PER_PAGE]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
        setCurrentPage(1);
    }
  }, [filteredTransactions, totalPages, currentPage]);
  
  const isFiltered = debouncedSearchTerm !== '' || statusFilter !== 'all';

  return (
    <div className="bg-slate-200 rounded-2xl shadow-digital">
      <div className="p-6 border-b border-slate-300">
        <h2 className="text-xl font-bold text-slate-800">Transfer History</h2>
        <p className="text-sm text-slate-500 mt-1">Review, search, and filter all your past transactions.</p>
      </div>
      
      <div className="p-6 border-b border-slate-300">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:flex-1 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by recipient or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-200 border-0 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400 p-3 pl-10"
              aria-label="Search transactions"
            />
          </div>
          <div className="w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as TransactionStatus | 'all')}
              className="w-full bg-slate-200 border-0 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400 p-3"
              aria-label="Filter by status"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>
          {isFiltered && (
            <button 
                onClick={handleClearFilters}
                className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-slate-600 bg-slate-200 rounded-md shadow-digital active:shadow-digital-inset hover:text-primary transition-colors"
            >
                <XCircleIcon className="w-5 h-5" />
                <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase">
            <tr>
              <th scope="col" className="py-3 px-6">Date</th>
              <th scope="col" className="py-3 px-6">Details</th>
              <th scope="col" className="py-3 px-6 text-right">Amount</th>
              <th scope="col" className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map(tx => <TransactionRow key={tx.id} transaction={tx} searchTerm={debouncedSearchTerm} />)
            ) : (
                <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-500">
                        <p className="font-semibold">No transactions found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};