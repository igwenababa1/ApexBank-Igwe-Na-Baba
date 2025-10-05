import React from 'react';
import { AppleCardDetails, AppleCardTransaction } from '../types';
import { AppleIcon, UberIcon, StarbucksIcon, ShoppingBagIcon } from './Icons';

interface AppleCardManagerProps {
    card: AppleCardDetails;
    transactions: AppleCardTransaction[];
}

const VendorIcon: React.FC<{ vendor: string, className?: string }> = ({ vendor, className }) => {
    const lowerVendor = vendor.toLowerCase();
    if (lowerVendor.includes('apple')) return <AppleIcon className={className} />;
    if (lowerVendor.includes('uber')) return <UberIcon className={className} />;
    if (lowerVendor.includes('starbucks')) return <StarbucksIcon className={className} />;
    return <ShoppingBagIcon className={className} />;
};

export const AppleCardManager: React.FC<AppleCardManagerProps> = ({ card, transactions }) => {
    const balancePercentage = (card.balance / card.creditLimit) * 100;

    return (
        <div className="bg-slate-200 rounded-2xl shadow-digital p-6 space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Apple Card & Vendors</h3>

            {/* Card Visual */}
            <div className="relative w-full p-6 rounded-2xl text-black shadow-lg bg-gradient-to-br from-gray-200 to-white overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/30 rounded-full blur-xl"></div>
                <div className="flex justify-between items-start mb-12">
                    <AppleIcon className="w-8 h-8"/>
                    <p className="font-semibold text-lg">Titanium Card</p>
                </div>
                <p className="font-mono text-2xl tracking-widest">•••• •••• •••• {card.lastFour}</p>
                <p className="mt-2 text-sm font-medium">Eleanor Vance</p>
            </div>

            {/* Financial Summary */}
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-sm font-medium text-slate-700">Current Balance</span>
                        <span className="text-2xl font-bold text-slate-800 font-mono">
                            {card.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 shadow-digital-inset">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${balancePercentage}%` }}></div>
                    </div>
                     <div className="flex justify-between items-end text-xs text-slate-500 mt-1">
                        <span>Available: {card.availableCredit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                        <span>Limit: {card.creditLimit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="w-full py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-md hover:shadow-lg">Make a Payment</button>
                    <button className="w-full py-2 text-sm font-semibold text-primary bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset">View Statements</button>
                </div>
            </div>

            {/* Transaction List */}
            <div>
                <h4 className="font-semibold text-slate-700 mb-2">Recent Transactions</h4>
                <div className="space-y-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-200 rounded-lg shadow-digital-inset">
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 shadow-digital text-slate-600">
                                    <VendorIcon vendor={tx.vendor} className="w-5 h-5"/>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-slate-800">{tx.vendor}</p>
                                    <p className="text-xs text-slate-500">{tx.date.toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className="font-mono text-sm font-semibold text-slate-800">
                                -{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};