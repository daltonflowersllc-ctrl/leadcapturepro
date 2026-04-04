'use client';

import Link from 'next/link';

export default function ReactivatePage() {
  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Your Account Has Been Suspended</h1>
        <p className="text-slate-400 mb-8">
          Your subscription was canceled due to non-payment or manual cancellation. 
          Please reactivate your account to continue capturing leads.
        </p>

        <div className="space-y-4">
          <Link 
            href="/subscribe"
            className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Reactivate Account
          </Link>
          
          <div className="pt-4 border-t border-slate-800">
            <p className="text-sm text-slate-500 mb-4">
              Need help? Contact <a href="mailto:support@leadcapturepro.app" className="text-blue-400 hover:underline">support@leadcapturepro.app</a>
            </p>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
