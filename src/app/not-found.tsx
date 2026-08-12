import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06070a] text-white flex flex-col items-center justify-center p-6 text-center font-mono">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#0b0d14] border border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.2)] space-y-4">
        <div className="h-12 w-12 mx-auto rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Terminal className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-black tracking-wider text-white">404 // NOT FOUND</h1>
          <p className="text-xs text-zinc-400">The requested coordinate does not exist on the radar.</p>
        </div>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <ArrowLeft className="h-4 w-4" />
            RETURN TO GENERATOR
          </Link>
        </div>
      </div>
    </div>
  );
}
