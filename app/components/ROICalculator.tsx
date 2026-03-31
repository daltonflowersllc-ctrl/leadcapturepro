'use client';

import { useState } from 'react';
import Link from 'next/link';

const PRO_COST_MONTHLY = 149;
const PRO_COST_ANNUAL = PRO_COST_MONTHLY * 12;

export default function ROICalculator() {
  const [missedCalls, setMissedCalls] = useState(5);
  const [avgJobValue, setAvgJobValue] = useState(500);

  const monthlyLost = Math.round(missedCalls * 4 * avgJobValue);
  const annualLost = monthlyLost * 12;
  const annualROI = annualLost - PRO_COST_ANNUAL;

  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">ROI Calculator</p>
          <h2 className="font-display text-4xl md:text-5xl text-white">How Much Are You Losing?</h2>
          <p className="text-slate-400 mt-4 text-lg">See exactly what missed calls are costing you every month.</p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="space-y-8 mb-10">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white font-medium">Missed calls per week</label>
                <span className="text-2xl font-bold text-blue-400">{missedCalls}</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={missedCalls}
                onChange={(e) => setMissedCalls(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white font-medium">Average job value</label>
                <span className="text-2xl font-bold text-blue-400">${avgJobValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={100}
                max={2000}
                step={50}
                value={avgJobValue}
                onChange={(e) => setAvgJobValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>$100</span>
                <span>$2,000</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-red-900/40 to-slate-800 border border-red-800/50 text-center">
              <div className="text-sm text-slate-400 mb-2">Monthly Lost Revenue</div>
              <div className="text-3xl font-bold text-red-400">
                ${monthlyLost.toLocaleString()}
              </div>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-red-900/40 to-slate-800 border border-red-800/50 text-center">
              <div className="text-sm text-slate-400 mb-2">Annual Lost Revenue</div>
              <div className="text-3xl font-bold text-red-400">
                ${annualLost.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-900/40 to-slate-800 border border-blue-500/30 text-center mb-6">
            <div className="text-sm text-slate-400 mb-1">Your ROI with LeadCapture Pro</div>
            <div className="text-4xl font-bold text-green-400 mb-1">
              ${annualROI.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm">recovered per year after $149/mo cost</div>
          </div>

          <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center mb-8">
            <p className="text-blue-300 font-semibold text-lg">
              LeadCapture Pro pays for itself by recovering just{' '}
              <span className="text-white">1 call per month</span>
            </p>
            <p className="text-slate-400 mt-1 text-sm">
              You&apos;re missing {Math.round(missedCalls * 4.33)} calls per month — recovering even one covers your entire subscription.
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/subscribe"
              className="inline-block bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              Start Free Trial →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
