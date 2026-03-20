"use client";
import React from "react";
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">LeadCapture Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Log in
              </Link>
              <Link
                href="/subscribe"
                className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🔥 Trusted by 500+ Home Service Pros
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            Never Lose Another Lead<br />to a Missed Call
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            LeadCapture Pro automatically captures every missed call, sends an SMS with a quick form, 
            and delivers the lead straight to your phone. Perfect for plumbers, electricians, HVAC techs, 
            and home service businesses.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-10">
            <div>
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-gray-600">Leads Captured</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">$2.5M+</div>
              <div className="text-sm text-gray-600">Revenue Saved</div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              href="/subscribe"
              className="bg-secondary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition shadow-lg"
            >
              Start 7-Day Free Trial
            </Link>
            <a
              href="#how-it-works"
              className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary hover:bg-gray-50 transition"
            >
              How It Works
            </a>
          </div>
          <div className="flex justify-center items-center space-x-4 mt-6 text-sm text-gray-500">
            <span>💳 Credit card required</span>
            <span>•</span>
            <span>⏰ Cancel before day 8</span>
            <span>•</span>
            <span>🔒 256-bit SSL</span>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Three simple steps to never miss another lead
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-secondary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Missed Call</h3>
              <p className="text-gray-600">Customer calls while you're on another job. We detect it instantly.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto-SMS Sent</h3>
              <p className="text-gray-600">Customer gets a text with a quick form to describe their needs.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-secondary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lead Delivered</h3>
              <p className="text-gray-600">You get an SMS alert and the lead appears in your dashboard.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-4">
            Everything You Need to Capture Every Lead
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Powerful features designed specifically for home service businesses
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Missed Call Capture</h3>
              <p className="text-gray-600">Automatically detect missed calls and trigger instant SMS responses.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Lead Form</h3>
              <p className="text-gray-600">Callers fill out a quick form with their details and reason for calling.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Alerts</h3>
              <p className="text-gray-600">Get SMS notifications when new leads come in.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lead Dashboard</h3>
              <p className="text-gray-600">View and manage all your leads in one place.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Basic Analytics</h3>
              <p className="text-gray-600">Track your lead capture over time.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security with 99.9% uptime.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose the plan that's right for your business. All plans require a credit card for the 7-day trial.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-primary mb-2">Basic</h3>
              <p className="text-4xl font-bold mb-2">$199</p>
              <p className="text-gray-600 mb-4">per month</p>
              <p className="text-sm text-green-600 mb-6">or $1,990/year (save $398)</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Missed Call Capture
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Auto-SMS to Callers
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Lead Dashboard
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  SMS Notifications
                </li>
              </ul>
              <Link
                href="/subscribe?plan=basic"
                className="block text-center bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                Start 7-Day Trial
              </Link>
              <p className="text-xs text-center text-gray-500 mt-3">
                Credit card required
              </p>
            </div>

            {/* Pro Card - Featured */}
            <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-secondary relative transform scale-105">
              <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-1 text-sm font-bold rounded-bl-lg rounded-tr-lg">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-2">$299</p>
              <p className="text-gray-600 mb-4">per month</p>
              <p className="text-sm text-green-600 mb-6">or $2,990/year (save $598)</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Everything in Basic
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom SMS Templates
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Lead Scoring
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority Support
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Team Access (2 users)
                </li>
              </ul>
              <Link
                href="/subscribe?plan=pro"
                className="block text-center bg-secondary text-white py-3 rounded-lg hover:bg-blue-600 transition"
              >
                Start 7-Day Trial
              </Link>
              <p className="text-xs text-center text-gray-500 mt-3">
                Credit card required
              </p>
            </div>

            {/* Elite Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-primary mb-2">Elite</h3>
              <p className="text-4xl font-bold mb-2">$499</p>
              <p className="text-gray-600 mb-4">per month</p>
              <p className="text-sm text-green-600 mb-6">or $4,990/year (save $998)</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Everything in Pro
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Calendar Integration
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  API Access
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom Branding
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Dedicated Account Manager
                </li>
              </ul>
              <Link
                href="/subscribe?plan=elite"
                className="block text-center bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Start 7-Day Trial
              </Link>
              <p className="text-xs text-center text-gray-500 mt-3">
                Credit card required
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            All plans include a 7-day trial. Your card will be charged on day 8. Cancel anytime before then.
          </p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Trusted by Home Service Pros
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-secondary">MP</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Mike's Plumbing</div>
                  <div className="text-sm text-gray-500">Mike Peterson</div>
                </div>
              </div>
              <p className="text-gray-600">
                "I was losing at least 5 calls a week. LeadCapture Pro paid for itself in the first day. Now I never miss a lead!"
              </p>
              <div className="flex mt-4">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-secondary">SE</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Spark Electric</div>
                  <div className="text-sm text-gray-500">Tom Wilson</div>
                </div>
              </div>
              <p className="text-gray-600">
                "Setup took 5 minutes. Now every missed call turns into a lead. Best investment I've made for my business."
              </p>
              <div className="flex mt-4">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-secondary">AC</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold">CoolAir HVAC</div>
                  <div className="text-sm text-gray-500">Sarah Chen</div>
                </div>
              </div>
              <p className="text-gray-600">
                "During our busy season, we were missing 10+ calls a day. LeadCapture Pro captures every single one. Game changer!"
              </p>
              <div className="flex mt-4">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Start Capturing Every Lead Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of home service businesses never missing another lead.
          </p>
          <Link
            href="/subscribe"
            className="bg-secondary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition inline-block"
          >
            Start Your 7-Day Free Trial
          </Link>
          <p className="mt-4 text-sm opacity-75">
            💳 Credit card required • Cancel before day 8 • No refunds after trial
          </p>
        </div>
      </div>

      {/* Footer */}
<footer className="bg-gray-900 text-white py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-lg font-bold mb-4">LeadCapture Pro</h3>
        <p className="text-gray-400 text-sm">
          Never lose another lead to a missed call.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Product</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="/subscribe">Free Trial</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Company</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><a href="#">About</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Legal</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><a href="#">Terms</a></li>
          <li><a href="#">Privacy</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
      © 2026 LeadCapture Pro. All rights reserved.  {/* ← CHANGE THIS TO 2026 */}
    </div>
  </div>
</footer>
