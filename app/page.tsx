'use client';

import { useState } from 'react';
import Link from 'next/link';
import ROICalculator from './components/ROICalculator';

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">LeadCapture<span className="text-blue-500">Pro</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition">How It Works</Link>
              <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition">Features</Link>
              <Link href="#ai-features" className="text-sm font-medium text-slate-400 hover:text-white transition">AI Features</Link>
              <Link href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition">Pricing</Link>
              <Link href="/setup" className="text-sm font-medium text-slate-400 hover:text-white transition">Setup Guide</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition">Log in</Link>
              <Link href="/subscribe" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition shadow-lg shadow-blue-900/20">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8 animate-pulse">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-blue-400 text-xs font-bold tracking-wider uppercase">🤖 AI-Powered Lead Capture — Now Live</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
            Never Lose Another Lead to a <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">Missed Call</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Our AI answers your missed calls in 30 seconds, qualifies the lead, and books the job while you're busy working. Stop leaving money on the table.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/subscribe" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition shadow-xl shadow-blue-900/40">
              Start 7-Day Free Trial
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 px-8 py-4 rounded-xl text-lg font-bold transition">
              See How It Works
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 text-sm font-medium">
            <span className="flex items-center gap-2">✅ No credit card required</span>
            <span className="flex items-center gap-2">✅ Cancel before day 8</span>
            <span className="flex items-center gap-2">✅ 256-bit SSL Secure</span>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="border-y border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10,000+</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Leads Captured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Response Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">$2.5M+</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Revenue Recovered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">30 sec</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Avg Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <ROICalculator />
        </div>
      </section>

      {/* AI Features */}
      <section id="ai-features" className="py-24 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">Powered by AI</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-4">The Only Missed Call Tool with Built-In AI</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { title: 'AI Lead Scoring', badge: 'Pro', badgeColor: 'bg-blue-500/10 text-blue-400', desc: 'Instantly identify high-value emergency jobs vs tire kickers.' },
              { title: 'AI-Personalized SMS', badge: 'All Plans', badgeColor: 'bg-emerald-500/10 text-emerald-400', desc: 'Each response is custom-tailored to the caller\'s specific needs.' },
              { title: 'AI Call Scripts', badge: 'Pro', badgeColor: 'bg-blue-500/10 text-blue-400', desc: 'Get perfect closing scripts for every lead before you call them back.' },
              { title: 'Voicemail Transcription', badge: 'Pro', badgeColor: 'bg-blue-500/10 text-blue-400', desc: 'Read voicemails instantly in your dashboard without listening.' },
              { title: 'Lead Intelligence', badge: 'Pro', badgeColor: 'bg-blue-500/10 text-blue-400', desc: 'Deep insights into lead urgency, service type, and budget.' },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition group">
                <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-4 ${feature.badgeColor}`}>
                  {feature.badge}
                </div>
                <h3 className="text-white font-bold mb-3 group-hover:text-blue-400 transition">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '1', title: 'Missed Call Detected', emoji: '📞', desc: 'When you can\'t answer, your phone forwards the call to your LeadCapture number.' },
              { step: '2', title: 'AI Responds & Qualifies', emoji: '🤖', desc: 'Our AI instantly texts the caller, asks what they need, and scores the lead.' },
              { step: '3', title: 'You Close the Job', emoji: '💰', desc: 'You get a notification with the full lead details. Call them back and book it!' },
            ].map((item, i) => (
              <div key={i} className="relative p-8 bg-slate-900/50 rounded-3xl border border-slate-800">
                <div className="absolute top-4 right-8 text-8xl font-black text-slate-800/20 -z-10">{item.step}</div>
                <div className="text-4xl mb-6">{item.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-4">Step {item.step}: {item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16">How LeadCapture Pro Compares</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-6 text-slate-400 font-bold uppercase text-xs tracking-widest">Feature</th>
                  <th className="p-6 bg-blue-600/10 text-blue-400 font-bold border-x border-t border-blue-500/20 rounded-t-2xl">LeadCapture Pro</th>
                  <th className="p-6 text-slate-500 font-bold">Enzak</th>
                  <th className="p-6 text-slate-500 font-bold">GoHighLevel</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  'AI-Powered Responses', 'Lead Scoring', 'AI Call Scripts', 'Voicemail Transcription', 
                  'Mobile PWA App', 'Zapier Integration', 'No Setup Fees', 'Built for Contractors',
                  'Setup in 5 Minutes', 'Proprietary AI Models'
                ].map((feature, i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    <td className="p-6 text-white font-medium">{feature}</td>
                    <td className="p-6 bg-blue-600/5 border-x border-blue-500/10 text-blue-400">✅</td>
                    <td className="p-6 text-slate-600">❌</td>
                    <td className="p-6 text-slate-600">❌</td>
                  </tr>
                ))}
                <tr>
                  <td className="p-6 text-white font-bold">Pricing</td>
                  <td className="p-6 bg-blue-600/10 border-x border-b border-blue-500/20 rounded-b-2xl text-blue-400 font-bold">From $149/mo</td>
                  <td className="p-6 text-slate-500">$99/mo + $99 setup</td>
                  <td className="p-6 text-slate-500">$97 - $297/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-slate-500 text-xs mt-8">Note: Comparison based on publicly available feature lists as of March 2025.</p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Simple, Transparent Pricing</h2>
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-14 h-7 bg-slate-800 rounded-full relative p-1 transition"
              >
                <div className={`w-5 h-5 bg-blue-500 rounded-full transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-sm font-bold ${isAnnual ? 'text-white' : 'text-slate-500'}`}>Annual <span className="text-emerald-400 text-[10px] ml-1">SAVE 20%</span></span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <div className="text-4xl font-black text-white mb-6">${isAnnual ? '1490' : '149'}<span className="text-lg text-slate-500 font-medium">/{isAnnual ? 'yr' : 'mo'}</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-400 text-sm">✅ 100 SMS per month</li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">✅ 1 LeadCapture Number</li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">✅ AI-Personalized SMS</li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">✅ Lead Dashboard CRM</li>
              </ul>
              <Link href="/signup?plan=starter" className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition text-center">
                Start Free Trial
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-slate-900 border-2 border-blue-600 p-8 rounded-3xl flex flex-col relative scale-105 shadow-2xl shadow-blue-900/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">Most Popular</div>
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <div className="text-4xl font-black text-white mb-6">${isAnnual ? '2490' : '249'}<span className="text-lg text-slate-500 font-medium">/{isAnnual ? 'yr' : 'mo'}</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">✅ 500 SMS per month</li>
                <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">✅ 3 LeadCapture Numbers</li>
                <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">✅ AI Lead Scoring</li>
                <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">✅ AI Call Scripts</li>
                <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">✅ Voicemail Transcription</li>
                <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">✅ Zapier Integration</li>
              </ul>
              <Link href="/signup?plan=pro" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition text-center">
                Start Free Trial
              </Link>
            </div>

            {/* Elite */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">Elite</h3>
                <span className="bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded">Coming Soon</span>
              </div>
              <div className="text-4xl font-black text-white mb-6">${isAnnual ? '3990' : '399'}<span className="text-lg text-slate-500 font-medium">/{isAnnual ? 'yr' : 'mo'}</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-400 text-sm">✅ Unlimited SMS</li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">✅ 5 LeadCapture Numbers</li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">✅ Multi-Team Access</li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">✅ API Access</li>
              </ul>
              <Link href="/signup?plan=elite" className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition text-center">
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-blue-800 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Stop Losing Jobs to Missed Calls</h2>
          <Link href="/subscribe" className="inline-block bg-white text-blue-600 px-10 py-5 rounded-2xl text-xl font-black hover:bg-slate-100 transition shadow-xl">
            Start Your 7-Day Free Trial
          </Link>
          <p className="mt-6 text-blue-100 text-sm font-medium">Credit card required, cancel before day 8 for no charge.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-24 pb-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">LeadCapture<span className="text-blue-500">Pro</span></span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
                AI-powered missed call recovery for home service contractors. Never lose another job to a missed call.
              </p>
              <a href="mailto:support@leadcapturepro.app" className="text-slate-400 hover:text-white transition text-sm">support@leadcapturepro.app</a>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#ai-features" className="hover:text-white transition">AI Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/setup" className="hover:text-white transition">Setup Guide</Link></li>
                <li><Link href="/subscribe" className="hover:text-white transition">Free Trial</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li><Link href="/setup" className="hover:text-white transition">Setup Guide</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact Support</Link></li>
                <li><Link href="/status" className="hover:text-white transition">System Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/tcpa" className="hover:text-white transition">TCPA Compliance</Link></li>
                <li><Link href="/licensing" className="hover:text-white transition">Licensing</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-xs">© 2025 LeadCapture Pro. All rights reserved.</p>
            <p className="text-slate-600 text-xs font-medium italic">Built for contractors who build America</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
