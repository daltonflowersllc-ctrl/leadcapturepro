'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ROICalculator() {
  const [missedCalls, setMissedCalls] = useState(5);
  const [avgJobValue, setAvgJobValue] = useState(500);

  const monthlyLost = missedCalls * 4 * avgJobValue;
  const annualLost = monthlyLost * 12;
  const annualROI = annualLost - (149 * 12);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">Calculate Your Lost Revenue</h2>
      
      <div className="space-y-8 mb-12">
        <div>
          <div className="flex justify-between mb-4">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Missed Calls Per Week</label>
            <span className="text-xl font-bold text-blue-400">{missedCalls}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={missedCalls} 
            onChange={(e) => setMissedCalls(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between mb-4">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Average Job Value</label>
            <span className="text-xl font-bold text-blue-400">${avgJobValue}</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="2000" 
            step="50"
            value={avgJobValue} 
            onChange={(e) => setAvgJobValue(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl min-w-0 overflow-hidden">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Monthly Lost</p>
          <p className="text-xl sm:text-2xl font-bold text-white truncate">${monthlyLost.toLocaleString()}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl min-w-0 overflow-hidden">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Annual Lost</p>
          <p className="text-xl sm:text-2xl font-bold text-white truncate">${annualLost.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-2xl mb-8 text-center">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Potential Annual ROI</p>
        <p className="text-4xl font-black text-emerald-400">${annualROI.toLocaleString()}</p>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl mb-8 text-center">
        <p className="text-blue-400 text-sm font-medium">
          LeadCapture Pro pays for itself by recovering just 1 call per month
        </p>
      </div>

      <Link href="/subscribe" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-xl font-bold transition shadow-lg shadow-blue-900/20">
        Start Free Trial
      </Link>
      <p className="text-xs text-muted-foreground mt-1 text-center text-slate-500">Credit card required. Billed on day 8.</p>
    </div>
  );
}
