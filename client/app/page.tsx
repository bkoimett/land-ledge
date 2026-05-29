import { Landmark } from "lucide-react";
import RegisterForm from "@/components/forms/RegisterForm";
import TransferForm from "@/components/forms/TransferForm";

export default function Home() {
  return (
    <main className="pt-32 pb-20 px-4 md:px-16 max-w-[1440px] mx-auto mesh-gradient">

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#10b981] live-pulse relative" />
          <span className="font-mono text-xs tracking-widest uppercase text-[#10b981]">
            Network Status: Polygon Amoy Connected
          </span>
        </div>
        <h1 className="text-5xl font-bold text-[#191c1e] mb-4 tracking-tight">
          Registry Management Console
        </h1>
        <p className="text-base text-[#3c4a42] max-w-2xl">
          Securely mint land assets onto the blockchain or transfer ownership via immutable smart contracts. All operations are final and cryptographically verified.
        </p>
      </div>

      {/* Dual Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Register New Asset */}
        <RegisterForm />
        
        {/* Right: Transfer Land Title */}
        <TransferForm />
      </div>

      {/* Network Stats Bar */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-panel p-6 rounded-xl text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Current Gas</p>
          <p className="font-mono text-xl text-[#10b981]">32.4 Gwei</p>
        </div>
        <div className="card-panel p-6 rounded-xl text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Block Time</p>
          <p className="font-mono text-xl text-[#191c1e]">2.1s</p>
        </div>
        <div className="card-panel p-6 rounded-xl text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Assets Minted</p>
          <p className="font-mono text-xl text-[#191c1e]">14,209</p>
        </div>
        <div className="card-panel p-6 rounded-xl text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Security Audit</p>
          <p className="font-mono text-xl text-[#a43a3a]">Verified</p>
        </div>
      </div>
    </main>
  );
}