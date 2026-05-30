import { useState, useRef, useEffect } from "react";

const Nav = ({ vista, onCambiarVista, apiStatus }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = (v) =>
    `flex items-center gap-2 text-[0.9rem] font-semibold transition-colors px-3 py-1.5 rounded-lg ${
      vista === v
        ? "text-green-700 bg-green-50"
        : "text-gray-500 hover:text-green-600 hover:bg-green-50"
    }`;

  return (
    <nav className="w-full bg-white flex justify-between items-center px-10 h-16 shadow-sm border-b border-gray-100 sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onCambiarVista('simulacion')}
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="bg-green-600 p-2 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="flex flex-col leading-none mt-1">
            <span className="font-bold text-[1.1rem] text-green-700 tracking-tight">PuroScrap</span>
            <span className="text-[0.65rem] font-bold text-green-500 tracking-widest uppercase mt-0.5">Analytics</span>
          </div>
        </button>
      </div>

      {/* Links */}
      <div className="flex items-center gap-2">

        {/* Dashboard */}
        <button onClick={() => onCambiarVista('dashboard')} className={linkClass('dashboard')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          Dashboard
        </button>

        {/* Simulación */}
        <button onClick={() => onCambiarVista('simulacion')} className={linkClass('simulacion')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Simulación
        </button>

        {/* Historial */}
        <button onClick={() => onCambiarVista('historial')} className={linkClass('historial')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          Historial
        </button>

        {/* Separador */}
        <div className="w-px h-5 bg-gray-200 mx-2" />

        {/* Status */}
        <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${
          apiStatus === 'online'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-600 border-red-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          API {apiStatus === 'online' ? 'Online' : 'Offline'}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
