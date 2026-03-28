"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const carriers = [
  { id: "att", label: "AT&T" },
  { id: "verizon", label: "Verizon" },
  { id: "tmobile", label: "T-Mobile" },
  { id: "sprint", label: "Sprint/Boost" },
  { id: "uscellular", label: "US Cellular" },
  { id: "android", label: "Android" },
  { id: "iphone", label: "iPhone" },
  { id: "ringcentral", label: "RingCentral" },
  { id: "googlevoice", label: "Google Voice" },
  { id: "other", label: "Other VoIP" },
];

type CarrierInstruction = {
  type: "starcode" | "steps";
  enableCode?: string;
  disableCode?: string;
  copyValue: string;
  copyLabel: string;
  steps?: string[];
  warning?: string;
  note?: string;
  disableSteps?: string;
};

const carrierInstructions: Record<string, CarrierInstruction> = {
  att: {
    type: "starcode",
    enableCode: "*92[YourLeadCaptureNumber]#",
    disableCode: "*93",
    copyValue: "*92[YourLeadCaptureNumber]#",
    copyLabel: "Copy Enable Code",
    note: "Dial the enable code then press Call. A confirmation tone means success.",
    disableSteps: "To disable: dial *93 then press Call.",
  },
  verizon: {
    type: "starcode",
    enableCode: "*71[YourLeadCaptureNumber]",
    disableCode: "*73",
    copyValue: "*71[YourLeadCaptureNumber]",
    copyLabel: "Copy Enable Code",
    note: "Dial the enable code then press Call. A confirmation tone means success.",
    disableSteps: "To disable: dial *73 then press Call.",
  },
  tmobile: {
    type: "starcode",
    enableCode: "61[YourLeadCaptureNumber]*",
    disableCode: "##61#",
    copyValue: "61[YourLeadCaptureNumber]*",
    copyLabel: "Copy Enable Code",
    note: "Dial the enable code then press Call.",
    disableSteps: "To disable: dial ##61# then press Call.",
  },
  sprint: {
    type: "starcode",
    enableCode: "*28[YourLeadCaptureNumber]",
    disableCode: "*38",
    copyValue: "*28[YourLeadCaptureNumber]",
    copyLabel: "Copy Enable Code",
    note: "Dial the enable code then press Call.",
    disableSteps: "To disable: dial *38 then press Call.",
  },
  uscellular: {
    type: "starcode",
    enableCode: "*92[YourLeadCaptureNumber]",
    disableCode: "*920",
    copyValue: "*92[YourLeadCaptureNumber]",
    copyLabel: "Copy Enable Code",
    note: "Dial the enable code then press Call.",
    disableSteps: "To disable: dial *920 then press Call.",
  },
  android: {
    type: "steps",
    copyValue: "[YourLeadCaptureNumber]",
    copyLabel: "Copy LeadCapture Number",
    steps: [
      "Open the Phone app",
      "Tap the 3-dot menu → Settings",
      "Tap Call Settings or Supplementary Services",
      "Tap Call Forwarding",
      'Tap "Forward when unanswered"',
      "Enter your LeadCapture number",
      "Tap Enable",
    ],
    warning:
      'Do NOT select "Forward always" — only "Forward when unanswered". Your phone must ring before forwarding.',
    note:
      "Samsung Galaxy users: Phone app → Settings → Supplementary services → Call forwarding → Voice call → Forward when unanswered.",
  },
  iphone: {
    type: "steps",
    copyValue: "[YourLeadCaptureNumber]",
    copyLabel: "Copy LeadCapture Number",
    steps: [
      'Your iPhone\'s built-in call forwarding (Settings → Phone → Call Forwarding) forwards ALL calls unconditionally — do not use it.',
      "Instead, use your carrier's star code for conditional forwarding.",
      "Select your carrier button above for the exact code to dial.",
    ],
    warning:
      "iPhone Settings → Phone → Call Forwarding is UNCONDITIONAL (forwards all calls immediately). You must use your carrier star code instead.",
  },
  ringcentral: {
    type: "steps",
    copyValue: "[YourLeadCaptureNumber]",
    copyLabel: "Copy LeadCapture Number",
    steps: [
      "Open the RingCentral app",
      "Tap your profile picture → Settings",
      "Tap Call Handling and Forwarding",
      "Under your extension, add your LeadCapture number",
      "Set the ring order so your devices ring first, then LeadCapture number rings after",
      "Set number of rings before forwarding to 4",
      "Tap Save",
    ],
    note:
      "RingCentral does not use star codes. This ensures your devices ring first and only forwards to LeadCapture Pro if you don't answer.",
  },
  googlevoice: {
    type: "steps",
    copyValue: "[YourLeadCaptureNumber]",
    copyLabel: "Copy LeadCapture Number",
    steps: [
      "Log into voice.google.com",
      "Click the Settings gear icon → Calls tab",
      "Click Add a forwarding phone",
      "Enter your LeadCapture number and verify it",
      'Enable "Forward to LeadCapture number when unanswered"',
      "Click Save",
    ],
    note:
      "Google Voice forwards to ALL linked phones simultaneously by default. Make sure your personal phone is set as the primary ring destination.",
  },
  other: {
    type: "steps",
    copyValue: "[YourLeadCaptureNumber]",
    copyLabel: "Copy LeadCapture Number",
    steps: [
      "Log into your phone system dashboard (Grasshopper, 8x8, Nextiva, Vonage, Dialpad, etc.)",
      'Look for Call Handling, Call Routing, or Call Forwarding settings',
      'Find the "When unanswered" or "No answer" option',
      "Enter your LeadCapture number",
      "Set number of rings to 4",
      "Save your settings",
    ],
    note:
      'If you cannot find these settings, contact your provider and say: "I need to set up conditional call forwarding to forward calls when unanswered to [LeadCapture number]."',
  },
};

