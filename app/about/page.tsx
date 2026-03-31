import Link from 'next/link';

export const metadata = {
  title: 'About | LeadCapture Pro',
  description: 'Learn about LeadCapture Pro — built to help home service businesses never lose another lead to a missed call.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="font-semibold text-white text-lg">LeadCapture Pro</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6 text-center" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.2), transparent)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span>Built for Home Service Pros</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Never Lose Another Lead to a Missed Call
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            LeadCapture Pro was built from the ground up to solve a simple but costly problem:
            home service businesses lose thousands of dollars every month to missed calls that never become customers.
          </p>
        </div>
      </section>

      {/* Mission */}
      <main className="max-w-4xl mx-auto px-6 pb-20">

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-3xl mb-4">🎯</div>
            <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
            <p className="text-slate-400 leading-relaxed">
              We exist to level the playing field for independent home service contractors. Big companies have
              dedicated call centers and sales teams. LeadCapture Pro gives solo operators and small crews
              the same automated lead capture capability — at a fraction of the cost.
            </p>
          </div>
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-3xl mb-4">🏠</div>
            <h2 className="text-xl font-bold text-white mb-3">Built for Home Service</h2>
            <p className="text-slate-400 leading-relaxed">
              Plumbers, electricians, HVAC techs, roofers, landscapers, painters — we built LeadCapture Pro
              specifically for trades businesses where every job is worth hundreds or thousands of dollars.
              One recovered lead pays for months of service.
            </p>
          </div>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Missed Call Detected', desc: 'When a customer calls your forwarded number and you can\'t answer, we detect it instantly.' },
              { step: '02', title: 'Auto-SMS Sent', desc: 'A personalized text goes out immediately with a smart lead capture form.' },
              { step: '03', title: 'Lead Delivered', desc: 'You get a full lead notification — name, phone, service needed, urgency — straight to your phone.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-3xl font-bold text-blue-500/40 mb-2">{item.step}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { value: '500+', label: 'Businesses Served' },
            { value: '10,000+', label: 'Leads Captured' },
            { value: '$2.5M+', label: 'Revenue Recovered' },
          ].map((stat) => (
            <div key={stat.label} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Get in Touch</h2>
          <p className="text-slate-400 mb-6">
            Have questions about LeadCapture Pro? We&apos;d love to hear from you.
          </p>
          <a
            href="mailto:support@leadcapturepro.app"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            support@leadcapturepro.app
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <span>© 2025 LeadCapture Pro. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
