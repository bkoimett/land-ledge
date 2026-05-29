"use client";

import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 md:px-16 max-w-[1440px] mx-auto">
      <div className="bg-[#0f172a] rounded-xl p-12 text-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight relative z-10">
          Ready to Secure the Future of Property?
        </h2>
        <p className="text-lg text-[#bbcabf] max-w-2xl mx-auto mb-8 relative z-10">
          Join the blockchain land registry revolution. Every transaction is cryptographically verified and permanently recorded.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <Link href="/dashboard">
            <button className="bg-[#006c49] text-white px-8 py-3 rounded-lg font-mono text-xs tracking-widest uppercase hover:bg-[#005236] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
              Try Management Console
              <span className="text-sm">→</span>
            </button>
          </Link>
          <a 
            href="mailto:contact@ardhichain.com"
            className="border border-[#bbcabf] text-white px-8 py-3 rounded-lg font-mono text-xs tracking-widest uppercase hover:bg-[#3c4a42] transition-all"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
}