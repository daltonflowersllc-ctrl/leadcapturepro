typescript
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-800">LeadCapture Pro</span>
            <Link href="/subscribe" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Never Lose Another Lead<br />to a Missed Call
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Automatically capture every missed call and turn them into booked jobs.
        </p>
        <Link href="/subscribe" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg">
          Start 7-Day Free Trial
        </Link>
      </div>
    </div>
  )
}
```
