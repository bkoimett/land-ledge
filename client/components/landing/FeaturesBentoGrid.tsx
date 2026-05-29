"use client";

export default function FeaturesBentoGrid() {
  return (
    <section id="features" className="py-20 px-4 md:px-16 max-w-[1440px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#191c1e] mb-4 tracking-tight">
          Core Features
        </h2>
        <p className="text-lg text-[#3c4a42] max-w-2xl mx-auto">
          Built for transparency, security, and ease of use
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Immutable Registration */}
        <div className="card-panel rounded-xl p-8 flex flex-col">
          <div className="w-12 h-12 bg-[#10b981]/20 rounded-lg flex items-center justify-center mb-6">
            <span className="text-[#006c49] text-2xl">⊞</span>
          </div>
          <h3 className="text-xl font-semibold text-[#191c1e] mb-3">Immutable Registration</h3>
          <p className="text-sm text-[#3c4a42] mb-4">
            Land records are permanently stored on-chain with cryptographic proof. 
            No alterations, no tampering, no disputes.
          </p>
          <ul className="text-xs font-mono text-[#3c4a42] space-y-1 mt-auto">
            <li>• SHA-256 Hash Verification</li>
            <li>• Timestamp Anchoring</li>
            <li>• Multi-signature Support</li>
          </ul>
        </div>

        {/* Seamless Transfers */}
        <div className="card-panel rounded-xl p-8 flex flex-col">
          <div className="w-12 h-12 bg-[#a43a3a]/20 rounded-lg flex items-center justify-center mb-6">
            <span className="text-[#a43a3a] text-2xl">⇄</span>
          </div>
          <h3 className="text-xl font-semibold text-[#191c1e] mb-3">Seamless Transfers</h3>
          <p className="text-sm text-[#3c4a42] mb-4">
            Transfer ownership with a single transaction. 
            All history is preserved and publicly verifiable.
          </p>
          <ul className="text-xs font-mono text-[#3c4a42] space-y-1 mt-auto">
            <li>• One-click Transfers</li>
            <li>• Gasless Meta-transactions</li>
            <li>• Instant Confirmation</li>
          </ul>
        </div>

        {/* Visual Provenance */}
        <div className="card-panel rounded-xl p-8 flex flex-col">
          <div className="w-12 h-12 bg-[#6366f1]/20 rounded-lg flex items-center justify-center mb-6">
            <span className="text-[#6366f1] text-2xl">⧖</span>
          </div>
          <h3 className="text-xl font-semibold text-[#191c1e] mb-3">Visual Provenance</h3>
          <p className="text-sm text-[#3c4a42] mb-4">
            Track the complete ownership history with our 
            cryptographic timeline visualization.
          </p>
          <div className="mt-auto pt-4 border-t border-[#bbcabf]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#006c49] rounded-full" />
              <span className="font-mono text-xs text-[#3c4a42]">Genesis Registration</span>
            </div>
            <div className="h-8 border-l-2 border-dashed border-[#bbcabf] ml-1 my-2" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#a43a3a] rounded-full" />
              <span className="font-mono text-xs text-[#3c4a42]">Title Transferred</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}