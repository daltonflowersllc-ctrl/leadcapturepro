"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [missedCalls, setMissedCalls] = useState(5);
  const [avgJobValue, setAvgJobValue] = useState(500);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const plans = [
    {
      name: "Starter",
      monthly: 149,
      annual: 1490,
      annualSavings: 298,
      color: "from-slate-800 to-slate-900",
      border: "border-slate-700",
      badge: null,
      features: [
        "Missed call detection",
        "Auto-SMS to caller",
        "Basic lead form",
        "Lead management dashboard",
        "One-tap call back",
        "SMS notifications to owner",
        "1 phone number",
        "100 SMS/month included",
      ],
      cta: "Start Free Trial",
      ctaStyle: "bg-white text-slate-900 hover:bg-slate-100",
    },
    {
      name: "Pro",
      monthly: 249,
      annual: 2490,
      annualSavings: 498,
      color: "from-blue-600 to-blue-800",
      border: "border-blue-400",
      badge: "MOST POPULAR",
      features: [
        "Everything in Starter",
        "Smart lead form (service type, urgency, budget, photo, callback time)",
        "Zapier integration — connect to 5,000+ apps",
        "Native CRM sync coming soon",
        "Custom SMS templates",
        "Multi-step follow-up SMS",
        "Lead scoring (hot/warm/cold)",
        "Business hours settings",
        "Response time tracker",
        "3 phone numbers",
        "500 SMS/month",
        "Team access (2 users)",
      ],
      cta: "Start Free Trial",
      ctaStyle: "bg-white text-blue-700 hover:bg-blue-50",
    },
    {
      name: "Elite",
      monthly: 399,
      annual: 3990,
      annualSavings: 798,
      color: "from-violet-700 to-violet-900",
      border: "border-violet-500",
      badge: "COMING SOON",
      features: [
        "Everything in Pro",
        "AI voice agent",
        "Voicemail transcription",
        "Auto-schedule estimates",
        "Calendar integration",
        "Jobber & Housecall Pro integration",
        "5 phone numbers",
        "Unlimited SMS",
        "Dedicated account manager",
      ],
      cta: "Join Waitlist",
      ctaStyle: "bg-white text-violet-700 hover:bg-violet-50",
    },
  ];

  const testimonials = [
    {
      initials: "MP",
      name: "Mike Peterson",
      business: "Mike's Plumbing",
      quote: "I was losing at least 5 calls a week. LeadCapture Pro paid for itself the first day.",
      stars: 5,
    },
    {
      initials: "TW",
      name: "Tom Wilson",
      business: "Spark Electric",
      quote: "Setup took 5 minutes. Now every missed call turns into a lead. Best investment I've made.",
      stars: 5,
    },
    {
      initials: "SC",
      name: "Sarah Chen",
      business: "CoolAir HVAC",
      quote: "During busy season we were missing 10+ calls a day. LeadCapture Pro captures every single one.",
      stars: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        .font-display { font-family: 'DM Serif Display', serif; }
        .gradient-text {
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-glow {
          background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.3), transparent);
        }
        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .pulse-dot {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">LeadCapture Pro</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Log in</Link>
            <Link href="/subscribe" className="text-sm bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden hero-glow grid-bg">
        <div className="max-w-5xl mx-auto text-center relative z-10">

          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="pulse-dot w-2 h-2 bg-blue-400 rounded-full inline-block"></span>
            <span>Trusted by 500+ home service businesses</span>
          </div>

          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-tight mb-6">
            Never Lose Another<br />
            <span className="gradient-text">Lead to a Missed Call</span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Every missed call is money walking out the door. LeadCapture Pro automatically texts back your caller, captures their info, and delivers a qualified lead straight to your phone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/subscribe" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
              Start 7-Day Free Trial →
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors border border-slate-700">
              See How It Works
            </a>
          </div>

          <p className="text-sm text-slate-500">💳 Credit card required • Cancel before day 8 • 256-bit SSL</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16 pt-16 border-t border-slate-800">
            {[
              { value: "10,000+", label: "Leads Captured" },
              { value: "98%", label: "Response Rate" },
              { value: "$2.5M+", label: "Revenue Recovered" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
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

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 text-center">
                <div className="text-sm text-slate-400 mb-2">Monthly Lost Revenue</div>
                <div className="text-3xl font-bold text-red-400">
                  ${Math.round(missedCalls * 4.33 * avgJobValue).toLocaleString()}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 text-center">
                <div className="text-sm text-slate-400 mb-2">Annual Lost Revenue</div>
                <div className="text-3xl font-bold text-red-400">
                  ${Math.round(missedCalls * 4.33 * avgJobValue * 12).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
              <p className="text-blue-300 font-semibold text-lg">
                LeadCapture Pro Starter is <span className="text-white">$149/mo</span>
              </p>
              <p className="text-slate-400 mt-1 text-sm">
                It pays for itself by recovering just <span className="text-green-400 font-semibold">1 job per month</span> — you&apos;re missing {missedCalls * 4 > 1 ? `${Math.round(missedCalls * 4.33)}` : "multiple"} per month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="font-display text-4xl md:text-5xl text-white">How It Works</h2>
            <p className="text-slate-400 mt-4 text-lg">Three steps. Zero effort. Every lead captured.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

            {[
              {
                step: "01",
                icon: "\ud83d\udcde",
                title: "Missed Call Detected",
                desc: "A customer calls while you're on a job. We detect the missed call within seconds.",
                color: "bg-blue-500/10 border-blue-500/20",
              },
              {
                step: "02",
                icon: "\ud83d\udcac",
                title: "Auto-SMS Sent",
                desc: "Your customer instantly receives a personalized text with a link to a smart lead form.",
                color: "bg-violet-500/10 border-violet-500/20",
              },
              {
                step: "03",
                icon: "\ud83d\udd14",
                title: "Lead Delivered",
                desc: "You get an SMS alert with their name, service needed, budget, and urgency \u2014 ready to call back.",
                color: "bg-emerald-500/10 border-emerald-500/20",
              },
            ].map((item) => (
              <div key={item.step} className={`card-hover relative p-8 rounded-2xl border ${item.color} bg-slate-950/50`}>
                <div className="text-xs font-bold text-slate-600 tracking-widest mb-4">{item.step}</div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-slate-950 grid-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Features</p>
            <h2 className="font-display text-4xl md:text-5xl text-white">Everything You Need</h2>
            <p className="text-slate-400 mt-4 text-lg max-w-xl mx-auto">Built specifically for home service businesses who can&apos;t afford to miss a single call.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "\ud83d\udcf2", title: "Missed Call Detection", desc: "Instant detection the moment a call goes unanswered. No delays, no missed opportunities." },
              { icon: "\u2709\ufe0f", title: "Smart Lead Form", desc: "Callers self-qualify with service type, urgency, budget, and photos \u2014 all in one SMS link." },
              { icon: "\u26a1", title: "Instant SMS Alerts", desc: "Get notified the second a lead comes in with all the details you need to call back confidently." },
              { icon: "\ud83d\udcca", title: "Lead Dashboard", desc: "View, sort, and manage every lead in one clean interface. Never lose track of a prospect." },
              { icon: "\ud83c\udfa8", title: "Custom SMS Templates", desc: "Personalize your automated texts with your business name, tone, and call to action. (Pro)" },
              { icon: "\ud83d\udcf8", title: "Photo Uploads", desc: "Customers can send a photo of their problem right in the lead form. No more surprises on arrival. (Pro)" },
            ].map((f) => (
              <div key={f.title} className="card-hover p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Services */}
          <div className="mt-16 p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <p className="text-slate-400 text-sm mb-6 uppercase tracking-widest font-medium">Works for every home service business</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["\ud83c\udf33 Tree Service", "\ud83c\udfe1 Landscaping", "\ud83c\udf31 Lawn Care", "\ud83d\udd27 Handyman", "\ud83c\udfe0 Roofing", "\ud83d\udebd Plumbing", "\u26a1 Electrical", "\u2744\ufe0f HVAC", "\ud83e\uddf9 House Washing"].map((s) => (
                <span key={s} className="px-4 py-2 bg-slate-800 rounded-full text-sm text-slate-300 border border-slate-700">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="font-display text-4xl md:text-5xl text-white">Simple, Transparent Pricing</h2>
            <p className="text-slate-400 mt-4 text-lg">One missed job pays for a full year. ROI on day one.</p>
            <div className="flex items-center justify-center mt-8 space-x-4">
              <span className={`text-sm ${!annual ? "text-white" : "text-slate-500"}`}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-blue-500" : "bg-slate-700"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${annual ? "translate-x-7" : "translate-x-1"}`}></div>
              </button>
              <span className={`text-sm ${annual ? "text-white" : "text-slate-500"}`}>
                Annual <span className="text-green-400 font-medium">Save 2 months</span>
              </span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`card-hover relative rounded-2xl p-8 bg-gradient-to-b ${plan.color} border ${plan.border} ${plan.badge === "MOST POPULAR" ? "scale-105 shadow-2xl shadow-blue-500/20" : ""}`}>
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${plan.badge === "MOST POPULAR" ? "bg-blue-400 text-white" : "bg-slate-600 text-slate-300"}`}>
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-end space-x-1 mb-1">
                  <span className="text-4xl font-bold text-white">
                    ${annual ? Math.round(plan.annual / 12).toLocaleString() : plan.monthly}
                  </span>
                  <span className="text-slate-300 mb-1">/mo</span>
                </div>
                {annual && (
                  <p className="text-green-400 text-sm mb-4">${plan.annual.toLocaleString()}/yr - save ${plan.annualSavings}</p>
                )}
                <ul className="space-y-3 my-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start space-x-2 text-sm text-slate-200">
                      <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/subscribe?plan=${plan.name.toLowerCase()}`}
                  className={`block text-center py-3 rounded-xl font-semibold transition-colors ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
                <p className="text-xs text-center text-slate-400 mt-3">
                  {plan.name === "Elite" ? "Launching soon" : "7-day trial - Credit card required"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Reviews</p>
            <h2 className="font-display text-4xl md:text-5xl text-white">Contractors Love It</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card-hover p-8 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex space-x-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">{t.quote}</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">{t.initials}</div>
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6">Stop Losing Jobs to Missed Calls</h2>
          <p className="text-blue-100 text-xl mb-10">Join hundreds of contractors capturing every lead automatically. Setup takes 5 minutes.</p>
          <Link href="/subscribe" className="inline-block bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl">
            Start Your 7-Day Free Trial
          </Link>
          <p className="text-blue-200 text-sm mt-6">Credit card required - Cancel before day 8 - No questions asked</p>
        </div>
      </section>

      <footer className="bg-slate-950 border-t border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <span className="font-semibold text-white text-lg mb-4 block">LeadCapture Pro</span>
              <p className="text-slate-500 text-sm">Never lose another lead to a missed call.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/subscribe" className="hover:text-white transition-colors">Free Trial</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-600">
            2024 LeadCapture Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
