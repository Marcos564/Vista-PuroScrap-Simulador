import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styless/Nav.css"

const Nav = () => {
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

  return (
    <nav className="w-full bg-white flex justify-between items-center px-10 h-16 shadow-sm border-b border-gray-100 ">
      
      <div className="container_nav">
        {/* ── Lado Izquierdo: Logo ── */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            {/* Icono del Logo */}
            <div className="bg-green-600 p-2 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            {/* Texto del Logo */}
            <div className="flex flex-col leading-none mt-1 text-left">
              <span className="font-bold text-[1.1rem] text-green-700 tracking-tight">PuroScrap</span>
              <span className="text-[0.65rem] font-bold text-green-500 tracking-widest uppercase mt-0.5">Analytics</span>
            </div>
          </Link>
        </div>

        {/* ── Lado Derecho: Enlaces ── */}
        <div className="flex items-center gap-8">
          
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center gap-2 text-[0.9rem] font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`
            }
          >
            <span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            Inicio
          </NavLink>

          <NavLink 
            to="/simulador" 
            className={({ isActive }) => 
              `flex items-center gap-2 text-[0.9rem] font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`
            }
          >
            <span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </span>
            Simulación
          </NavLink>
        </div>
        
      </div>
    </nav>
  );
};

export default Nav;