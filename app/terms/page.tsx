export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto prose prose-invert prose-blue">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Last updated: March 1, 2025</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
          <p className="text-slate-400 leading-relaxed">
            All software, algorithms, AI models, branding, content, and intellectual property comprising LeadCapture Pro are proprietary and owned exclusively by LeadCapture Pro and its parent company. Unauthorized reproduction, distribution, or use is strictly prohibited.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">TCPA Compliance Obligations</h2>
          <p className="text-slate-400 leading-relaxed">
            Users of LeadCapture Pro are solely responsible for ensuring their use of the platform complies with the Telephone Consumer Protection Act (TCPA) and all other applicable laws. This includes obtaining proper consent from customers before sending automated text messages.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Prohibited Uses</h2>
          <p className="text-slate-400 leading-relaxed">
            You may not use LeadCapture Pro for any illegal purpose, to send spam, or to harass individuals. We reserve the right to terminate accounts that violate these terms.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Dispute Resolution</h2>
          <p className="text-slate-400 leading-relaxed">
            Any disputes arising from the use of LeadCapture Pro shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
          <p className="text-slate-400 leading-relaxed">
            These terms shall be governed by and construed in accordance with the laws of the State of Alabama, without regard to its conflict of law principles.
          </p>
        </section>
      </div>
    </div>
  );
}
