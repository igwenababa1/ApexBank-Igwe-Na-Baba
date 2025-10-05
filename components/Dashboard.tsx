import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Transaction, TransactionStatus, Account, AccountType, Recipient, TravelPlan, TravelPlanStatus } from '../types';
import { CheckCircleIcon, ClockIcon, EyeIcon, EyeSlashIcon, VerifiedBadgeIcon, DepositIcon, WithdrawIcon, ChevronLeftIcon, ChevronRightIcon, getBankIcon, ChartBarIcon, TrendingUpIcon, GlobeAmericasIcon } from './Icons';
import { CurrencyConverter } from './CurrencyConverter';
import { FinancialNews } from './FinancialNews';
import { QuickTransfer } from './QuickTransfer';

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  setActiveView: (view: any) => void;
  recipients: Recipient[];
  createTransaction: (transaction: Omit<Transaction, 'id' | 'status' | 'estimatedArrival' | 'statusTimestamps' | 'type'>) => Transaction | null;
  cryptoPortfolioValue: number;
  travelPlans: TravelPlan[];
}

const ActiveTravelNotice: React.FC<{ plans: TravelPlan[] }> = ({ plans }) => {
    if (plans.length === 0) return null;

    return (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg shadow-digital" role="alert">
            <div className="flex items-center">
                <GlobeAmericasIcon className="w-6 h-6 mr-3 flex-shrink-0" />
                <div>
                    <p className="font-bold">Travel Mode is Active</p>
                    <p className="text-sm">
                        You have {plans.length} active travel plan{plans.length > 1 ? 's' : ''}. 
                        Your card services are enabled for: {plans.map(p => p.country.name).join(', ')}.
                    </p>
                </div>
            </div>
        </div>
    );
};


