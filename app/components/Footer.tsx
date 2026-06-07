export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-slate-900 bg-slate-100 py-6 text-center text-[10px] text-slate-500 font-bold select-none">
      <div className="flex flex-col items-center justify-center gap-1.5">
        <p className="tracking-wide">
          © {new Date().getFullYear()} W杯優勝予想<span className="text-indigo-600 font-black">しようよ！</span>
        </p>
        <p className="text-slate-400 font-medium">
          このアプリはファンメイドの優勝予想シミュレーターです。
        </p>
      </div>
    </footer>
  );
}
