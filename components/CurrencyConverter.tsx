import React, { useState, useMemo } from 'react';
import { SUPPORTED_COUNTRIES, EXCHANGE_RATES, CURRENCY_TO_COUNTRY_CODE } from '../constants';
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
    <div className="bg-slate-200 rounded-2xl shadow-digital">
      <div className="p-6 border-b border-slate-300">
        <h2 className="text-xl font-bold text-slate-800">Quick Currency Converter</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 items-end gap-4">
            {/* From Input */}
            <div className="md:col-span-2">
                <label htmlFor="from-amount" className="block text-sm font-medium text-slate-700 mb-1">From</label>
                <div className="flex items-center rounded-md shadow-digital-inset bg-slate-200">
                    <div className="p-3 border-r border-slate-300">
                        <img 
                            key={fromCurrency} 
                            src={`https://flagcdn.com/w40/${CURRENCY_TO_COUNTRY_CODE[fromCurrency]?.toLowerCase()}.png`} 
                            alt={`${fromCurrency} flag`}
                            className="w-5 h-auto animate-flag-pop"
                        />
                    </div>
                    <select 
                        id="from-currency" 
                        value={fromCurrency} 
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="p-3 border-0 focus:ring-0 z-10 bg-transparent font-semibold"
                        aria-label="From currency"
                    >
                        {uniqueCurrencies.map(c => <option key={c.currency} value={c.currency}>{c.currency}</option>)}
                    </select>
                    <input 
                        type="number" 
                        id="from-amount" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="block w-full border-0 p-3 rounded-r-md bg-transparent text-right font-mono text-lg"
                        placeholder="0.00"
                    />
                </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
                <button 
                    onClick={handleSwapCurrencies}
                    className="p-3 rounded-full text-slate-500 transition-shadow shadow-digital active:shadow-digital-inset"
                    aria-label="Swap currencies"
                >
                    <ArrowsRightLeftIcon className="w-5 h-5" />
                </button>
            </div>

            {/* To Input (Result) */}
            <div className="md:col-span-2">
                <label htmlFor="to-amount" className="block text-sm font-medium text-slate-700 mb-1">To</label>
                 <div className="flex items-center rounded-md shadow-digital-inset bg-slate-200">
                    <div className="p-3 border-r border-slate-300">
                        <img 
                            key={toCurrency}
                            src={`https://flagcdn.com/w40/${CURRENCY_TO_COUNTRY_CODE[toCurrency]?.toLowerCase()}.png`} 
                            alt={`${toCurrency} flag`}
                            className="w-5 h-auto animate-flag-pop"
                        />
                    </div>
                    <select 
                        id="to-currency" 
                        value={toCurrency} 
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="p-3 border-0 focus:ring-0 z-10 bg-transparent font-semibold"
                        aria-label="To currency"
                    >
                        {uniqueCurrencies.map(c => <option key={c.currency} value={c.currency}>{c.currency}</option>)}
                    </select>
                    <input 
                        type="text" 
                        id="to-amount" 
                        value={convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        readOnly
                        className="block w-full p-3 border-0 rounded-r-md bg-transparent text-right font-mono text-lg text-slate-800 font-semibold focus:outline-none"
                        aria-label="Converted amount"
                    />
                </div>
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-300 text-center">
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