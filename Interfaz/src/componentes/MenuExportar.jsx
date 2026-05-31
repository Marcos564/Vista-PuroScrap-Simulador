import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx-js-style'; 
import "../styless/Resultados.css";

const MenuExportar = ({ resultados }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const descargarExcel = () => {
    if (!resultados?.Todos_Los_Escenarios) {
      alert("No hay datos para exportar.");
      return;
    }

    const escenarios = resultados.Todos_Los_Escenarios;

    const optimoEmpleados = resultados.Recomendacion_Optima?.n_empleados;
    
    const wb = XLSX.utils.book_new();

    const headers = [
      "Empleados", "Días Requeridos", "Costo Laboral ($)",
      "Costo Almacenamiento ($)", "Costo Total ($)", "Rentabilidad ($)"
    ];

    const rows = escenarios.map(esc => [
      esc.n_empleados, esc.dias_requeridos, esc.costo_laboral,
      esc.costo_almacenamiento, esc.costo_total, esc.rentabilidad
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    ws['!cols'] = [
      { wch: 14 }, { wch: 18 }, { wch: 20 },
      { wch: 26 }, { wch: 18 }, { wch: 18 },
    ];


    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" }, name: "Arial", sz: 11 },
      fill: { fgColor: { rgb: "2E7D32" } }, // Verde
      alignment: { horizontal: "center", vertical: "center", wrapText: true }
    };

    const dataStyle = {
      font: { name: "Arial", sz: 10 },
      fill: { fgColor: { rgb: "FFFFFF" } }, // Blanco
      alignment: { horizontal: "center", vertical: "center" }
    };


    const optimalStyle = {
      font: { name: "Arial", sz: 10, bold: true },
      fill: { fgColor: { rgb: "E5E7EB" } }, // Gris claro tipo Tailwind (gray-200)
      alignment: { horizontal: "center", vertical: "center" }
    };


    for (const cellAddress in ws) {
      if (cellAddress.startsWith('!')) continue;


      const rowNum = parseInt(cellAddress.replace(/[^\d]/g, ''), 10);


      if (rowNum === 1) {
        ws[cellAddress].s = headerStyle;
      } else {
        
        const escenarioActual = escenarios[rowNum - 2];
        const esOptimo = escenarioActual?.n_empleados === optimoEmpleados;
        
        
        ws[cellAddress].s = esOptimo ? optimalStyle : dataStyle;
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Simulación");
    XLSX.writeFile(wb, "reporte_simulacion.xlsx");
  };

  const imprimirPDF = () => {
  if (!resultados?.Todos_Los_Escenarios) {
    alert("No hay datos para exportar.");
    return;
  }

  const escenarios = resultados.Todos_Los_Escenarios;
  const fmt = (n) => '$' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const mejor = [...escenarios].sort((a, b) => b.rentabilidad - a.rentabilidad)[0];
  const positivos = escenarios.filter(e => e.rentabilidad >= 0).length;
  const negativos = escenarios.filter(e => e.rentabilidad < 0).length;
  const fecha = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });

  const filas = escenarios.map((esc, i) => {
    const esMejor = esc.n_empleados === mejor.n_empleados;
    const negativo = esc.rentabilidad < 0;
    const rentColor = negativo ? '#B91C1C' : '#15803D';
    const rowBg = esMejor ? '#F0FDF4' : i % 2 === 0 ? '#ffffff' : '#f9fafb';
    return `
      <tr style="background:${rowBg};">
        <td style="padding:8px 12px;text-align:center;border-bottom:1px solid #E5E7EB;">${esMejor ? '★ ' : ''}${esc.n_empleados}</td>
        <td style="padding:8px 12px;text-align:center;border-bottom:1px solid #E5E7EB;">${esc.dias_requeridos}</td>
        <td style="padding:8px 12px;text-align:right;border-bottom:1px solid #E5E7EB;">${fmt(esc.costo_laboral)}</td>
        <td style="padding:8px 12px;text-align:right;border-bottom:1px solid #E5E7EB;">${fmt(esc.costo_almacenamiento)}</td>
        <td style="padding:8px 12px;text-align:right;border-bottom:1px solid #E5E7EB;">${fmt(esc.costo_total)}</td>
        <td style="padding:8px 12px;text-align:right;font-weight:600;color:${rentColor};border-bottom:1px solid #E5E7EB;">${fmt(esc.rentabilidad)}</td>
      </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Reporte de Simulación</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #111; padding: 40px;  -webkit-print-color-adjust: exact;
print-color-adjust: exact;}
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #2E7D32;">
    <div>
      <p style="font-size:10px;color:#6B7280;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em;">Reporte de simulación</p>
      <h1 style="font-size:20px;font-weight:700;color:#111;">Análisis de escenarios</h1>
      <p style="font-size:11px;color:#6B7280;margin-top:4px;">${fecha}</p>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px;">
    <div style="background:#F3F4F6;border-radius:8px;padding:12px 14px;">
      <p style="font-size:10px;color:#6B7280;margin-bottom:4px;">Escenarios</p>
      <p style="font-size:20px;font-weight:700;">${escenarios.length}</p>
    </div>
    <div style="background:#F0FDF4;border-radius:8px;padding:12px 14px;">
      <p style="font-size:10px;color:#6B7280;margin-bottom:4px;">Escenario óptimo</p>
      <p style="font-size:20px;font-weight:700;color:#15803D;">${mejor.n_empleados} emp.</p>
    </div>
    <div style="background:#F0FDF4;border-radius:8px;padding:12px 14px;">
      <p style="font-size:10px;color:#6B7280;margin-bottom:4px;">Con ganancia</p>
      <p style="font-size:20px;font-weight:700;color:#15803D;">${positivos}</p>
    </div>
    <div style="background:#FEF2F2;border-radius:8px;padding:12px 14px;">
      <p style="font-size:10px;color:#6B7280;margin-bottom:4px;">Con pérdida</p>
      <p style="font-size:20px;font-weight:700;color:#B91C1C;">${negativos}</p>
    </div>
  </div>

  <h2 style="font-size:13px;font-weight:700;margin-bottom:10px;">Todos los escenarios</h2>
  <table style="width:100%;border-collapse:collapse;font-size:12px;">
    <thead>
      <tr style="background:#2E7D32;">
        <th style="padding:10px 12px;text-align:center;color:#fff;font-weight:600;">Empleados</th>
        <th style="padding:10px 12px;text-align:center;color:#fff;font-weight:600;">Días req.</th>
        <th style="padding:10px 12px;text-align:right;color:#fff;font-weight:600;">Costo laboral</th>
        <th style="padding:10px 12px;text-align:right;color:#fff;font-weight:600;">Costo almac.</th>
        <th style="padding:10px 12px;text-align:right;color:#fff;font-weight:600;">Costo total</th>
        <th style="padding:10px 12px;text-align:right;color:#fff;font-weight:600;">Rentabilidad</th>
      </tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>

  <div style="margin-top:32px;padding-top:12px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;">
    <p style="font-size:10px;color:#9CA3AF;">★ Escenario con mayor rentabilidad</p>
    <p style="font-size:10px;color:#9CA3AF;">Página 1 de 1</p>
  </div>
</body>
</html>`;

  const ventana = window.open('', '_blank', 'width=900,height=700');
  ventana.document.write(html);
  ventana.document.close();
  ventana.focus();
  setTimeout(() => ventana.print(), 500);
  setDropdownOpen(false);
};

  if (!resultados) return null;

  // ... (el return con el JSX de tus botones se mantiene exactamente igual)
  return (
    <div className="relative" ref={menuRef}> 
      <button 
  onClick={() => setDropdownOpen(!dropdownOpen)}
  className="btn-export"
>
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
  Exportar
</button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
          <button 
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
            onClick={() => {
              descargarExcel();
              setDropdownOpen(false);
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-600" />
            Excel
          </button>
          <button 
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
            onClick={() => {
              imprimirPDF();
              setDropdownOpen(false);
            }}
          >
            <span className="w-2 h-2 rounded-full bg-red-600" />
            PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuExportar;