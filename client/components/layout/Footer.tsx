import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-16 flex flex-col md:flex-row justify-between items-center gap-6 bg-white border-t border-[#bbcabf]/20">
      <div className="font-mono text-sm font-bold text-[#191c1e]">ArdhiChain</div>
      <div className="font-mono text-xs text-[#3c4a42]">© 2024 ArdhiChain. Powered by Polygon Amoy</div>
      <div className="flex gap-8">
        <a href="#" className="font-mono text-xs text-[#3c4a42] hover:text-[#006c49] transition-colors">Privacy Policy</a>
        <a href="#" className="font-mono text-xs text-[#3c4a42] hover:text-[#006c49] transition-colors">Terms of Service</a>
        <a href="#" className="font-mono text-xs text-[#3c4a42] hover:text-[#006c49] transition-colors">Security Audit</a>
      </div>
    </footer>
  );
};

export default Footer;