export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto prose prose-invert prose-blue">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Effective date: March 1, 2025</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">TCPA Compliance</h2>
          <p className="text-slate-400 leading-relaxed">
            LeadCapture Pro is committed to helping our users maintain compliance with the Telephone Consumer Protection Act (TCPA). Our platform includes built-in features to manage consumer consent and opt-out requests. However, users are ultimately responsible for ensuring their use of the platform complies with all applicable laws.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">SMS Consent and Opt-Out</h2>
          <p className="text-slate-400 leading-relaxed">
            By using LeadCapture Pro, you agree to obtain proper consent from your customers before sending them automated text messages. Our system automatically appends "Reply STOP to opt out" to initial messages. When a customer replies STOP, our system will immediately cease all automated communication to that number.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Data Retention Policy</h2>
          <p className="text-slate-400 leading-relaxed">
            We retain lead data, call logs, and AI-generated content for as long as your account is active or as needed to provide you services. We may also retain and use this information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">California CCPA Rights</h2>
          <p className="text-slate-400 leading-relaxed">
            If you are a California resident, you have the right to request access to the personal information we have collected about you, request that we delete your personal information, and opt-out of the sale of your personal information. To exercise these rights, please contact us at support@leadcapturepro.app.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
          <p className="text-slate-400 leading-relaxed">
            All data is stored securely in the United States using industry-standard encryption. We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
          </p>
        </section>
      </div>
    </div>
  );
}
