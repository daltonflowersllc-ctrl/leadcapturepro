'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';

const posts = [
  {
    id: 1,
    title: "The $45,600 Problem: How Missed Calls Are Silently Killing Your Home Service Business",
    preview: "If you miss just one call per day at an average job value of $400, that's $145,600 in lost annual revenue. Most contractors have no idea how much they're losing...",
    date: "March 15, 2025",
    category: "Business Growth",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "How to Set Up Conditional Call Forwarding on AT&T, Verizon, T-Mobile and More",
    preview: "Setting up call forwarding the right way takes 30 seconds and can mean the difference between capturing every lead or losing them to a competitor...",
    date: "March 18, 2025",
    category: "Setup Guide",
    readTime: "3 min",
  },
  {
    id: 3,
    title: "AI Lead Scoring Explained: How to Know Which Leads to Call First",
    preview: "Not all leads are created equal. An emergency roof leak at 9pm is not the same as someone casually asking about lawn maintenance. Here is how AI scoring works...",
    date: "March 20, 2025",
    category: "AI Features",
    readTime: "4 min",
  },
  {
    id: 4,
    title: "The Contractor's Guide to Never Losing a Lead Again",
    preview: "Top-performing contractors share one trait: they respond to every lead within 5 minutes. Here is how to build a system that does it automatically...",
    date: "March 22, 2025",
    category: "Best Practices",
    readTime: "6 min",
  },
  {
    id: 5,
    title: "Why Missed Call Text Back Software is the #1 Tool for Home Service Businesses in 2025",
    preview: "97% of people who call a business and don't get an answer will call a competitor if they don't hear back within 5 minutes. Here is the data...",
    date: "March 25, 2025",
    category: "Industry Insights",
    readTime: "4 min",
  },
  {
    id: 6,
    title: "How to Close More Jobs by Using AI Call Scripts",
    preview: "Walking into a callback call blind is the #1 reason contractors lose jobs to competitors. AI call scripts give you exactly what to say before you dial...",
    date: "March 28, 2025",
    category: "Sales Tips",
    readTime: "5 min",
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Contractor Growth Blog</h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Expert advice on lead capture, AI automation, and scaling your home service business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {posts.map((post) => (
            <article key={post.id} className="group p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-slate-600 text-xs font-medium">{post.readTime} read</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="text-slate-400 mb-8 flex-grow leading-relaxed">
                {post.preview}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-slate-500 text-sm">{post.date}</span>
                <Link href="#" className="text-blue-400 font-bold text-sm hover:text-blue-300 transition-colors flex items-center gap-1">
                  Read Article
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
          <h2 className="text-3xl font-bold text-white mb-4 relative">Get Growth Tips in Your Inbox</h2>
          <p className="text-blue-100 mb-8 relative">Join 2,000+ contractors who get our weekly guide to capturing more leads.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
