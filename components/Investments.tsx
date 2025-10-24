import React from 'react';
import { TrendingUpIcon } from './Icons';

export const Investments: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Investments</h2>
        <p className="text-sm text-slate-500 mt-1">Grow your wealth with our curated investment opportunities (Feature coming soon).</p>
      </div>
      <div className="text-center p-12 bg-slate-200 rounded-2xl shadow-digital-inset">
        <TrendingUpIcon className="w-16 h-16 text-slate-400 mx-auto" />
        <h3 className="mt-4 text-xl font-bold text-slate-600">The Future of Your Wealth is Coming</h3>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">We are building a powerful, intuitive investment platform. Stay tuned for access to stocks, ETFs, and professionally managed portfolios.</p>
      </div>
    </div>
  );
};
