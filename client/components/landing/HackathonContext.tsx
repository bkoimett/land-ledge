"use client";

export default function HackathonContext() {
  return (
    <section className="py-20 px-4 md:px-16 max-w-[1440px] mx-auto">
      <div className="card-panel rounded-xl p-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left: Content */}
          <div className="flex-1">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-[#10b981]/20 text-[#006c49] font-mono text-xs rounded-full">
                HACKATHON BUILD
              </span>
              <span className="px-3 py-1 bg-[#6366f1]/20 text-[#6366f1] font-mono text-xs rounded-full">
                WINNING TRACK
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#191c1e] mb-4 tracking-tight">
              Built for ETHGlobal
            </h2>
            <p className="text-base text-[#3c4a42] mb-6">
              ArdhiChain was developed as part of the ETHGlobal hackathon, 
              focusing on real-world asset tokenization and land registry solutions.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-xs text-[#3c4a42] uppercase tracking-widest mb-1">Track</p>
                <p className="font-mono text-sm text-[#191c1e]">DeFi & Real World Assets</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#3c4a42] uppercase tracking-widest mb-1">Location</p>
                <p className="font-mono text-sm text-[#191c1e]">Nairobi, Kenya</p>
              </div>
            </div>
          </div>

          {/* Right: Image placeholder */}
          <div className="flex-1 w-full aspect-[4/3] bg-gradient-to-br from-[#10b981]/20 to-[#6366f1]/20 rounded-xl flex items-center justify-center">
            <span className="font-mono text-sm text-[#3c4a42]">Hackathon Visual</span>
          </div>
        </div>
      </div>
    </section>
  );
}