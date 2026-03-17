typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            LeadCapture Pro
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Start Your 7-Day Free Trial</h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Basic</h3>
            <p className="text-4xl font-bold mb-6">$99<span className="text-lg text-gray-600">/mo</span></p>
            <button className="w-full bg-gray-800 text-white py-3 rounded-lg">
              Select Basic
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-600">
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <p className="text-4xl font-bold mb-6">$149<span className="text-lg text-gray-600">/mo</span></p>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
              Select Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```
