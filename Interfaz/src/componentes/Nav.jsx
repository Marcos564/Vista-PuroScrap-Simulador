import { useState, useRef, useEffect } from "react";
import '../styless/Nav.css'

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
    <>
      <nav className="sidebar">


        <div className="nav-left">
        <a href="#inicio" className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="sidebar-logo-text">
            PuroScrap
            <span>Analytics</span>
          </div>
        </a>
        </div>


        <div className="nav-right">
        {/* Main nav */}

        <a href="#inicio" className="sidebar-link">
          <span className="sidebar-link-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          Inicio
        </a>

        <a href="#simulacion" className="sidebar-link">
          <span className="sidebar-link-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </span>
          Simulación
        </a>

        {/* Dropdown */}

        <div className="sidebar-dropdown-wrapper" ref={dropdownRef}>
          <button
            className="sidebar-link sidebar-dropdown-btn"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-expanded={dropdownOpen}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="sidebar-link-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
              Descargar
            </span>
            <svg
              className={`sidebar-dropdown-chevron${dropdownOpen ? " open" : ""}`}
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div className={`sidebar-dropdown-menu${dropdownOpen ? " open" : ""}`}>
            <div className="sidebar-dropdown-inner">
              <a
                href="#descargar-excel"
                className="sidebar-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <span className="sidebar-dropdown-item-dot" style={{ background: "#16a34a" }} />
                Excel
              </a>
              <a
                href="#descargar-pdf"
                className="sidebar-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <span className="sidebar-dropdown-item-dot" style={{ background: "#dc2626" }} />
                PDF
              </a>
            </div>
          </div>
        </div>

        </div>
        

      </nav>
    </>
  );
};

export default Nav;