"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const plans = [
    {
      name: "Basic",
      monthly: 199,
      annual: 1990,
      annualSavings: 398,
      color: "from-slate-800 to-slate-900",
      border: "border-slate-700",
      badge: null,
      features: [
        "Missed call detection",
        "Auto-SMS to callers",
        "Lead capture form",
        "Lead dashboard",
        "SMS notifications",
        "1 phone number",
      ],
      cta: "Start Free Trial",
      ctaStyle: "bg-white text-slate-900 hover:bg-slate-100",
    },
    {
      name: "Pro",
      monthly: 299,
      annual: 2990,
      annualSavings: 598,
      color: "from-blue-600 to-blue-800",
      border: "border-blue-400",
      badge: "MOST POPULAR",
      features: [
        "Everything in Basic",
        "Custom SMS templates",
        "Lead scoring",
        "Photo uploads in forms",
        "Multi-step SMS follow-up",
        "Priority support",
        "3 phone numbers",
        "Team access (2 users)",
      ],
      cta: "Start Free Trial",
      ctaStyle: "bg-white text-blue-700 hover:bg-blue-50",
    },
    {
      name: "Elite",
      monthly: 499,
      annual: 4990,
      annualSavings: 998,
      color: "from-violet-700 to-violet-900",
      border: "border-violet-500",
      badge: "COMING SOON",
      features: [
        "Everything in Pro",
        "AI voice agent",
        "Call transcription",
        "Auto-schedule estimates",
        "Calendar integration",
        "API access",
        "5 phone numbers",
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
              Start 7-Day Free Trial \u2192
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors border border-slate-700">
              See How It Works
            </a>
          </div>

          <p className="text-sm text-slate-500">\ud83d\udcb3 Credit card required \u2022 Cancel before day 8 \u2022 256-bit SSL</p>

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
          <div className="text-center mb-12
