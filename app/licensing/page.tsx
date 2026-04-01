export default function LicensingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto prose prose-invert prose-blue">
        <h1 className="text-4xl font-bold text-white mb-8">Intellectual Property and Licensing</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Proprietary Software</h2>
          <p className="text-slate-400 leading-relaxed">
            All software, algorithms, AI models, branding, content and intellectual property comprising LeadCapture Pro are proprietary and owned exclusively by LeadCapture Pro and its parent company. Unauthorized reproduction, distribution or use is strictly prohibited.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Software License Terms</h2>
          <p className="text-slate-400 leading-relaxed">
            LeadCapture Pro grants you a limited, non-exclusive, non-transferable, and revocable license to use our software for your business purposes, subject to these terms and your subscription plan. You may not reverse engineer, decompile, or attempt to extract the source code of our software.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">API Usage Terms</h2>
          <p className="text-slate-400 leading-relaxed">
            For users on the Elite tier, access to our API is provided for integration with your existing business systems. API usage is subject to rate limits and must not be used to scrape data or build competing products.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Contact for Licensing Inquiries</h2>
          <p className="text-slate-400 leading-relaxed">
            For any questions regarding licensing, or to request permission for use beyond these terms, please contact our legal department at:
          </p>
          <p className="text-blue-400 font-bold mt-4">legal@leadcapturepro.app</p>
        </section>
      </div>
    </div>
  );
}
