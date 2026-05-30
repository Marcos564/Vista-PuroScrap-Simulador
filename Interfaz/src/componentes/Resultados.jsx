import '../styless/Resultados.css';

const fmt$ = (v) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(v);

const fmtN = (v, dec = 0) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: dec }).format(v);

// ── KPI card ─────────────────────────────────────────────────────────────────
function KPI({ label, value, sub, accent, positive, negative }) {
  return (
    <div className={`kpi-card${accent ? ' highlight' : ''}`}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${positive ? ' positive' : ''}${negative ? ' negative' : ''}`}>
        {value}
      </div>
      {sub && <div className="kpi-label" style={{ marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

// ── Sección con card ──────────────────────────────────────────────────────────
function Seccion({ titulo, icono, cols, children }) {
  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <h2>
        {icono && <span style={{ fontSize: '1rem', marginRight: 4 }}>{icono}</span>}
        {titulo}
      </h2>
      <div className="kpi-grid" style={{ gridTemplateColumns: cols || 'repeat(auto-fit, minmax(155px, 1fr))' }}>
        {children}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Resultados({ data: d, nombre }) {
  return (
    <section className="results-container active">

      {/* Nombre de simulación */}
      {nombre && (
        <div style={{
          fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)',
          textTransform: 'uppercase', letterSpacing: '1px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 4, height: 16, background: 'var(--primary)',
            borderRadius: 2, display: 'inline-block', flexShrink: 0,
          }} />
          {nombre}
        </div>
      )}

      {/* S1 — Lote */}
      <Seccion titulo="Lote Entrante" icono="📦" cols="repeat(3, 1fr)">
        <KPI label="Cantidad Entrante" value={fmtN(d.cantidadEntrante)} accent />
        <KPI label="Mouses"            value={fmtN(d.cantMouses)} />
        <KPI label="Teclados"          value={fmtN(d.cantTeclados)} />
      </Seccion>

      {/* S2 — Clasificación */}
      <Seccion titulo="Clasificación" icono="🔀" cols="repeat(auto-fit, minmax(145px, 1fr))">
        <KPI label="Mouses Reutilizables"    value={fmtN(d.mousesReutilizables)}   accent />
        <KPI label="Mouses Reciclables"      value={fmtN(d.mousesReciclables)} />
        <KPI label="Teclados Reutilizables"  value={fmtN(d.tecladosReutilizables)} accent />
        <KPI label="Teclados Reciclables"    value={fmtN(d.tecladosReciclables)} />
      </Seccion>

      {/* S3 — Recuperación */}
      <Seccion titulo="Material Recuperado" icono="⚙️" cols="repeat(auto-fit, minmax(145px, 1fr))">
        <KPI label="Material Reutilizable" value={fmtN(d.totalMaterialReutilizable, 1)} sub="gramos" accent />
        <KPI label="Residuos Peligrosos"   value={fmtN(d.totalResiduoPeligroso,     1)} sub="gramos" />
        <KPI label="Cobre Recuperado"      value={fmtN(d.totalCobreRecuperado,       1)} sub="gramos" />
        <KPI label="Hierro Recuperado"     value={fmtN(d.totalHierroRecuperado,      1)} sub="gramos" />
      </Seccion>

      {/* S4 — Tiempos */}
      <Seccion titulo="Tiempos de Procesamiento" icono="⏱️" cols="repeat(auto-fit, minmax(145px, 1fr))">
        <KPI label="Operarios"          value={fmtN(d.operarios)} />
        <KPI label="Tiempo Total"       value={fmtN(d.tiempoTotalProceso, 0)} sub="minutos" />
        <KPI label="Tiempo Total"       value={fmtN(d.tiempoTotalHoras,   1)} sub="horas" />
        <KPI label="Días de Trabajo"    value={fmtN(d.diasTrabajo)}           accent />
        <KPI label="Tiempo Restante"    value={fmtN(d.tiempoRestante, 0)}     sub="min sobrantes" />
        <KPI label="Tiempo Faltante"    value={fmtN(d.tiempoFaltante, 0)}     sub="min faltantes" />
      </Seccion>

      {/* S5 — Ingresos */}
      <Seccion titulo="Ingresos" icono="💰" cols="repeat(3, 1fr)">
        <KPI label="Por Reciclaje"     value={fmt$(d.ingresoReciclaje)} />
        <KPI label="Por Reutilización" value={fmt$(d.ingresoReutilizacion)} />
        <KPI label="Ingreso Total"     value={fmt$(d.ingresoTotal)} accent />
      </Seccion>

      {/* S6 — Costos */}
      <Seccion titulo="Costos" icono="🧾" cols="repeat(3, 1fr)">
        <KPI label="Costo Laboral"        value={fmt$(d.costoLaboral)} />
        <KPI label="Costo Almacenamiento" value={fmt$(d.costoAlmacenamiento)} />
        <KPI label="Costo Total"          value={fmt$(d.costoTotal)} accent />
      </Seccion>

      {/* S7 — Rentabilidad */}
      <div className="card" style={{
        marginBottom: 0,
        border: `2px solid ${d.esGanancia ? 'var(--primary)' : 'var(--danger)'}`,
        background: d.esGanancia
          ? 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 100%)'
          : 'linear-gradient(160deg, #fff5f5 0%, #fee2e2 100%)',
      }}>
        <h2 style={{ borderColor: d.esGanancia ? 'var(--primary-muted)' : '#fecaca' }}>
          <span style={{ fontSize: '1rem', marginRight: 4 }}>📊</span>
          Rentabilidad Final
        </h2>
        <div className="kpi-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="kpi-card" style={{
            border: `1.5px solid ${d.esGanancia ? 'var(--primary-muted)' : '#fecaca'}`,
            background: 'transparent',
          }}>
            <div className="kpi-label">Rentabilidad</div>
            <div className={`kpi-value ${d.esGanancia ? 'positive' : 'negative'}`} style={{ fontSize: '2rem' }}>
              {fmt$(d.rentabilidad)}
            </div>
          </div>
          <div className="kpi-card" style={{
            border: `1.5px solid ${d.esGanancia ? 'var(--primary-muted)' : '#fecaca'}`,
            background: 'transparent',
          }}>
            <div className="kpi-label">Estado</div>
            <div className={`kpi-value ${d.esGanancia ? 'positive' : 'negative'}`} style={{ fontSize: '1.6rem', letterSpacing: 0 }}>
              {d.esGanancia ? '✓ Ganancia' : '✗ Pérdida'}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