const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isCompleted = transaction.status === TransactionStatus.FUNDS_ARRIVED;
  const statusIcon = isCompleted ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <ClockIcon className="w-5 h-5 text-yellow-500" />;
  const statusColor = isCompleted ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';
  const isCredit = transaction.type === 'credit';
  const BankLogo = getBankIcon(transaction.recipient.bankName);

  return (
    <tr className="border-b border-slate-300 last:border-b-0">
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-digital-inset">
                {isCredit ? <DepositIcon className="w-6 h-6 text-slate-500"/> : <BankLogo className="w-6 h-6"/>}
            </div>
            <div>
                <p className="font-semibold text-slate-800">{isCredit ? 'Deposit' : transaction.recipient.fullName}</p>
                <p className="text-sm text-slate-500">{isCredit ? transaction.description : transaction.recipient.bankName}</p>
            </div>
        </div>
      </td>
      <td className={`py-4 px-6 font-mono ${isCredit ? 'text-green-600' : 'text-slate-600'}`}>
        {isCredit ? '+' : '-'} {transaction.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
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

const accountImages: { [key in AccountType]: string } = {
    [AccountType.CHECKING]: 'https://images.unsplash.com/photo-1554224155-8d04421cd6e2?q=80&w=2072&auto=format&fit=crop',
    [AccountType.SAVINGS]: 'https://images.unsplash.com/photo-1601597111158-2f8024208a96?q=80&w=2070&auto=format&fit=crop',
    [AccountType.BUSINESS]: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
};

const AccountCarouselCard: React.FC<{ account: Account; isBalanceVisible: boolean; onViewDetails: () => void }> = ({ account, isBalanceVisible, onViewDetails }) => {
    return (
        <div className="relative w-full rounded-2xl shadow-lg overflow-hidden text-white" style={{ height: '220px' }}>
            <img src={accountImages[account.type]} alt={account.type} className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 p-6 flex flex-col h-full">
                <div>
                    <h4 className="font-bold text-xl">{account.nickname || account.type}</h4>
                    {account.nickname && <p className="text-sm opacity-80 -mt-1">{account.type}</p>}
                    <p className="text-sm font-mono opacity-80">{account.accountNumber}</p>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                    <p className="text-sm opacity-80">Available Balance</p>
                    <p className="text-4xl font-bold tracking-wider" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}>
                        {isBalanceVisible ? account.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$ ••••••••'}
                    </p>
                </div>
                <button onClick={onViewDetails} className="self-start mt-auto text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors">
                    View Account Details &rarr;
                </button>
            </div>
        </div>
    );
};


export const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, setActiveView, recipients, createTransaction, cryptoPortfolioValue, travelPlans }) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalNetWorth = totalBalance + cryptoPortfolioValue;
  const activeTravelPlans = travelPlans.filter(p => p.status === TravelPlanStatus.ACTIVE);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };
  
  const handlePrev = useCallback(() => {
    setCurrentAccountIndex((prevIndex) => (prevIndex === 0 ? accounts.length - 1 : prevIndex - 1));
  }, [accounts.length]);

  const handleNext = useCallback(() => {
    setCurrentAccountIndex((prevIndex) => (prevIndex === accounts.length - 1 ? 0 : prevIndex + 1));
  }, [accounts.length]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (document.activeElement === carousel) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNext();
            }
        }
    };

    carousel.addEventListener('keydown', handleKeyDown);
    return () => {
        carousel.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePrev, handleNext]);

  return (
    <div className="space-y-8">
      <ActiveTravelNotice plans={activeTravelPlans} />

      <div className="bg-slate-200 rounded-2xl p-6 shadow-digital">
        <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-bold text-slate-800">Eleanor Vance</h3>
                  <VerifiedBadgeIcon className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-sm text-slate-500 mt-1">Welcome back to your financial dashboard.</p>
            </div>
            <div className="text-right">
                <div className="flex items-center space-x-2 justify-end">
                  <h2 className="text-lg font-medium text-slate-500">Total Net Worth</h2>
                  <button 
                    onClick={toggleBalanceVisibility} 
                    className="text-slate-400 hover:text-slate-600 transition-colors" 
                    aria-label="Toggle balance visibility"
                  >
                    {isBalanceVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                 <p className="text-3xl font-bold text-slate-800 mt-1 tracking-wider">
                  {isBalanceVisible ? totalNetWorth.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$ ********'}
                </p>
            </div>
        </div>
        
        {/* Account Carousel */}
        <div 
            ref={carouselRef}
            tabIndex={0}
            className="relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-200 rounded-lg"
            aria-label="Accounts carousel, use left and right arrow keys to navigate"
        >
            <div className="overflow-hidden rounded-2xl">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentAccountIndex * 100}%)` }}>
                    {accounts.map(acc => (
                         <div key={acc.id} className="w-full flex-shrink-0">
                            <AccountCarouselCard 
                                account={acc} 
                                isBalanceVisible={isBalanceVisible} 
                                onViewDetails={() => setActiveView('accounts')} 
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={handlePrev} 
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors z-20"
                aria-label="Previous account"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button 
                onClick={handleNext} 
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors z-20"
                aria-label="Next account"
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>
            
             <div className="flex justify-center space-x-2 mt-4">
                {accounts.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentAccountIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentAccountIndex === index ? 'bg-primary scale-125' : 'bg-slate-300 hover:bg-slate-400'}`}
                        aria-label={`Go to account ${index + 1}`}
                    />
                ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          <QuickTransfer
            accounts={accounts}
            recipients={recipients}
            createTransaction={createTransaction}
          />
          <div className="bg-slate-200 rounded-2xl shadow-digital">
            <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-300">Recent Transactions</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase">
                        <tr>
                            <th scope="col" className="py-3 px-6">Details</th>
                            <th scope="col" className="py-3 px-6">Amount</th>
                            <th scope="col" className="py-3 px-6">Status</th>
                            <th scope="col" className="py-3 px-6">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.slice(0, 5).map(tx => <TransactionRow key={tx.id} transaction={tx} />)}
                    </tbody>
                </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-200 rounded-2xl shadow-digital p-6">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-slate-200 rounded-md shadow-digital">
                        <ChartBarIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Crypto Portfolio</h3>
                </div>
                <p className="text-sm text-slate-500">Total value of your digital assets.</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                    {isBalanceVisible ? cryptoPortfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$ ********'}
                </p>
                 <div className="text-sm font-semibold flex items-center text-green-600 mt-1">
                    <TrendingUpIcon className="w-4 h-4 mr-1"/>
                    <span>+5.2% (24h)</span>
                </div>
                <button 
                    onClick={() => setActiveView('crypto')}
                    className="w-full mt-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    Go to Trading
                </button>
            </div>
            <CurrencyConverter />
        </div>
      </div>

      <FinancialNews />
    </div>
  );
};
