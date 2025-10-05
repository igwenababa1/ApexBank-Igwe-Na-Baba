import React, { useState, useEffect } from 'react';
import { Account, AccountType, Transaction, VerificationLevel } from '../types';
import { getAccountPerks } from '../services/geminiService';
import { SpinnerIcon, InfoIcon, ShieldCheckIcon, CreditCardIcon, PiggyBankIcon, BuildingOfficeIcon, DepositIcon, CheckCircleIcon, PencilIcon, getBankIcon } from './Icons';

interface AccountsProps {
    accounts: Account[];
    transactions: Transaction[];
    verificationLevel: VerificationLevel;
    onUpdateAccountNickname: (accountId: string, nickname: string) => void;
}

const AccountPerks: React.FC<{ accountType: AccountType, verificationLevel: VerificationLevel }> = ({ accountType, verificationLevel }) => {
    const [perks, setPerks] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchPerks = async () => {
            setIsLoading(true);
            const { perks, isError } = await getAccountPerks(accountType, verificationLevel);
            if (isError) {
                setIsError(true);
            } else {
                setPerks(perks);
            }
            setIsLoading(false);
        };
        fetchPerks();
    }, [accountType, verificationLevel]);

    return (
        <div className="bg-slate-200 p-6 rounded-2xl shadow-digital">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Advanced Security Perks</h3>
            {isLoading ? (
                <div className="flex justify-center items-center"><SpinnerIcon className="w-6 h-6 text-primary" /></div>
            ) : isError ? (
                <div className="text-yellow-700 text-sm">Could not load perks.</div>
            ) : (
                <ul className="space-y-3">
                    {perks.map((perk, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <ShieldCheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-700">{perk}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isCredit = transaction.type === 'credit';
    const BankLogo = getBankIcon(transaction.recipient.bankName);
    
    return (
        <tr className="border-b border-slate-300 last:border-b-0">
            <td className="p-4">{transaction.statusTimestamps.Submitted.toLocaleDateString()}</td>
            <td className="p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-digital-inset">
                        {isCredit ? <DepositIcon className="w-6 h-6 text-slate-500"/> : <BankLogo className="w-6 h-6"/>}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800">{isCredit ? 'Deposit' : transaction.recipient.fullName}</p>
                        <p className="text-xs text-slate-500">{transaction.description}</p>
                    </div>
                </div>
            </td>
            <td className={`p-4 font-mono text-right ${isCredit ? 'text-green-600' : 'text-slate-800'}`}>
                {isCredit ? '+' : '-'}{transaction.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </td>
        </tr>
    );
};


export const Accounts: React.FC<AccountsProps> = ({ accounts, transactions, verificationLevel, onUpdateAccountNickname }) => {
    const [activeTab, setActiveTab] = useState<string>(accounts[0]?.id || '');
    const [isEditing, setIsEditing] = useState(false);
    const [editingNickname, setEditingNickname] = useState('');

    useEffect(() => {
        if (!activeTab && accounts.length > 0) {
            setActiveTab(accounts[0].id);
        }
    }, [accounts, activeTab]);
    
    useEffect(() => {
        // When the active tab changes, exit editing mode
        setIsEditing(false);
    }, [activeTab]);

    const activeAccount = accounts.find(acc => acc.id === activeTab);
    const accountTransactions = transactions.filter(tx => tx.accountId === activeTab);

    const handleEditClick = () => {
        if (!activeAccount) return;
        setEditingNickname(activeAccount.nickname || '');
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        if (!activeAccount || !editingNickname.trim()) return;
        onUpdateAccountNickname(activeAccount.id, editingNickname.trim());
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const getIcon = (type: AccountType) => {
        switch(type) {
            case AccountType.CHECKING: return <CreditCardIcon className="w-5 h-5"/>;
            case AccountType.SAVINGS: return <PiggyBankIcon className="w-5 h-5"/>;
            case AccountType.BUSINESS: return <BuildingOfficeIcon className="w-5 h-5"/>;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">My Accounts</h2>
                <p className="text-sm text-slate-500 mt-1">View details, transactions, and features for each of your accounts.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                     <div className="bg-slate-200 rounded-2xl shadow-digital p-4 space-y-2">
                        {accounts.map(acc => (
                            <button 
                                key={acc.id} 
                                onClick={() => setActiveTab(acc.id)}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${activeTab === acc.id ? 'shadow-digital-inset' : 'shadow-digital active:shadow-digital-inset'}`}
                            >
                                <div className={`p-2 rounded-md ${activeTab === acc.id ? 'bg-primary text-white' : 'bg-slate-300 text-slate-600'}`}>
                                    {getIcon(acc.type)}
                                </div>
                                <div>
                                    <p className={`font-bold ${activeTab === acc.id ? 'text-primary' : 'text-slate-800'}`}>{acc.nickname || acc.type}</p>
                                    <p className="text-xs text-slate-500">{acc.accountNumber}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2">
                    {activeAccount ? (
                        <div className="space-y-8">
                            <div className="bg-slate-200 rounded-2xl shadow-digital p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        {isEditing ? (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">Edit Nickname</label>
                                                <input
                                                    type="text"
                                                    value={editingNickname}
                                                    onChange={(e) => setEditingNickname(e.target.value)}
                                                    className="mt-1 text-xl font-bold text-slate-800 bg-slate-200 p-2 rounded-md shadow-digital-inset w-full"
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-bold text-slate-800">{activeAccount.nickname || activeAccount.type}</h3>
                                                <button onClick={handleEditClick} className="text-slate-500 hover:text-primary p-1 rounded-full transition-colors" aria-label="Edit nickname">
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-sm text-slate-500">{!isEditing && (activeAccount.nickname ? activeAccount.type : '')}</p>
                                        <p className="text-sm text-slate-500 font-mono mt-1">{activeAccount.accountNumber}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        {isEditing ? (
                                            <div className="flex items-center gap-2 mt-4">
                                                <button onClick={handleSaveClick} className="px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-lg shadow-md">Save</button>
                                                <button onClick={handleCancelClick} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg shadow-digital">Cancel</button>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm text-slate-500">Available Balance</p>
                                                <p className="text-3xl font-bold text-slate-800">{activeAccount.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <AccountPerks accountType={activeAccount.type} verificationLevel={verificationLevel} />

                            <div className="bg-slate-200 rounded-2xl shadow-digital">
                                <div className="p-6 border-b border-slate-300">
                                    <h3 className="text-xl font-bold text-slate-800">Transaction History</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="text-xs text-slate-500 uppercase">
                                            <tr>
                                                <th className="p-4 text-left">Date</th>
                                                <th className="p-4 text-left">Description</th>
                                                <th className="p-4 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accountTransactions.length > 0 ? accountTransactions.map(tx => (
                                                <TransactionRow key={tx.id} transaction={tx} />
                                            )) : (
                                                <tr><td colSpan={3} className="text-center p-8 text-slate-500">No transactions for this account yet.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Select an account to view details.</p>
                    )}
                </div>
            </div>
        </div>
    );
};