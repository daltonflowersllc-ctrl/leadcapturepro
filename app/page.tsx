"use client";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">LeadCapture Pro</span>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600">Log in</Link>
            <Link href="/subscribe" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Start Free Trial</Link>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Never Lose Another Lead to a Missed Call</h1>
        <p className="text-xl text-gray-600 mb-8">LeadCapture Pro automatically captures every missed call, sends an SMS, and delivers the lead straight to your phone.</p>
        <Link href="/subscribe" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold">Start 7-Day Free Trial</Link>
      </div>
    </div>
  );
}
