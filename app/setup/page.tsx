"use client";
import React, { useState } from "react";
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
  { id: "voip", label: "Other VoIP" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-mono transition-colors border border-slate-600"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function CodeBlock({ code, copyText }: { code: string; copyText: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 my-3">
      <code className="text-blue-300 font-mono text-sm">{code}</code>
      <CopyButton text={copyText} />
    </div>
  );
}

function CarrierInstructions({ carrierId, lcpNumber }: { carrierId: string; lcpNumber: string }) {
  const num = lcpNumber || "[YourLeadCaptureNumber]";

  switch (carrierId) {
    case "att":
      return (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm leading-relaxed">Dial the code below, then press <span className="text-white font-semibold">Call</span>. A confirmation tone means success.</p>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Enable</p>
            <CodeBlock code={`*92${num}#`} copyText={`*92${num}#`} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Disable</p>
            <CodeBlock code="*93" copyText="*93" />
          </div>
        </div>
      );
    case "verizon":
      return (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm leading-relaxed">Dial the code below, then press <span className="text-white font-semibold">Call</span>. A confirmation tone means success.</p>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Enable</p>
            <CodeBlock code={`*71${num}`} copyText={`*71${num}`} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Disable</p>
            <CodeBlock code="*73" copyText="*73" />
          </div>
        </div>
      );
    case "tmobile":
      return (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm leading-relaxed">Dial the code below, then press <span className="text-white font-semibold">Call</span>.</p>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Enable</p>
            <CodeBlock code={`61${num}*`} copyText={`61${num}*`} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Disable</p>
            <CodeBlock code="##61#" copyText="##61#" />
          </div>
        </div>
      );
    case "sprint":
      return (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm leading-relaxed">Dial the code below, then press <span className="text-white font-semibold">Call</span>.</p>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Enable</p>
            <CodeBlock code={`*28${num}`} copyText={`*28${num}`} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Disable</p>
            <CodeBlock code="*38" copyText="*38" />
          </div>
        </div>
      );
    case "uscellular":
      return (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm leading-relaxed">Dial the code below, then press <span className="text-white font-semibold">Call</span>.</p>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Enable</p>
            <CodeBlock code={`*92${num}`} copyText={`*92${num}`} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Disable</p>
            <CodeBlock code="*920" copyText="*920" />
          </div>
        </div>
      );
    case "android":
      return (
        <div className="space-y-4">
          <ol className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">1.</span>Open <span className="text-white font-medium">Phone app</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">2.</span>Tap the <span className="text-white font-medium">3 dots (⋮)</span> → <span className="text-white font-medium">Settings</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">3.</span>Tap <span className="text-white font-medium">Call Settings</span> or <span className="text-white font-medium">Supplementary Services</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">4.</span>Tap <span className="text-white font-medium">Call Forwarding</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">5.</span>Tap <span className="text-white font-medium">"Forward when unanswered"</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">6.</span>Enter your LeadCapture number:
              <div className="mt-1 w-full">
                <CodeBlock code={num} copyText={num} />
              </div>
            </li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">7.</span>Tap <span className="text-white font-medium">Enable</span></li>
          </ol>
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300 text-xs">
            <span className="font-bold">WARNING:</span> Do NOT select "Forward always" — only "Forward when unanswered".
          </div>
          <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs">
            <span className="font-semibold text-slate-300">Samsung Galaxy users:</span> Phone app → Settings → Supplementary services → Call forwarding → Voice call → Forward when unanswered.
          </div>
        </div>
      );
    case "iphone":
      return (
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-amber-900/30 border border-amber-600/50">
            <p className="text-amber-300 text-sm leading-relaxed">
              <span className="font-bold">Important:</span> Your iPhone&apos;s built-in call forwarding (Settings → Phone → Call Forwarding) forwards ALL calls unconditionally. Instead, use your carrier&apos;s star code for conditional forwarding.
            </p>
          </div>
          <p className="text-slate-300 text-sm">Select your carrier button above for the exact code to dial.</p>
        </div>
      );
    case "ringcentral":
      return (
        <div className="space-y-3">
          <p className="text-slate-400 text-xs italic">RingCentral does not use star codes. Follow these steps instead:</p>
          <ol className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">1.</span>Open <span className="text-white font-medium">RingCentral app</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">2.</span>Tap your <span className="text-white font-medium">profile picture</span> → <span className="text-white font-medium">Settings</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">3.</span>Tap <span className="text-white font-medium">Call Handling and Forwarding</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">4.</span>Under your extension, add your LeadCapture number:
              <div className="mt-1 w-full">
                <CodeBlock code={num} copyText={num} />
              </div>
            </li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">5.</span>Set the ring order so your devices ring first, then LeadCapture number rings after</li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">6.</span>Set number of rings before forwarding to <span className="text-white font-medium">4</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">7.</span>Tap <span className="text-white font-medium">Save</span></li>
          </ol>
          <p className="text-slate-500 text-xs">This ensures RingCentral rings your devices first and only forwards to LeadCapture Pro if you don&apos;t answer.</p>
        </div>
      );
    case "googlevoice":
      return (
        <div className="space-y-3">
          <ol className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">1.</span>Log into <span className="text-white font-medium">voice.google.com</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">2.</span>Click the <span className="text-white font-medium">Settings gear icon</span> → <span className="text-white font-medium">Calls tab</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">3.</span>Tap <span className="text-white font-medium">Add a forwarding phone</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">4.</span>Enter your LeadCapture number and verify it:
              <div className="mt-1 w-full">
                <CodeBlock code={num} copyText={num} />
              </div>
            </li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">5.</span>Enable <span className="text-white font-medium">"Forward to LeadCapture number when unanswered"</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">6.</span>Click <span className="text-white font-medium">Save</span></li>
          </ol>
          <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs">
            <span className="font-semibold text-slate-300">Note:</span> Google Voice forwards to ALL linked phones simultaneously by default. Make sure to set your personal phone as the primary ring destination.
          </div>
        </div>
      );
    case "voip":
      return (
        <div className="space-y-3">
          <p className="text-slate-400 text-xs">Works with Grasshopper, 8x8, Nextiva, Vonage, Dialpad, and others.</p>
          <ol className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">1.</span>Log into your <span className="text-white font-medium">phone system dashboard</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">2.</span>Look for <span className="text-white font-medium">Call Handling</span>, <span className="text-white font-medium">Call Routing</span>, or <span className="text-white font-medium">Call Forwarding</span> settings</li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">3.</span>Find the <span className="text-white font-medium">"When unanswered"</span> or <span className="text-white font-medium">"No answer"</span> option</li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">4.</span>Enter your LeadCapture number:
              <div className="mt-1 w-full">
                <CodeBlock code={num} copyText={num} />
              </div>
            </li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">5.</span>Set number of rings to <span className="text-white font-medium">4</span></li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold shrink-0">6.</span>Click <span className="text-white font-medium">Save</span></li>
          </ol>
          <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs">
            Can&apos;t find these settings? Contact your phone provider and say: <span className="text-white italic">"I need to set up conditional call forwarding to forward calls when unanswered to {num}."</span>
          </div>
        </div>
      );
    default:
      return null;
  }
}

