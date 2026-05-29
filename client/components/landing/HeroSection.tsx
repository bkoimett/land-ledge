"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[819px] flex flex-col items-center justify-center text-center px-4 md:px-16 pt-12 pb-32 overflow-hidden">
      {/* Background Gradient Blobs */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#10b981]/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#6366f1]/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 text-[#006c49] mb-6 border border-[#10b981]/20">
          <span className="pulse-emerald block w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span className="font-mono text-xs tracking-widest uppercase">LIVE ON POLYGON AMOY TESTNET</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-[#191c1e] mb-4 tracking-tight">
          Redefining Trust in <span className="text-[#006c49] italic">Land Ownership</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-[#3c4a42] max-w-2xl mx-auto mb-8">
          ArdhiChain provides immutable, cryptographically-secure land registry on the blockchain. 
          Every transaction is verified, every record is permanent.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <button className="w-full md:w-auto px-8 py-3 bg-[#0f172a] text-white rounded-xl font-mono text-xs tracking-widest uppercase hover:bg-[#1e293b] shadow-lg transition-all active:scale-95">
              Explore Registry
            </button>
          </Link>
          <a href="https://docs.ardhichain.com" target="_blank" rel="noopener noreferrer">
            <button className="w-full md:w-auto px-8 py-3 bg-white border border-[#bbcabf] text-[#191c1e] rounded-xl font-mono text-xs tracking-widest uppercase hover:bg-[#f2f4f6] transition-all">
              View Documentation
            </button>
          </a>
        </div>
      </div>

      {/* Dashboard Preview Card */}
      <div className="mt-12 relative z-10 w-full max-w-5xl mx-auto px-4">
        <div className="tonal-layer-1 rounded-2xl p-2 overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-white border border-[#bbcabf] shadow-xl">
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#f7f9fb] via-[#f2f4f6] to-[#eceef0] relative overflow-hidden">
            {/* Mock Dashboard Preview UI */}
            <div className="absolute inset-0 p-6 flex flex-col">
              {/* Mock Navbar */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#bbcabf]/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#10b981]/20"></div>
                  <div className="h-3 w-32 bg-[#10b981]/20 rounded"></div>
                </div>
                <div className="flex gap-4">
                  <div className="h-6 w-16 bg-[#e0e3e5] rounded"></div>
                  <div className="h-6 w-16 bg-[#e0e3e5] rounded"></div>
                </div>
              </div>
              
              {/* Mock Dual Forms */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="bg-white/50 rounded-lg p-4 border border-[#bbcabf]/30">
                  <div className="h-4 w-32 bg-[#10b981]/20 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-[#e0e3e5] rounded"></div>
                    <div className="h-8 bg-[#e0e3e5] rounded"></div>
                    <div className="h-8 bg-[#e0e3e5] rounded"></div>
                  </div>
                </div>
                <div className="bg-white/50 rounded-lg p-4 border border-[#bbcabf]/30">
                  <div className="h-4 w-32 bg-[#a43a3a]/20 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-[#e0e3e5] rounded"></div>
                    <div className="h-8 bg-[#e0e3e5] rounded"></div>
                    <div className="h-8 bg-[#e0e3e5] rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Mock Stats Bar */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                <div className="h-12 bg-[#e0e3e5]/50 rounded"></div>
                <div className="h-12 bg-[#e0e3e5]/50 rounded"></div>
                <div className="h-12 bg-[#e0e3e5]/50 rounded"></div>
                <div className="h-12 bg-[#e0e3e5]/50 rounded"></div>
              </div>
            </div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent pointer-events-none"></div>
            
            {/* Preview Badge */}
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-mono z-10">
              Registry Dashboard Preview
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}