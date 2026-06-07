"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-slate-900 bg-white/90 backdrop-blur-md shadow-[0_2px_0px_rgba(15,23,42,0.05)] select-none">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform group-hover:rotate-12 duration-300">🏆</span>
          <span className="font-black text-slate-900 tracking-wide text-lg sm:text-xl font-sans flex items-center gap-1">
            W杯優勝予想しようよ
          </span>
        </Link>
      </div>
    </header>
  );
}