const flowSteps = [
  { icon: "📞", label: "Customer calls your number" },
  { icon: "📳", label: "Your phone rings normally" },
  { icon: "✅", label: "You answer = normal call, nothing happens" },
  { icon: "⏱️", label: "You miss it after 4 rings = forwards to LeadCapture Pro" },
  { icon: "💬", label: "Customer gets SMS with lead form in under 30 seconds" },
  { icon: "📝", label: "Customer fills out form" },
  { icon: "🔔", label: "You get instant push notification" },
  { icon: "📊", label: "Open dashboard" },
  { icon: "📲", label: "Call back with one tap" },
  { icon: "🏆", label: "Mark lead as Won" },
];

const faqs = [
  { q: "Will my customers know?", a: "No — completely invisible to callers." },
  { q: "Does my number change?", a: "Never. Your customers always dial the same number." },
  { q: "What if I answer?", a: "Nothing happens — it's a completely normal call." },
  { q: "Does it work 24/7?", a: "Yes, including after hours, weekends, and holidays." },
  { q: "How fast is the SMS?", a: "Within 30 seconds of a missed call." },
  { q: "What if they don't fill the form?", a: "You still get their number in your dashboard." },
  { q: "Can I turn it off?", a: "Yes — dial your disable code or turn off forwarding in your dashboard." },
  { q: "Works with landlines?", a: "Yes — call your provider and ask for conditional call forwarding when unanswered to your LeadCapture number." },
  { q: "Will it affect my voicemail?", a: "Possibly — if you use carrier voicemail it may stop working. Most clients prefer LeadCapture Pro over voicemail since callers actually respond to texts." },
];

