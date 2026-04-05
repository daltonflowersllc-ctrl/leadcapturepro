import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Built for the People Who Build America</h1>
          <p className="text-slate-400 text-xl leading-relaxed">
            We're on a mission to ensure no home service business in the USA ever loses a job to a missed call again.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-20 p-10 rounded-3xl bg-slate-900 border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            At LeadCapture Pro, we believe that small businesses are the backbone of the American economy. When a contractor misses a call, they aren't just missing a notification—they're missing a mortgage payment, a college fund, or the next step in growing their legacy. Our mission is to provide enterprise-grade AI technology to local contractors nationwide at a price they can actually afford.
          </p>
        </section>

        {/* The Problem */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">The Problem We Solve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-3">The 5-Minute Rule</h3>
              <p className="text-slate-400">97% of customers will call your competitor if you don't respond within 5 minutes. Most contractors are on a roof or under a sink when the phone rings.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-3">The Cost of Silence</h3>
              <p className="text-slate-400">A single missed call in the home service industry is worth an average of $400. Missing just one call a day costs over $140,000 a year.</p>
            </div>
          </div>
        </section>

        {/* How We Solve It with AI */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">How We Solve It with AI</h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            We don't just send a generic "I'll call you back" text. Our proprietary AI engine engages with your customers instantly, qualifying them so you don't have to.
          </p>
          <ul className="space-y-4">
            {[
              "AI Lead Scoring: Instantly identifies if a lead is Hot, Warm, or Cold.",
              "Personalized Engagement: AI writes unique messages based on the time of day and service requested.",
              "Lead Intelligence: Summarizes exactly what the customer needs before you even dial.",
              "Call Preparation: Generates custom scripts so you walk into every callback prepared."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <svg className="w-6 h-6 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Industries */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Industries We Serve</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Tree Service", "Landscaping", "Lawn Care", "Handyman", "Roofing", "Plumbing",
              "Electrical", "HVAC", "House Washing", "Pest Control", "Pool Service", "General Contracting"
            ].map((industry, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm">
                {industry}
              </span>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Simple", desc: "Setup in 10 minutes." },
            { title: "Powerful", desc: "Enterprise AI tech." },
            { title: "Affordable", desc: "Built for small biz." },
            { title: "Contractor-First", desc: "We know your trade." }
          ].map((v, i) => (
            <div key={i} className="text-center">
              <div className="text-blue-500 font-bold text-xl mb-2">{v.title}</div>
              <div className="text-slate-500 text-sm">{v.desc}</div>
            </div>
          ))}
        </section>

        {/* Contact & CTA */}
        <section className="text-center p-12 rounded-3xl bg-blue-600">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Capture Every Lead?</h2>
          <p className="text-blue-100 mb-8">Join the hundreds of contractors growing their business with LeadCapture Pro.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <Link href="/signup" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all">
                Start Free Trial
              </Link>
              <p className="text-xs text-blue-200 mt-1">Credit card required. Billed on day 8.</p>
            </div>
            <a href="mailto:support@leadcapturepro.app" className="text-white font-bold hover:underline">
              support@leadcapturepro.app
            </a>
          </div>
          <p className="mt-8 text-blue-200 text-xs">
            LeadCapture Pro is operated by a Virginia-based company. All data stored securely in the United States.
          </p>
        </section>
      </div>
    </div>
  );
}
