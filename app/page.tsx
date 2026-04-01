import Link from 'next/link';
import ROICalculator from './components/ROICalculator';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">LeadCapture Pro</span>
            </Link>
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
              <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#ai-features" className="hover:text-white transition-colors">AI Features</Link>
              <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/setup" className="hover:text-white transition-colors">Setup Guide</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors">Log in</Link>
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-600/20">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full" />
          </div>
          
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              🤖 AI-Powered Lead Capture — Now Live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
              Never Lose Another Lead to a <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">Missed Call</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              LeadCapture Pro combines missed call detection with AI lead scoring, personalized SMS, voicemail transcription and call scripts — delivering fully qualified leads to your phone in under 30 seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/signup" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2">
                Start 7-Day Free Trial →
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 hover:bg-slate-900 text-white font-bold text-lg transition-all flex items-center justify-center">
                See How It Works
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-xs font-medium text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                💳 Credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Cancel before day 8
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                256-bit SSL
              </span>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="border-y border-white/5 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">10,000+</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Leads Captured</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Response Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">$2.5M+</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Revenue Recovered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">30 sec</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg Response Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <ROICalculator />

        {/* AI Features Section */}
        <section id="ai-features" className="py-24 px-6 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-blue-500 font-bold text-sm uppercase tracking-[0.2em] mb-4">POWERED BY AI</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The Only Missed Call Tool with Built-In AI</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                While competitors send a generic text, our AI scores your leads, writes personalized messages, transcribes voicemails and prepares you with call scripts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-white">🎯 AI Lead Scoring</h3>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">Pro</span>
                </div>
                <p className="text-slate-400 leading-relaxed">Every lead scored Hot/Warm/Cold instantly. Call the right people first.</p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-white">💬 AI-Personalized SMS</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">AI writes a unique text for every missed caller based on your business and time of day.</p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-white">📞 AI Call Scripts</h3>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">Pro</span>
                </div>
                <p className="text-slate-400 leading-relaxed">3 tailored callback scripts generated for each lead. Walk into every call prepared.</p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group lg:col-start-1 lg:translate-x-1/2">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-white">🎙️ Voicemail Transcription</h3>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">Pro</span>
                </div>
                <p className="text-slate-400 leading-relaxed">AI transcribes every voicemail and attaches it to the lead card.</p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group lg:translate-x-1/2">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-white">🧠 Lead Intelligence</h3>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">Pro</span>
                </div>
                <p className="text-slate-400 leading-relaxed">AI explains exactly why each lead scored Hot/Warm/Cold in one sentence.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-slate-400">Capture, qualify, and close leads in 3 simple steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="relative">
                <div className="text-6xl font-black text-blue-500/10 absolute -top-8 -left-4">01</div>
                <h3 className="text-xl font-bold text-white mb-4 relative">You Miss a Call</h3>
                <p className="text-slate-400 leading-relaxed">When you're on a job or driving, LeadCapture Pro detects the missed call instantly. Our AI immediately analyzes the caller's history if available.</p>
              </div>
              <div className="relative">
                <div className="text-6xl font-black text-blue-500/10 absolute -top-8 -left-4">02</div>
                <h3 className="text-xl font-bold text-white mb-4 relative">AI Responds & Qualifies</h3>
                <p className="text-slate-400 leading-relaxed">AI sends a personalized text back within seconds. It asks for details, photos, and scores the lead as Hot, Warm, or Cold based on their response.</p>
              </div>
              <div className="relative">
                <div className="text-6xl font-black text-blue-500/10 absolute -top-8 -left-4">03</div>
                <h3 className="text-xl font-bold text-white mb-4 relative">You Close the Job</h3>
                <p className="text-slate-400 leading-relaxed">Get a notification with the lead's info, AI score, and a custom call script. Call them back prepared and win the job before they call anyone else.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section id="features" className="py-24 px-6 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Scale</h2>
              <p className="text-slate-400">Built for contractors in every industry.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Missed Call Detection", "AI-Personalized SMS", "Smart Lead Form",
                "AI Lead Scoring", "AI Call Scripts", "Lead Dashboard CRM",
                "Voicemail Transcription", "Zapier Integration", "PWA Mobile App"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="mt-1 text-blue-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </div>
                  <span className="text-lg font-medium text-white">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-24 px-6 bg-slate-900/30">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-12">Built for Your Industry</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Tree Service", "Landscaping", "Lawn Care", "Handyman", "Roofing", "Plumbing",
                "Electrical", "HVAC", "House Washing", "Pest Control", "Pool Service", "General Contracting"
              ].map((industry, i) => (
                <span key={i} className="px-6 py-3 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium hover:border-blue-500/50 hover:text-white transition-all cursor-default">
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="py-24 px-6 bg-slate-950">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">How LeadCapture Pro Compares</h2>
              <p className="text-slate-400">The only purpose-built AI tool for home services.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="py-6 px-4 text-slate-400 font-medium">Feature</th>
                    <th className="py-6 px-4 text-blue-400 font-bold">LeadCapture Pro</th>
                    <th className="py-6 px-4 text-slate-400 font-medium">Enzak</th>
                    <th className="py-6 px-4 text-slate-400 font-medium">GoHighLevel</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {[
                    ["Missed call text back", true, true, true],
                    ["AI lead scoring", true, false, false],
                    ["AI personalized SMS", true, false, false],
                    ["AI call scripts", true, false, false],
                    ["Smart lead form with photos", true, false, false],
                    ["Voicemail transcription", true, false, false],
                    ["Built for contractors", true, true, false],
                    ["Mobile PWA app", true, false, false],
                    ["Zapier integration", true, false, true],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-slate-300">{row[0]}</td>
                      <td className="py-4 px-4">{row[1] ? <span className="text-emerald-500">✅</span> : <span className="text-slate-600">❌</span>}</td>
                      <td className="py-4 px-4">{row[2] ? <span className="text-emerald-500">✅</span> : <span className="text-slate-600">❌</span>}</td>
                      <td className="py-4 px-4">{row[3] ? <span className="text-emerald-500">✅</span> : <span className="text-slate-600">❌</span>}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-6 px-4 text-slate-300 font-bold">Price</td>
                    <td className="py-6 px-4 text-blue-400 font-bold">$149/mo</td>
                    <td className="py-6 px-4 text-slate-400">$99/mo + $99 setup</td>
                    <td className="py-6 px-4 text-slate-400">$97-297/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-8 text-sm text-slate-500 leading-relaxed italic">
              GoHighLevel includes basic missed call text back buried inside a complex $97-297/mo platform. Enzak charges $99/mo plus $99 setup fee for text back only — no AI, no lead form, no dashboard, no call scripts. LeadCapture Pro is the only purpose-built AI-powered lead capture tool for home service businesses.
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
              <p className="text-slate-400">Choose the plan that fits your business size.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">$49</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-slate-400">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Missed Call Detection
                  </li>
                  <li className="flex items-center gap-3 text-slate-400">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    AI-Personalized SMS
                  </li>
                  <li className="flex items-center gap-3 text-slate-400">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Lead Dashboard
                  </li>
                </ul>
                <Link href="/signup" className="w-full py-3 rounded-xl border border-slate-800 hover:bg-slate-900 text-white font-bold text-center transition-all">Get Started</Link>
              </div>

              {/* Pro Plan */}
              <div className="p-8 rounded-2xl bg-blue-600 border border-blue-500 flex flex-col relative scale-105 shadow-2xl shadow-blue-600/20">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-blue-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">$149</span>
                  <span className="text-blue-200">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Everything in Starter
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    AI Lead Scoring <span className="px-1.5 py-0.5 rounded bg-white/20 text-[8px] font-bold uppercase">AI</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    AI Call Scripts <span className="px-1.5 py-0.5 rounded bg-white/20 text-[8px] font-bold uppercase">AI</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Voicemail Transcription <span className="px-1.5 py-0.5 rounded bg-white/20 text-[8px] font-bold uppercase">AI</span>
                  </li>
                </ul>
                <Link href="/signup" className="w-full py-4 rounded-xl bg-white text-blue-600 font-bold text-center transition-all shadow-lg">Start Free Trial</Link>
              </div>

              {/* Elite Plan */}
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">Elite</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">$299</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-slate-400">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-3 text-slate-400">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Zapier Integration
                  </li>
                  <li className="flex items-center gap-3 text-slate-400">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Custom API Access
                  </li>
                </ul>
                <Link href="/signup" className="w-full py-3 rounded-xl border border-slate-800 hover:bg-slate-900 text-white font-bold text-center transition-all">Contact Sales</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-6 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Trusted by Hundreds of Contractors</h2>
              <p className="text-slate-400">Real results from real contractors. Names and businesses used with permission.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Mike Peterson", role: "Owner — Peterson Plumbing", city: "Dallas, TX",
                  text: "Switched from Enzak last month. The AI call scripts alone are worth it. I actually know what to say when I call back now. Closed 3 jobs in my first week."
                },
                {
                  name: "Tom Wilson", role: "Owner — Spark Electric", city: "Phoenix, AZ",
                  text: "I was losing $3,000+ a month in missed calls. LeadCapture Pro paid for itself on day 2. The AI scoring tells me which leads are hot so I call those first."
                },
                {
                  name: "Sarah Chen", role: "Operations Manager — CoolAir HVAC", city: "Atlanta, GA",
                  text: "We handle 50+ calls a day during summer. LeadCapture Pro captures every missed one and the AI qualifies them before we even call back. Game changer."
                },
                {
                  name: "Jake Rodriguez", role: "Owner — Rodriguez Tree Service", city: "Houston, TX",
                  text: "The photo upload feature is incredible. Customers send a picture of the tree, I give them a price before I even drive out. Saves 2 hours a day."
                },
                {
                  name: "Marcus Johnson", role: "Owner — Johnson Roofing", city: "Nashville, TN",
                  text: "After a storm we got 40 missed calls in one day. Every single one got an AI text back and a lead form. We booked 18 jobs. Unreal."
                },
                {
                  name: "Lisa Thompson", role: "Owner — Thompson Lawn Care", city: "Charlotte, NC",
                  text: "The voicemail transcription is my favorite feature. I read what they said in 5 seconds instead of listening to a 3 minute message. So much faster."
                }
              ].map((t, i) => (
                <div key={i} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                  </div>
                  <p className="text-slate-300 italic mb-6 flex-grow">"{t.text}"</p>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                    <div className="text-xs text-blue-500 font-medium mt-1">{t.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto p-12 rounded-3xl bg-blue-600 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative">Stop Losing Jobs to Missed Calls</h2>
            <p className="text-blue-100 text-xl mb-10 relative max-w-2xl mx-auto">Join hundreds of contractors who are capturing every lead and growing their business with AI.</p>
            <Link href="/signup" className="inline-block bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-xl hover:scale-105 relative">
              Start Free Trial
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">LeadCapture Pro</span>
              </Link>
              <p className="text-slate-500 max-w-xs mb-8">AI-powered lead capture for home service businesses. Never miss a job again.</p>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map(s => (
                  <Link key={s} href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-700 transition-all">
                    <span className="sr-only">{s}</span>
                    <div className="w-5 h-5 bg-current opacity-20 rounded-sm" />
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#ai-features" className="hover:text-white transition-colors">AI Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/setup" className="hover:text-white transition-colors">Setup Guide</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Free Trial</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/setup" className="hover:text-white transition-colors">Setup Guide</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/tcpa" className="hover:text-white transition-colors">TCPA Compliance</Link></li>
                <li><Link href="/licensing" className="hover:text-white transition-colors">Licensing</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-xs">© 2025 LeadCapture Pro. All rights reserved.</p>
            <p className="text-slate-500 text-xs font-medium tracking-widest uppercase">Built for contractors who build America</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
