import React, { useState, useMemo } from 'react';
import { SUPPORTED_COUNTRIES, EXCHANGE_RATES } from '../constants';
import { ArrowsRightLeftIcon } from './Icons';

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('GBP');

  const { convertedAmount, exchangeRate } = useMemo(() => {
    const numericAmount = parseFloat(amount) || 0;
    const fromRate = EXCHANGE_RATES[fromCurrency];
    const toRate = EXCHANGE_RATES[toCurrency];

    if (!fromRate || !toRate) {
      return { convertedAmount: 0, exchangeRate: 0 };
    }

    // Convert the amount to the base currency (USD) first, then to the target currency.
    const amountInBase = numericAmount / fromRate;
    const finalAmount = amountInBase * toRate;
    
    // Calculate the direct exchange rate for 1 unit of the 'from' currency
    const directRate = (1 / fromRate) * toRate;

    return { convertedAmount: finalAmount, exchangeRate: directRate };
  }, [amount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const uniqueCurrencies = [...new Map(SUPPORTED_COUNTRIES.map(item => [item['currency'], item])).values()];

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Quick Currency Converter</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 items-end gap-4">
            {/* From Input */}
            <div className="md:col-span-2">
                <label htmlFor="from-amount" className="block text-sm font-medium text-slate-700 mb-1">From</label>
                <div className="flex">
                    <select 
                        id="from-currency" 
                        value={fromCurrency} 
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="rounded-l-md border-r-0 border-slate-300 shadow-sm focus:border-primary focus:ring-primary z-10 bg-slate-50"
                        aria-label="From currency"
                    >
                        {uniqueCurrencies.map(c => <option key={c.currency} value={c.currency}>{c.currency}</option>)}
                    </select>
                    <input 
                        type="number" 
                        id="from-amount" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="block w-full rounded-r-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary pl-4"
                        placeholder="0.00"
                    />
                </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
                <button 
                    onClick={handleSwapCurrencies}
                    className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                    aria-label="Swap currencies"
                >
                    <ArrowsRightLeftIcon className="w-5 h-5" />
                </button>
            </div>

            {/* To Input (Result) */}
            <div className="md:col-span-2">
                <label htmlFor="to-amount" className="block text-sm font-medium text-slate-700 mb-1">To</label>
                 <div className="flex">
                    <select 
                        id="to-currency" 
                        value={toCurrency} 
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="rounded-l-md border-r-0 border-slate-300 shadow-sm focus:border-primary focus:ring-primary z-10 bg-slate-50"
                        aria-label="To currency"
                    >
                        {uniqueCurrencies.map(c => <option key={c.currency} value={c.currency}>{c.currency}</option>)}
                    </select>
                    <input 
                        type="text" 
                        id="to-amount" 
                        value={convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        readOnly
                        className="block w-full rounded-r-md border-slate-300 shadow-sm bg-slate-50 text-slate-800 font-semibold focus:outline-none pl-4"
                        aria-label="Converted amount"
                    />
                </div>
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200 text-center">
             <p className="text-sm font-semibold text-slate-700">
                1 {fromCurrency} = {exchangeRate.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {toCurrency}
            </p>
            <p className="text-xs text-slate-400 mt-2">
                Live rates are for informational purposes only.
            </p>
        </div>
      </div>
    </div>
  );
};