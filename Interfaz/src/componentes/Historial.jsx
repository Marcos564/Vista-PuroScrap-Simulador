const fmt = (v) => new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
}).format(v ?? 0);

export default function Historial({ simulaciones, onVerDetalle, onLimpiar, onRefresh, apiUrl }) {

  const descargarJSON = () => {
    window.open(`${apiUrl}/exportar/json`, '_blank');
  };

  const descargarCSV = () => {
    window.open(`${apiUrl}/exportar/csv`, '_blank');
  };

  return (
    <div className="results-container active">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>
          Historial de Simulaciones
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: 10 }}>
            ({simulaciones.length} registros)
          </span>
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onRefresh} className="btn-sm flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Actualizar
          </button>
          <button onClick={descargarCSV} className="btn-sm flex items-center gap-1.5" style={{ color: '#15803d', borderColor: '#bbf7d0' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            CSV
          </button>
          <button onClick={descargarJSON} className="btn-sm flex items-center gap-1.5" style={{ color: '#1d4ed8', borderColor: '#bfdbfe' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            JSON
          </button>
          {simulaciones.length > 0 && (
            <button onClick={onLimpiar} className="btn-sm flex items-center gap-1.5" style={{ color: '#dc2626', borderColor: '#fecaca' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {simulaciones.length === 0 ? (
        <div className="card flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <p className="text-sm font-medium">No hay simulaciones en el historial</p>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Mouses</th>
                  <th>Teclados</th>
                  <th>Ingreso Total</th>
                  <th>Costo Óptimo</th>
                  <th>Rentabilidad</th>
                  <th>Emp. Óptimo</th>
                  <th>Resultado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {simulaciones.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {s.id}
                    </td>
                    <td style={{ fontFamily: 'DM Sans, sans-serif', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.nombre || '—'}
                    </td>
                    <td style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{s.fecha}</td>
                    <td>{s.cant_mouses}</td>
                    <td>{s.cant_teclados}</td>
                    <td>{fmt(s.ingreso_total)}</td>
                    <td>{fmt(s.optimo_costo_total)}</td>
                    <td className={`${(s.optimo_rentabilidad ?? 0) >= 0 ? 'positive' : 'negative'}`} style={{ fontWeight: 700 }}>
                      {fmt(s.optimo_rentabilidad)}
                    </td>
                    <td>{s.optimo_n_empleados ?? '—'}</td>
                    <td>
                      {s.optimo_es_ganancia === true && <span className="badge-optimal">Ganancia</span>}
                      {s.optimo_es_ganancia === false && <span className="badge-infeasible">Pérdida</span>}
                      {s.optimo_es_ganancia === null && <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td>
                      <button className="btn-sm" onClick={() => onVerDetalle(s.id)}>
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
