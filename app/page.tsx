"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GROUPS, Country, getFlagUrl } from "./data/countries";

export default function Home() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleConfirm = () => {
    if (selectedCountry) {
      router.push(`/result?country=${selectedCountry.id}`);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-indigo-100 pb-20">
      {/* Header Section */}
      <header className="max-w-5xl mx-auto pt-12 pb-8 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border-2 border-slate-900 text-indigo-600 text-[10px] font-black tracking-widest uppercase mb-6 shadow-[2.5px_2.5px_0px_rgba(99,102,241,1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          2026 World Cup Insight
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
          W杯優勝予想<span className="inline-block text-indigo-600 transform -rotate-1 hover:rotate-2 transition-transform duration-300">しようよ！</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed font-medium text-xs sm:text-sm">
          全グループの中から、あなたが優勝を確信する1か国を選択してください。
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 pb-40 pt-4">
        {GROUPS.map((group) => (
          <section
            key={group.name}
            className="relative bg-white border-2 border-slate-900 rounded-[2rem] p-5 sm:p-8 shadow-[6px_6px_0px_#6366F1] animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            {/* Group Label - Floating style */}
            <div className="absolute -top-4 left-6 bg-slate-900 text-white text-[11px] font-black tracking-[0.15em] px-4 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#6366F1] uppercase">
              {group.name}
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
              {group.countries.map((country) => {
                const isSelected = selectedCountry?.id === country.id;
                return (
                  <button
                    key={country.id}
                    onClick={() => handleSelect(country)}
                    className={`group relative flex flex-col items-start p-4 rounded-2xl transition-all duration-150 border-2 select-none active:scale-[0.98] ${isSelected
                        ? "bg-indigo-600 text-white border-slate-900 shadow-[3px_3px_0px_#F59E0B] z-10 translate-x-[-1px] translate-y-[-1px]"
                        : "bg-slate-50/50 border-slate-250 hover:border-slate-900 hover:bg-white hover:shadow-[3px_3px_0px_rgba(99,102,241,0.3)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                      }`}
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      {/* Flag */}
                      <div className={`w-9 h-9 rounded-full border-2 overflow-hidden shadow-[1.5px_1.5px_0px_#000] shrink-0 transition-colors ${isSelected ? "border-white" : "border-slate-900"
                        }`}>
                        <img
                          src={getFlagUrl(country.id)}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      {/* Ranking */}
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${isSelected ? "bg-white/20 text-white border-white/30" : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                        {country.fifaRanking}位
                      </span>
                    </div>

                    <div className="w-full min-w-0">
                      <p className={`text-sm font-black truncate leading-tight mb-0.5 ${isSelected ? "text-white" : "text-slate-800"}`}>
                        {country.name}
                      </p>
                      <p className={`text-[9px] font-black tracking-tight truncate uppercase ${isSelected ? "text-indigo-200" : "text-slate-400"
                        }`}>
                        {country.englishName}
                      </p>
                    </div>

                    {/* Dot Indicator */}
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 border border-slate-900 shadow-[1px_1px_0px_#000] text-white">
                        <svg className="w-3 h-3 font-black" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm z-50">
        <div className={`flex items-center justify-between p-2 rounded-2xl border-2 transition-all duration-300 shadow-[4px_4px_0px_#000] ${selectedCountry
            ? "bg-white border-slate-900 translate-y-0 opacity-100"
            : "bg-white/80 border-slate-200 translate-y-8 opacity-0 pointer-events-none"
          }`}>
          <div className="flex items-center gap-3 pl-3">
            {selectedCountry && (
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#000] shrink-0">
                <img
                  src={getFlagUrl(selectedCountry.id)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-slate-900 text-xs font-black truncate leading-none mb-1">
                {selectedCountry?.name}
              </p>
              <p className="text-indigo-600 text-[10px] font-black leading-none">
                SELECTED
              </p>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="bg-amber-400 hover:bg-amber-300 text-slate-900 border-2 border-slate-900 px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] flex items-center gap-2 cursor-pointer"
          >
            決定する
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx global>{`
        body {
          background-color: #F8FAFC;
        }

        .animate-in {
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}