const flowSteps = [
  { icon: "📞", label: "Customer calls your number", color: "bg-blue-500/10 border-blue-500/30" },
  { icon: "📳", label: "Your phone rings normally", color: "bg-slate-800 border-slate-700" },
  { icon: "✅", label: "You answer = normal call, nothing happens", color: "bg-emerald-500/10 border-emerald-500/30" },
  { icon: "⏱️", label: "You miss it after 4 rings → forwards to LeadCapture Pro", color: "bg-amber-500/10 border-amber-500/30" },
  { icon: "💬", label: "Customer gets SMS with lead form in under 30 seconds", color: "bg-blue-500/10 border-blue-500/30" },
  { icon: "📝", label: "Customer fills out form", color: "bg-slate-800 border-slate-700" },
  { icon: "🔔", label: "You get instant push notification", color: "bg-violet-500/10 border-violet-500/30" },
  { icon: "📊", label: "Open dashboard → call back with one tap", color: "bg-blue-500/10 border-blue-500/30" },
  { icon: "🏆", label: "Mark lead as Won", color: "bg-emerald-500/10 border-emerald-500/30" },
];

const faqs = [
  { q: "Will my customers know?", a: "No — completely invisible. Your number stays the same and callers experience a normal ring before the forwarding kicks in." },
  { q: "Does my number change?", a: "Never. You keep your existing business number. We simply assign you a secondary LeadCapture number that missed calls forward to." },
  { q: "What if I answer?", a: "Nothing happens. It's a completely normal call. Forwarding only triggers when the call goes unanswered after 4 rings." },
  { q: "Does it work 24/7?", a: "Yes — including after hours, weekends, and holidays. LeadCapture Pro never sleeps." },
  { q: "How fast is the SMS?", a: "Within 30 seconds of the missed call. Callers get a text while you're still thinking about calling back." },
  { q: "What if they don't fill the form?", a: "You still get their number in your dashboard. You'll know someone called and can reach out directly." },
  { q: "Can I turn it off?", a: "Yes — dial your disable code anytime, or toggle forwarding off directly from your LeadCapture Pro dashboard." },
  { q: "Works with landlines?", a: "Yes. Call your provider and ask for conditional call forwarding when unanswered to your LeadCapture number." },
  { q: "Will it affect my voicemail?", a: "Possibly — if you use carrier voicemail it may stop working. Most clients actually prefer this since callers respond to texts far more than voicemails." },
];

