export default function Nav() {
  return (
    <nav className="w-full bg-white flex justify-between items-center px-10 h-16 shadow-sm border-b border-green-100 sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-green-600 p-2 rounded-lg flex items-center justify-center shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <polyline points="23 20 23 14 17 14" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-[1.05rem] text-green-700 tracking-tight">PuroScrap</span>
          <span className="text-[0.6rem] font-bold text-green-400 tracking-widest uppercase">Simulador</span>
        </div>
      </div>

      {/* Badge */}
      <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Simulación local
      </div>
    </nav>
  );
}
