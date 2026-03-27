import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | LeadCapture Pro",
  description: "Privacy Policy for LeadCapture Pro — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold text-white text-lg hover:text-blue-400 transition-colors">
            LeadCapture Pro
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Effective Date: January 1, 2025 &nbsp;|&nbsp; Last Updated: January 1, 2025</p>
        </div>

        <div className="space-y-10 text-slate-400 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
            <p>
              LeadCapture Pro ("we," "us," or "our") operates a SaaS platform that helps home service businesses
              capture leads from missed calls via automated SMS messaging. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our website and services
              (collectively, the "Service").
            </p>
            <p className="mt-3">
              By using the Service, you agree to the collection and use of information in accordance with this
              policy. If you do not agree, please discontinue use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>

            <h3 className="text-base font-semibold text-slate-200 mb-2">2.1 Account Information</h3>
            <p>When you register for an account, we collect:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Name and email address</li>
              <li>Business name and contact information</li>
              <li>Password (stored as a one-way hash; never stored in plaintext)</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">2.2 Phone Numbers and SMS Data</h3>
            <p>
              Our core service involves telephony. We collect and process:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Your business phone number(s) provisioned through or connected to our platform</li>
              <li>Phone numbers of callers who reach your business line</li>
              <li>SMS message content sent to and from callers via our automated system</li>
              <li>Call logs including timestamps, duration, and missed-call events</li>
              <li>Lead information submitted by callers through SMS-linked capture forms (name, phone number, job description)</li>
            </ul>
            <p className="mt-3">
              SMS messaging is provided through Twilio, Inc. Caller phone numbers and message content are transmitted
              to Twilio for delivery. Twilio's privacy practices are described at
              {" "}<span className="text-blue-400">twilio.com/legal/privacy</span>.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">2.3 Payment Information</h3>
            <p>
              All payment processing is handled by Stripe, Inc. We do not store your full credit card number,
              CVV, or bank account details on our servers. We receive and store:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Stripe Customer ID and Subscription ID</li>
              <li>Last four digits of the card on file (provided by Stripe)</li>
              <li>Billing address (if provided)</li>
              <li>Subscription status, plan tier, and billing cycle</li>
              <li>Payment history and invoice records</li>
            </ul>
            <p className="mt-3">
              Stripe's privacy policy is available at{" "}
              <span className="text-blue-400">stripe.com/privacy</span>.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">2.4 Usage and Technical Data</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>IP addresses and browser user-agent strings</li>
              <li>Pages viewed and features used within the dashboard</li>
              <li>Device type and operating system</li>
              <li>Referring URL and session duration</li>
              <li>Error logs and diagnostic data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Provide, operate, and maintain the Service</li>
              <li>Process payments and manage your subscription</li>
              <li>Send automated SMS messages to callers on your behalf</li>
              <li>Deliver lead data to your dashboard and notify you of new leads</li>
              <li>Respond to support requests and troubleshoot issues</li>
              <li>Send transactional emails (receipts, billing alerts, trial expiration notices)</li>
              <li>Detect and prevent fraud, abuse, or unauthorized access</li>
              <li>Improve and develop new features based on aggregate usage patterns</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information or the personal information of your callers to third parties.
              We do not use caller phone numbers for our own marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. SMS Messaging and TCPA Compliance</h2>
            <p>
              LeadCapture Pro sends automated SMS messages to individuals who call your business phone number
              and do not reach a live answer. By using this feature, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>
                You have a legitimate business relationship with callers and a legally sufficient basis to send
                them follow-up SMS messages under applicable law, including the Telephone Consumer Protection
                Act (TCPA) and any applicable state laws.
              </li>
              <li>
                You will configure the SMS content in compliance with all applicable regulations.
              </li>
              <li>
                You will provide recipients with a clear opt-out mechanism and honor all opt-out requests
                promptly.
              </li>
            </ul>
            <p className="mt-3">
              Our automated SMS messages include opt-out instructions (e.g., "Reply STOP to unsubscribe").
              We honor STOP requests automatically and will not send further messages to numbers that have
              opted out.
            </p>
            <p className="mt-3">
              Message and data rates may apply to recipients depending on their mobile carrier plan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Data Sharing and Disclosure</h2>
            <p>We share your information only in the following circumstances:</p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-4">5.1 Service Providers</h3>
            <p>
              We share data with trusted third-party vendors who assist us in operating the Service:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong className="text-slate-300">Twilio</strong> — SMS delivery and phone number management</li>
              <li><strong className="text-slate-300">Stripe</strong> — Payment processing and subscription billing</li>
              <li><strong className="text-slate-300">Vercel</strong> — Cloud hosting and infrastructure</li>
              <li><strong className="text-slate-300">Vercel Postgres</strong> — Database hosting</li>
            </ul>
            <p className="mt-3">
              These providers are contractually obligated to use your data only as necessary to provide
              services to us and in compliance with applicable law.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-4">5.2 Legal Requirements</h3>
            <p>
              We may disclose your information if required by law, regulation, legal process, or governmental
              request, or to protect the rights, property, or safety of LeadCapture Pro, our users, or others.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-4">5.3 Business Transfers</h3>
            <p>
              In connection with a merger, acquisition, or sale of assets, your information may be transferred.
              We will notify you via email and/or a prominent notice on the Service prior to any such transfer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Data Retention</h2>
            <p>
              We retain your account and lead data for as long as your account is active or as needed to
              provide the Service. Upon account cancellation, we will delete or anonymize your personal data
              within 90 days, except where we are required to retain it for legal, tax, or compliance purposes
              (typically up to 7 years for financial records).
            </p>
            <p className="mt-3">
              Caller phone numbers and SMS message content associated with lead records are retained for
              the life of the account unless you delete individual lead records from your dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Security</h2>
            <p>
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>TLS encryption for all data in transit</li>
              <li>Encrypted storage for sensitive credentials and tokens</li>
              <li>Bcrypt hashing for passwords</li>
              <li>JWT-based authentication with short-lived tokens</li>
              <li>Access controls limiting employee access to customer data</li>
              <li>Regular security reviews</li>
            </ul>
            <p className="mt-3">
              No method of transmission or storage is 100% secure. We cannot guarantee absolute security,
              but we are committed to protecting your information using commercially reasonable means.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Your Rights and Choices</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong className="text-slate-300">Access</strong> — Request a copy of the personal data we hold about you</li>
              <li><strong className="text-slate-300">Correction</strong> — Request correction of inaccurate data</li>
              <li><strong className="text-slate-300">Deletion</strong> — Request deletion of your data (subject to legal retention requirements)</li>
              <li><strong className="text-slate-300">Portability</strong> — Request an export of your lead data in a machine-readable format</li>
              <li><strong className="text-slate-300">Opt-out of marketing</strong> — Unsubscribe from promotional emails at any time via the unsubscribe link</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@leadcapturepro.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                privacy@leadcapturepro.com
              </a>.
              We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Cookies and Tracking</h2>
            <p>
              We use essential cookies and session storage to maintain your authenticated session in the
              dashboard. We do not use third-party advertising trackers or behavioral analytics cookies.
              You may configure your browser to reject cookies, but doing so may impair your ability to
              log in to the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Children's Privacy</h2>
            <p>
              The Service is not directed to individuals under 18 years of age. We do not knowingly collect
              personal information from minors. If we become aware that we have inadvertently collected
              information from a minor, we will promptly delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes
              by sending an email to the address on file and by updating the "Last Updated" date above.
              Continued use of the Service after changes take effect constitutes acceptance of the revised
              policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">12. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
            <div className="mt-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
              <p className="text-slate-300 font-medium">LeadCapture Pro</p>
              <p className="mt-1">
                Email:{" "}
                <a href="mailto:privacy@leadcapturepro.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  privacy@leadcapturepro.com
                </a>
              </p>
              <p className="mt-1">
                Support:{" "}
                <a href="mailto:support@leadcapturepro.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  support@leadcapturepro.com
                </a>
              </p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <span>© 2025 LeadCapture Pro. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
