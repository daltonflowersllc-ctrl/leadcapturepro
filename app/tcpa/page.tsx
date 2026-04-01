export default function TCPAPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto prose prose-invert prose-blue">
        <h1 className="text-4xl font-bold text-white mb-8">TCPA Compliance Guide</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">What is TCPA?</h2>
          <p className="text-slate-400 leading-relaxed">
            The Telephone Consumer Protection Act (TCPA) is a federal law that regulates telemarketing calls, auto-dialed calls, prerecorded calls, and text messages. It is designed to protect consumers from unwanted solicitations.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">How LeadCapture Pro Helps</h2>
          <p className="text-slate-400 leading-relaxed">
            LeadCapture Pro includes several features to help contractors stay compliant:
          </p>
          <ul className="list-disc pl-6 text-slate-400 space-y-2">
            <li>Automated opt-out handling (Reply STOP).</li>
            <li>Clear disclosure in initial text messages.</li>
            <li>Consent logging for all leads captured via smart forms.</li>
            <li>Time-of-day restrictions for automated messages.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">SMS Consent Requirements</h2>
          <p className="text-slate-400 leading-relaxed">
            Before sending automated text messages, you must obtain "prior express written consent" from the consumer. This can be done via a checkbox on your website or a clear statement in your initial communication.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Opt-Out Handling</h2>
          <p className="text-slate-400 leading-relaxed">
            LeadCapture Pro automatically handles opt-out requests. If a customer replies with STOP, QUIT, CANCEL, or UNSUBSCRIBE, our system will immediately stop all automated messages to that number.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Best Practices for Contractors</h2>
          <ul className="list-disc pl-6 text-slate-400 space-y-2">
            <li>Always identify your business in the first message.</li>
            <li>Only send messages during normal business hours (8 AM to 9 PM local time).</li>
            <li>Honor all opt-out requests immediately.</li>
            <li>Keep records of consent for at least four years.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
