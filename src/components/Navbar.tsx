import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 border-b border-stone-200/50 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <span className="font-bold text-stone-900 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            CPF Retirement Maximiser™
          </span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden sm:inline">100% Confidential</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