export default function SetupPage() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const instruction = selectedCarrier ? carrierInstructions[selectedCarrier] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
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
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .step-line::after {
          content: '';
          position: absolute;
          left: 24px;
          top: 52px;
          bottom: -24px;
          width: 2px;
          background: linear-gradient(to bottom, rgba(59,130,246,0.4), rgba(59,130,246,0.1));
        }
        .flow-arrow {
          color: #475569;
          font-size: 20px;
          line-height: 1;
        }
      `}</style>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">LeadCapture Pro</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-sm text-slate-400">
            <Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/setup" className="text-white font-medium">Setup Guide</Link>
            <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
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
      <section className="relative pt-32 pb-20 px-6 overflow-hidden hero-glow grid-bg">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Setup Guide</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
            Up and Running in<br />
            <span className="gradient-text">10 Minutes</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            No IT required. Works with your existing phone number and any carrier.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-6 bg-slate-950">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Step 1 */}
          <div className="relative">
            <div className="flex gap-6">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">1</div>
                <div className="flex-1 w-0.5 bg-gradient-to-b from-blue-500/50 to-blue-500/10 mt-2 min-h-[24px]"></div>
              </div>
              <div className="flex-1 pb-8">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h2 className="text-xl font-bold text-white mb-1">Create Your Account</h2>
                  <p className="text-slate-400 text-sm mb-4">Takes about 2 minutes</p>
                  <ul className="space-y-3">
                    {[
                      { icon: "👤", text: "Sign up at leadcapturepro.app" },
                      { icon: "📋", text: "Choose a plan (Starter, Pro, or Elite)" },
                      { icon: "🏢", text: "Enter your business name" },
                      { icon: "📱", text: "Enter your existing business phone number" },
                    ].map((item) => (
                      <li key={item.text} className="flex items-center gap-3 text-slate-300">
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <Link href="/subscribe" className="inline-block bg-blue-500 hover:bg-blue-400 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm">
                      Create Account →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="flex gap-6">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/30">2</div>
                <div className="flex-1 w-0.5 bg-gradient-to-b from-violet-500/50 to-violet-500/10 mt-2 min-h-[24px]"></div>
              </div>
              <div className="flex-1 pb-8">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h2 className="text-xl font-bold text-white mb-1">Get Your LeadCapture Number</h2>
                  <p className="text-slate-400 text-sm mb-4">Automatic — no action required</p>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <span className="text-2xl mt-0.5">📲</span>
                    <div>
                      <p className="text-white font-medium mb-1">We automatically assign you a local number</p>
                      <p className="text-slate-400 text-sm">
                        Your LeadCapture number matches your area code so it looks local to your customers.
                        This is the number that missed calls will forward to — you'll find it on your dashboard.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Your number is ready on your dashboard as soon as your account is created. No waiting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="flex gap-6">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/30">3</div>
                <div className="flex-1 w-0.5 bg-gradient-to-b from-amber-500/50 to-amber-500/10 mt-2 min-h-[24px]"></div>
              </div>
              <div className="flex-1 pb-8">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h2 className="text-xl font-bold text-white mb-1">Set Up Conditional Call Forwarding</h2>
                  <p className="text-slate-400 text-sm mb-4">Takes about 2 minutes — one dial code</p>

                  {/* Amber warning */}
                  <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 flex gap-3">
                    <span className="text-amber-400 text-xl flex-shrink-0 mt-0.5">⚠️</span>
                    <div>
                      <p className="text-amber-300 font-semibold mb-1">Use CONDITIONAL forwarding only</p>
                      <p className="text-amber-200/80 text-sm leading-relaxed">
                        Forward when unanswered. Do <strong>NOT</strong> use unconditional / &quot;forward all calls.&quot; Your phone must ring first — customers hear it ring normally before the forwarding kicks in.
                      </p>
                    </div>
                  </div>

                  {/* Carrier grid */}
                  <p className="text-slate-400 text-sm font-medium mb-3 uppercase tracking-wider">Select your carrier or phone type</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
                    {carriers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCarrier(selectedCarrier === c.id ? null : c.id)}
                        className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                          selectedCarrier === c.id
                            ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  {/* Carrier instructions */}
                  {instruction && selectedCarrier && (
                    <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">
                          {carriers.find((c) => c.id === selectedCarrier)?.label} Instructions
                        </h3>
                        <button
                          onClick={() => copyToClipboard(instruction.copyValue, selectedCarrier)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            copied === selectedCarrier
                              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                              : "bg-slate-700 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                          }`}
                        >
                          {copied === selectedCarrier ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              {instruction.copyLabel}
                            </>
                          )}
                        </button>
                      </div>

                      {instruction.type === "starcode" && instruction.enableCode && (
                        <div className="space-y-3">
                          <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1.5">Enable Code</p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-blue-300 font-mono text-base tracking-widest">
                                {instruction.enableCode}
                              </code>
                            </div>
                            <p className="text-slate-400 text-sm mt-2">
                              Replace <span className="text-blue-400 font-mono">[YourLeadCaptureNumber]</span> with the number from your dashboard, then press <strong className="text-white">Call</strong>.
                            </p>
                            {instruction.note && (
                              <p className="text-emerald-400 text-sm mt-1">{instruction.note}</p>
                            )}
                          </div>
                          {instruction.disableCode && instruction.disableSteps && (
                            <div className="pt-3 border-t border-slate-700">
                              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1.5">Disable Code</p>
                              <code className="inline-block px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-red-300 font-mono text-base tracking-widest">
                                {instruction.disableCode}
                              </code>
                              <p className="text-slate-400 text-sm mt-1.5">{instruction.disableSteps}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {instruction.type === "steps" && instruction.steps && (
                        <div className="space-y-3">
                          {instruction.warning && (
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                              <p className="text-amber-300 text-sm">
                                <strong>Warning:</strong> {instruction.warning}
                              </p>
                            </div>
                          )}
                          <ol className="space-y-2">
                            {instruction.steps.map((step, i) => (
                              <li key={i} className="flex gap-3 text-sm text-slate-300">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                                  {i + 1}
                                </span>
                                <span className="pt-0.5">{step}</span>
                              </li>
                            ))}
                          </ol>
                          {instruction.note && (
                            <div className="pt-3 border-t border-slate-700">
                              <p className="text-slate-400 text-sm">
                                <span className="text-blue-400 font-medium">Note:</span> {instruction.note}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {!selectedCarrier && (
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 border-dashed text-center text-slate-500 text-sm">
                      Select your carrier above to see the exact setup instructions
                    </div>
                  )}

                  {/* Universal fallback */}
                  <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <p className="text-slate-400 text-sm">
                      <span className="text-blue-400 font-medium">Not sure which carrier?</span>{" "}
                      The universal GSM code for most carriers is{" "}
                      <code className="text-blue-300 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded">*61[YourNumber]#</code>
                      {" "}— this works on most worldwide networks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/30">4</div>
              </div>
              <div className="flex-1">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h2 className="text-xl font-bold text-white mb-1">Install App &amp; Enable Notifications</h2>
                  <p className="text-slate-400 text-sm mb-4">Takes about 1 minute — never miss a lead</p>
                  <ul className="space-y-3">
                    {[
                      { icon: "🌐", text: "Visit leadcapturepro.app on your phone" },
                      { icon: "📤", text: 'Tap the share icon (iOS) or menu (Android)' },
                      { icon: "➕", text: 'Tap "Add to Home Screen"' },
                      { icon: "📱", text: "Open the app from your home screen" },
                      { icon: "🔔", text: 'Tap "Allow" when prompted for notifications' },
                    ].map((item) => (
                      <li key={item.text} className="flex items-center gap-3 text-slate-300">
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-emerald-300 text-sm font-medium">
                      🎉 You&apos;re done! You&apos;ll now get instant push notifications the second a lead comes in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works flow diagram */}
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">The Full Picture</p>
            <h2 className="font-display text-4xl md:text-5xl text-white">How It Works</h2>
            <p className="text-slate-400 mt-4">From missed call to won job — fully automatic.</p>
          </div>

          <div className="flex flex-col items-center gap-0">
            {flowSteps.map((step, i) => (
              <React.Fragment key={i}>
                <div className={`w-full max-w-md flex items-center gap-4 px-5 py-4 rounded-xl border ${step.color}`}>
                  <span className="text-2xl flex-shrink-0">{step.icon}</span>
                  <span className="text-white font-medium">{step.label}</span>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="flow-arrow py-1 select-none">↓</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-slate-950 grid-bg">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="font-display text-4xl md:text-5xl text-white">Common Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-white font-medium pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Ready to capture every lead?</h2>
          <p className="text-blue-100 text-xl mb-10">
            Setup takes 10 minutes. The first missed call you capture pays for itself.
          </p>
          <Link
            href="/subscribe"
            className="inline-block bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl"
          >
            Start Free Trial →
          </Link>
          <p className="text-blue-200 text-sm mt-6">7-day free trial · Credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
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
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/subscribe" className="hover:text-white transition-colors">Free Trial</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/setup" className="hover:text-white transition-colors">Setup Guide</Link></li>
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