export default function SetupPage() {
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [lcpNumber, setLcpNumber] = useState("");

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
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .step-connector::after {
          content: '';
          position: absolute;
          left: 19px;
          top: 48px;
          bottom: -16px;
          width: 2px;
          background: linear-gradient(to bottom, #3b82f6, transparent);
        }
      `}</style>

      {/* Nav */}
      <nav className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
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
            <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/setup" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Setup Guide</Link>
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
      <section className="relative py-20 px-6 overflow-hidden grid-bg" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.2), transparent), #020617" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Quick Setup Guide
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-tight">
            Up and Running in{" "}
            <span className="gradient-text">10 Minutes</span>
          </h1>
          <p className="text-xl text-slate-300 mb-3">No IT required.</p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Works with your existing phone number and any carrier.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-12">

          {/* Step 1 */}
          <div className="relative flex gap-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0 z-10">1</div>
              <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-500/50 to-transparent mt-2"></div>
            </div>
            <div className="flex-1 pb-12">
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
              <p className="text-slate-400 mb-4">Sign up, choose a plan, and enter your business name and phone number. That&apos;s it — you&apos;re in the system.</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: "✍️", label: "Sign up" },
                  { icon: "💳", label: "Choose plan" },
                  { icon: "📋", label: "Enter business info" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex gap-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0 z-10">2</div>
              <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-500/50 to-transparent mt-2"></div>
            </div>
            <div className="flex-1 pb-12">
              <h2 className="text-2xl font-bold text-white mb-2">Get Your LeadCapture Number</h2>
              <p className="text-slate-400 mb-4">
                We automatically assign you a local number matching your area code. This is where missed calls forward to — your customers never see this number.
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl shrink-0">📍</div>
                <div>
                  <p className="text-white font-medium text-sm">Local number assigned instantly</p>
                  <p className="text-slate-500 text-xs">Matches your area code — looks local to your customers</p>
                </div>
              </div>

              {/* Number input for personalized codes */}
              <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <label className="block text-sm font-medium text-blue-300 mb-2">
                  Enter your LeadCapture number to personalize the codes below:
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 5551234567"
                  value={lcpNumber}
                  onChange={(e) => setLcpNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                />
                <p className="text-slate-500 text-xs mt-1">Optional — auto-fills the codes below with your actual number</p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex gap-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0 z-10">3</div>
              <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-500/50 to-transparent mt-2"></div>
            </div>
            <div className="flex-1 pb-12">
              <h2 className="text-2xl font-bold text-white mb-2">Set Up Conditional Call Forwarding</h2>
              <p className="text-slate-400 mb-5">This tells your carrier to forward unanswered calls to your LeadCapture number after a few rings.</p>

              {/* Amber warning */}
              <div className="p-4 rounded-xl bg-amber-900/40 border border-amber-500/60 mb-6">
                <div className="flex gap-3">
                  <span className="text-amber-400 text-xl shrink-0">⚠️</span>
                  <div>
                    <p className="text-amber-300 font-bold text-sm mb-1">Use CONDITIONAL forwarding only</p>
                    <p className="text-amber-200 text-sm">Forward when unanswered. Do <span className="font-bold underline">NOT</span> use unconditional/forward all calls.</p>
                    <p className="text-amber-300 text-sm font-medium mt-1">Your phone must ring first.</p>
                  </div>
                </div>
              </div>

              {/* Carrier grid */}
              <div className="mb-6">
                <p className="text-sm text-slate-400 mb-3">Select your carrier or phone type:</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {carriers.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCarrier(selectedCarrier === c.id ? null : c.id)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        selectedCarrier === c.id
                          ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20"
                          : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carrier instructions */}
              {selectedCarrier && (
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-700 mb-6">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 font-medium">
                    {carriers.find((c) => c.id === selectedCarrier)?.label} Instructions
                  </p>
                  <CarrierInstructions
                    carrierId={selectedCarrier}
                    lcpNumber={lcpNumber || "[YourLeadCaptureNumber]"}
                  />
                </div>
              )}

              {/* Universal fallback */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
                <div className="flex gap-3">
                  <span className="text-slate-400 text-lg shrink-0">🌐</span>
                  <div>
                    <p className="text-slate-300 text-sm font-medium mb-1">Universal GSM Fallback</p>
                    <p className="text-slate-400 text-sm">
                      Not sure which carrier? The universal GSM code for most carriers is:
                    </p>
                    <CodeBlock
                      code={`*61${lcpNumber || "[YourNumber]"}#`}
                      copyText={`*61${lcpNumber || "[YourNumber]"}#`}
                    />
                    <p className="text-slate-500 text-xs">Works on most worldwide networks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex gap-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">4</div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Install App & Enable Notifications</h2>
              <p className="text-slate-400 mb-5">Get instant push notifications the second a lead comes in.</p>
              <ol className="space-y-3">
                {[
                  { step: "1", text: <>Visit <span className="text-blue-400 font-mono">leadcapturepro.app</span> on your phone</> },
                  { step: "2", text: <>Tap the <span className="text-white font-medium">share icon</span> (iOS) or browser menu (Android)</> },
                  { step: "3", text: <>Tap <span className="text-white font-medium">"Add to Home Screen"</span></> },
                  { step: "4", text: <>Open the app and tap <span className="text-white font-medium">Allow</span> for notifications</> },
                ].map((item) => (
                  <li key={item.step} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{item.step}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 p-4 rounded-xl bg-green-900/30 border border-green-700/50">
                <p className="text-green-300 text-sm font-medium">
                  🎉 You&apos;re set up! Now get instant push notifications the second a lead comes in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">The Full Picture</p>
            <h2 className="font-display text-4xl text-white">How It Works</h2>
          </div>
          <div className="relative">
            {flowSteps.map((step, i) => (
              <div key={i} className="flex gap-4 mb-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                    i === 2 ? "bg-green-500/20 border-2 border-green-500/50" :
                    i === 3 ? "bg-amber-500/20 border-2 border-amber-500/50" :
                    "bg-slate-800 border border-slate-700"
                  }`}>
                    {step.icon}
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 ${i === 3 ? "bg-blue-500/70" : "bg-slate-700"}`}></div>
                  )}
                </div>
                <div className={`flex-1 py-2.5 text-sm ${
                  i === 2 ? "text-green-300" :
                  i === 3 ? "text-amber-300 font-medium" :
                  i >= 4 ? "text-blue-200" :
                  "text-slate-300"
                }`}>
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-slate-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="font-display text-4xl text-white">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Ready to capture every lead?</h2>
          <p className="text-blue-100 text-lg mb-8">Start your free trial today. Setup in 10 minutes, no IT required.</p>
          <Link
            href="/subscribe"
            className="inline-block bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl"
          >
            Start Free Trial →
          </Link>
          <p className="text-blue-200 text-sm mt-6">Credit card required · Cancel before day 8 · No questions asked</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <Link href="/" className="font-semibold text-slate-300 hover:text-white transition-colors">LeadCapture Pro</Link>
          <div className="flex gap-6">
            <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p>2024 LeadCapture Pro</p>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-white font-medium text-sm">{q}</span>
        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && <p className="mt-3 text-slate-400 text-sm leading-relaxed">{a}</p>}
    </button>
  );
}
