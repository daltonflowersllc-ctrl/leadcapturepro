import Link from "next/link";

export const metadata = {
  title: "Terms of Service | LeadCapture Pro",
  description: "Terms of Service for LeadCapture Pro, including trial terms, billing, cancellation, and SMS consent.",
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-500 text-sm">Effective Date: January 1, 2025 &nbsp;|&nbsp; Last Updated: January 1, 2025</p>
        </div>

        <div className="space-y-10 text-slate-400 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("Customer,"
              "you," or "your") and LeadCapture Pro ("Company," "we," "us," or "our") governing your access
              to and use of the LeadCapture Pro platform, website, APIs, and all associated services
              (collectively, the "Service").
            </p>
            <p className="mt-3">
              By creating an account, starting a free trial, or using any part of the Service, you confirm
              that you have read, understood, and agree to be bound by these Terms. If you are using the
              Service on behalf of a business, you represent that you have authority to bind that business
              to these Terms.
            </p>
            <p className="mt-3">
              If you do not agree to these Terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p>
              LeadCapture Pro provides a SaaS platform that automatically detects missed calls to your
              configured business phone number and sends automated SMS messages to callers to capture
              lead information. Features include:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Missed call detection via phone number integration</li>
              <li>Automated outbound SMS to missed callers</li>
              <li>Lead capture forms delivered via SMS link</li>
              <li>Lead management dashboard</li>
              <li>SMS notifications for new leads</li>
              <li>Multi-location and team features (depending on plan)</li>
            </ul>
            <p className="mt-3">
              We reserve the right to modify, suspend, or discontinue any feature of the Service at any
              time with reasonable notice.
            </p>
          </section>

          <section>
            <div className="p-6 bg-blue-950 border border-blue-800 rounded-2xl mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">3. Free Trial Terms</h2>
              <p className="text-blue-200 text-sm font-medium">Important — Please read this section carefully.</p>
            </div>

            <h3 className="text-base font-semibold text-slate-200 mb-2">3.1 Trial Period</h3>
            <p>
              New customers are offered a <strong className="text-white">7-day free trial</strong> of the
              Service upon creating an account and providing valid payment information. The trial begins on
              the date your account is created ("Trial Start Date").
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">3.2 Credit Card Required</h3>
            <p>
              A valid credit card or other accepted payment method is required to start the free trial.
              Your payment method will be authorized but <strong className="text-white">not charged</strong> during
              the 7-day trial period.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">3.3 Automatic Billing on Day 8</h3>
            <p>
              Unless you cancel your account before 11:59 PM UTC on the last day of your trial (Day 7),
              your payment method will be automatically charged on{" "}
              <strong className="text-white">Day 8</strong> for the full subscription price of your
              selected plan. By providing your payment information and starting a trial, you expressly
              authorize this automatic charge.
            </p>
            <div className="mt-4 p-4 bg-slate-900 border border-amber-700/50 rounded-xl">
              <p className="text-amber-400 text-sm">
                <strong>Notice:</strong> To avoid being charged, you must cancel before your trial ends.
                Cancellation instructions are in Section 6. We do not send a separate reminder email
                before your trial converts, so please mark your calendar.
              </p>
            </div>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">3.4 One Trial Per Customer</h3>
            <p>
              The free trial is available once per customer and once per business entity. Creating multiple
              accounts to obtain additional free trials is prohibited and may result in termination of all
              associated accounts.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">3.5 Trial Limitations</h3>
            <p>
              During the trial period, you have access to the full features of your selected plan. We
              reserve the right to limit usage (e.g., SMS volume) during the trial at our discretion to
              prevent abuse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Billing and Payment</h2>

            <h3 className="text-base font-semibold text-slate-200 mb-2">4.1 Subscription Billing</h3>
            <p>
              After the trial converts (Day 8), your subscription is billed on a recurring basis —
              monthly or annually, depending on the plan you selected. Billing occurs on the same
              calendar date each month (or year) as your initial charge date.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">4.2 Payment Method</h3>
            <p>
              You must maintain a valid payment method on file. If a payment fails, we will retry the
              charge up to three times over seven days. If payment cannot be collected, your account
              may be suspended and access to the Service interrupted until the outstanding balance
              is resolved.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">4.3 Price Changes</h3>
            <p>
              We may change subscription pricing with at least 30 days' advance notice via email.
              Price changes take effect at your next billing cycle following the notice period.
              Continued use of the Service after a price change constitutes acceptance of the new pricing.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">4.4 Taxes</h3>
            <p>
              Prices are exclusive of applicable taxes. You are responsible for all sales, use, GST,
              VAT, or similar taxes arising from your use of the Service.
            </p>
          </section>

          <section>
            <div className="p-6 bg-red-950 border border-red-800 rounded-2xl mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">5. Refund Policy</h2>
              <p className="text-red-200 text-sm font-medium">No Refunds After Trial — Please read carefully.</p>
            </div>

            <h3 className="text-base font-semibold text-slate-200 mb-2">5.1 No Refunds After Trial Conversion</h3>
            <p>
              <strong className="text-white">ALL CHARGES AFTER THE FREE TRIAL ARE FINAL AND NON-REFUNDABLE.</strong>{" "}
              Once your trial converts to a paid subscription and your payment method is charged, we do not
              issue refunds for any reason, including but not limited to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Forgetting to cancel before the trial ended</li>
              <li>Partial use of the subscription period</li>
              <li>Dissatisfaction with the Service</li>
              <li>Unused features or SMS credits</li>
              <li>Downgrading your plan mid-cycle</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">5.2 Exception for Service Outages</h3>
            <p>
              If we experience a verified, widespread service outage of 24 consecutive hours or more that
              prevents you from using the core Service features, we may, at our sole discretion, provide
              a pro-rated service credit (not a cash refund) for the affected period. Credits are applied
              to future billing cycles and have no cash value.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">5.3 Chargebacks</h3>
            <p>
              Initiating a chargeback or payment dispute for charges that comply with these Terms is a
              breach of this agreement. We reserve the right to suspend or terminate accounts where a
              chargeback has been filed and to recover any associated fees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Cancellation Policy</h2>

            <h3 className="text-base font-semibold text-slate-200 mb-2">6.1 How to Cancel</h3>
            <p>
              You may cancel your subscription at any time by:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Navigating to <strong className="text-slate-300">Dashboard → Settings → Billing</strong> and clicking "Cancel Subscription," or</li>
              <li>Contacting our support team at{" "}
                <a href="mailto:support@leadcapturepro.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  support@leadcapturepro.com
                </a>
              </li>
            </ul>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">6.2 Effect of Cancellation</h3>
            <p>
              Cancellation takes effect at the end of your current billing period. You retain access to
              the Service through the end of the period for which you have paid. No partial refunds are
              issued for the remaining days in a billing cycle.
            </p>
            <p className="mt-3">
              Upon cancellation, your account, lead data, and phone number configuration will be
              retained for 30 days before permanent deletion, giving you an opportunity to export
              your data.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">6.3 Cancellation During Trial</h3>
            <p>
              If you cancel during the 7-day free trial, your account will be closed immediately and
              you will not be charged. Any leads collected during the trial remain accessible until
              your account is deleted.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">6.4 Termination by LeadCapture Pro</h3>
            <p>
              We reserve the right to suspend or terminate your account immediately, without notice or
              refund, if you violate these Terms, engage in abusive or fraudulent behavior, or use the
              Service in a manner that harms other users or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. SMS Consent and Compliance</h2>

            <h3 className="text-base font-semibold text-slate-200 mb-2">7.1 Your SMS Program</h3>
            <p>
              By using LeadCapture Pro, you are operating an SMS messaging program directed to individuals
              who have called your business phone number. You are the "sender" for purposes of the Telephone
              Consumer Protection Act (TCPA), the CAN-SPAM Act, and other applicable messaging regulations.
              LeadCapture Pro acts solely as a technology platform and messaging intermediary.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">7.2 Your Compliance Obligations</h3>
            <p>You agree that you will:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Comply with all applicable federal and state laws governing commercial SMS messaging, including the TCPA</li>
              <li>Only send messages to individuals who have a legitimate expectation of follow-up from your business</li>
              <li>Include clear identification of your business in all messages</li>
              <li>Honor all STOP/UNSUBSCRIBE requests within one business day</li>
              <li>Not send messages that are deceptive, harassing, or in violation of any law</li>
              <li>Maintain records of your SMS program as required by applicable regulations</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">7.3 Default Opt-Out Language</h3>
            <p>
              All automated SMS messages sent through the platform include opt-out instructions (e.g.,
              "Reply STOP to stop receiving messages"). We automatically process STOP requests and suppress
              further messages to opted-out numbers. You must not circumvent or override this opt-out
              functionality.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">7.4 Message and Data Rates</h3>
            <p>
              Standard message and data rates may apply to recipients of SMS messages. This disclosure
              must be included in your lead capture materials where required by law.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">7.5 Indemnification for SMS Violations</h3>
            <p>
              You agree to indemnify and hold harmless LeadCapture Pro from any claims, fines, penalties,
              or damages arising from your failure to comply with SMS messaging laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Send spam, unsolicited commercial messages, or messages to purchased contact lists</li>
              <li>Impersonate any person or entity</li>
              <li>Transmit illegal, harmful, threatening, abusive, or defamatory content</li>
              <li>Violate any applicable law or regulation</li>
              <li>Reverse engineer, decompile, or attempt to extract source code from the Service</li>
              <li>Resell or sublicense access to the Service without our written consent</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Circumvent any security or access control measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Intellectual Property</h2>
            <p>
              The Service, including its software, design, content, and branding, is owned by LeadCapture Pro
              and protected by intellectual property laws. These Terms do not grant you any rights to our
              trademarks, logos, or proprietary technology.
            </p>
            <p className="mt-3">
              You retain ownership of the lead data and business information you input into the Service.
              You grant us a limited license to store, process, and display that data solely to provide
              the Service to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Disclaimer of Warranties</h2>
            <p className="uppercase text-sm tracking-wide">
              The service is provided "as is" and "as available" without warranties of any kind, express
              or implied, including but not limited to warranties of merchantability, fitness for a
              particular purpose, and non-infringement. We do not warrant that the service will be
              uninterrupted, error-free, or free of viruses or other harmful components. We do not
              guarantee any specific number of leads, call detections, or SMS delivery rates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">11. Limitation of Liability</h2>
            <p className="uppercase text-sm tracking-wide">
              To the maximum extent permitted by applicable law, LeadCapture Pro's total cumulative
              liability to you for any claims arising from or related to these terms or the service
              shall not exceed the amounts you paid to us in the three (3) months immediately preceding
              the claim. In no event shall we be liable for any indirect, incidental, special,
              consequential, or punitive damages, including lost profits, lost data, or business
              interruption, even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">12. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless LeadCapture Pro and its officers,
              directors, employees, and agents from and against any claims, damages, losses, liabilities,
              and expenses (including attorneys' fees) arising out of or related to: (a) your use of the
              Service; (b) your violation of these Terms; (c) your violation of any law or the rights of
              any third party; or (d) the content of SMS messages you send through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">13. Governing Law and Disputes</h2>
            <p>
              These Terms are governed by the laws of the State of Delaware, without regard to conflict
              of law principles. Any dispute arising from these Terms or your use of the Service shall
              be resolved through binding arbitration administered under the American Arbitration
              Association's Commercial Arbitration Rules, except that either party may seek injunctive
              relief in a court of competent jurisdiction for intellectual property violations.
            </p>
            <p className="mt-3">
              You waive your right to participate in a class action lawsuit or class-wide arbitration
              against LeadCapture Pro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">14. Changes to These Terms</h2>
            <p>
              We may update these Terms at any time. We will notify you of material changes by email
              and by updating the "Last Updated" date at the top of this page. Your continued use of
              the Service after changes become effective constitutes acceptance of the revised Terms.
              If you do not agree to the revised Terms, you must cancel your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">15. Miscellaneous</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-slate-300">Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and LeadCapture Pro regarding the Service.</li>
              <li><strong className="text-slate-300">Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force.</li>
              <li><strong className="text-slate-300">Waiver:</strong> Our failure to enforce any right or provision does not constitute a waiver of that right or provision.</li>
              <li><strong className="text-slate-300">Assignment:</strong> You may not assign your rights under these Terms without our written consent. We may assign our rights freely.</li>
              <li><strong className="text-slate-300">Force Majeure:</strong> We are not liable for delays or failures caused by events beyond our reasonable control.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">16. Contact Us</h2>
            <p>Questions about these Terms should be directed to:</p>
            <div className="mt-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
              <p className="text-slate-300 font-medium">LeadCapture Pro — Legal</p>
              <p className="mt-1">
                Email:{" "}
                <a href="mailto:legal@leadcapturepro.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  legal@leadcapturepro.com
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
