import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../styless/Resultados.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const fmt = (v) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(v);

// Plugin línea del cero
const zeroLinePlugin = {
  id: 'zeroLine',
  beforeDraw(chart) {
    const { ctx, scales: { y } } = chart;
    if (!y) return;
    const yZero = y.getPixelForValue(0);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(chart.chartArea.left, yZero);
    ctx.lineTo(chart.chartArea.right, yZero);
    ctx.strokeStyle = 'rgba(220,38,38,0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.restore();
  },
};

export default function ResultadosLote({ data }) {
  const [mostrarGrafico, setMostrarGrafico] = useState(false);

  // ── Gráfico: días trabajados ──────────────────────────────────────────────
  const labelsEmp = data.escenarios.map(e => `${e.n_empleados} emp.`);

  const diasData = {
    labels: labelsEmp,
    datasets: [
      {
        label: 'Días trabajados',
        data: data.escenarios.map(e => e.dias_trabajados),
        backgroundColor: data.escenarios.map(e =>
          e.es_optimo ? 'rgba(22,163,74,0.85)' : !e.factible ? 'rgba(220,38,38,0.45)' : 'rgba(22,163,74,0.45)'
        ),
        borderColor: data.escenarios.map(e =>
          e.es_optimo ? '#15803d' : !e.factible ? '#dc2626' : '#16a34a'
        ),
        borderWidth: 2,
        borderRadius: 7,
        yAxisID: 'yDias',
      },
      {
        label: 'Ganancia ($)',
        data: data.escenarios.map(e => e.ganancia),
        backgroundColor: data.escenarios.map(e =>
          e.ganancia >= 0 ? 'rgba(59,130,246,0.6)' : 'rgba(239,68,68,0.55)'
        ),
        borderColor: data.escenarios.map(e =>
          e.ganancia >= 0 ? '#2563eb' : '#dc2626'
        ),
        borderWidth: 2,
        borderRadius: 7,
        yAxisID: 'yGanancia',
      },
    ],
  };

  const diasOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 12, weight: '600' }, color: '#166534' },
      },
      tooltip: {
        backgroundColor: '#052e16',
        titleColor: '#86efac',
        bodyColor: '#dcfce7',
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: ctx =>
            ctx.dataset.yAxisID === 'yGanancia'
              ? ` Ganancia: ${fmt(ctx.raw)}`
              : ` Días: ${ctx.raw}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      yDias: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Días', color: '#16a34a', font: { weight: '700' } },
        grid: { color: 'rgba(187,247,208,0.4)' },
        ticks: { color: '#16a34a' },
      },
      yGanancia: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Ganancia ($)', color: '#2563eb', font: { weight: '700' } },
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#2563eb',
          callback: v => {
            const abs = Math.abs(v);
            if (abs >= 1e6) return (v / 1e6).toFixed(1) + 'M';
            if (abs >= 1e3) return (v / 1e3).toFixed(0) + 'k';
            return v;
          },
        },
      },
    },
  };

  return (
    <section className="results-container active">

      {/* ── Info del lote generado ── */}
      <div className="card" style={{ marginBottom: 0 }}>
        <h2>Lote Generado</h2>
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          <div className="kpi-card highlight">
            <div className="kpi-label">Lote Total</div>
            <div className="kpi-value">{data.lote_generado.toLocaleString('es-AR')}</div>
            <div className="kpi-label" style={{ marginTop: 4 }}>periféricos</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Rango configurado</div>
            <div className="kpi-value" style={{ fontSize: '1.2rem' }}>
              {data.min_lote} – {data.max_lote}
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Mouses</div>
            <div className="kpi-value">{data.cant_mouses}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Teclados</div>
            <div className="kpi-value">{data.cant_teclados}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Ingreso Bruto</div>
            <div className="kpi-value" style={{ fontSize: '1.2rem' }}>{fmt(data.ingreso_total)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Tiempo Total</div>
            <div className="kpi-value">{data.tiempo_total_horas}</div>
            <div className="kpi-label" style={{ marginTop: 4 }}>horas</div>
          </div>
        </div>
      </div>

      {/* ── KPIs del óptimo ── */}
      <div className="kpi-grid">
        <div className="kpi-card highlight">
          <div className="kpi-label">Empleados Óptimos</div>
          <div className="kpi-value">{data.optimo_n_empleados ?? '—'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Días Trabajados (óptimo)</div>
          <div className="kpi-value">{data.optimo_dias ?? '—'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Ganancia Neta (óptimo)</div>
          <div className={`kpi-value ${(data.optimo_ganancia ?? 0) >= 0 ? 'positive' : 'negative'}`}>
            {fmt(data.optimo_ganancia ?? 0)}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Resultado</div>
          <div className={`kpi-value ${data.optimo_es_ganancia ? 'positive' : 'negative'}`} style={{ fontSize: '1.1rem' }}>
            {data.optimo_es_ganancia ? '✓ Ganancia' : '✗ Pérdida'}
          </div>
        </div>
      </div>

      {/* ── Tabla días + ganancias ── */}
      <div className="card" style={{ marginBottom: 0 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          Días Trabajados y Ganancias por Escenario
          <button className="btn-chart" onClick={() => setMostrarGrafico(true)}>
            Ver Gráfico
          </button>
        </h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Empleados</th>
                <th>Factible</th>
                <th>Días Trabajados</th>
                <th>Ingreso Total</th>
                <th>Costo Total</th>
                <th>Ganancia Neta</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.escenarios.map((e) => (
                <tr key={e.n_empleados}>
                  <td style={{ fontWeight: 700 }}>
                    {e.n_empleados}
                    {e.es_optimo && <><br /><span className="badge-optimal">ÓPTIMO</span></>}
                  </td>
                  <td>
                    {e.factible
                      ? <span style={{ color: 'var(--success)', fontWeight: 700 }}>Sí</span>
                      : <span className="badge-infeasible">No</span>}
                  </td>
                  {/* Días — celda destacada */}
                  <td style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary-dark)' }}>
                    {e.dias_trabajados}
                    <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>días</span>
                  </td>
                  <td>{fmt(e.ingreso_total)}</td>
                  <td>{fmt(e.costo_total)}</td>
                  {/* Ganancia — celda destacada */}
                  <td
                    className={e.ganancia >= 0 ? 'positive' : 'negative'}
                    style={{ fontWeight: 700, fontSize: '0.95rem' }}
                  >
                    {fmt(e.ganancia)}
                  </td>
                  <td>
                    {!e.factible
                      ? <span className="badge-infeasible">No factible</span>
                      : e.ganancia >= 0
                        ? <span className="badge-optimal">Rentable</span>
                        : <span className="badge-infeasible">Pérdida</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal gráfico ── */}
      {mostrarGrafico && (
        <div className="modal modal-chart active" onClick={() => setMostrarGrafico(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setMostrarGrafico(false)}>&times;</button>
            <h2 style={{ marginBottom: 0 }}>Días Trabajados y Ganancia por N° de Empleados</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', marginBottom: 0 }}>
              Lote generado: <strong>{data.lote_generado}</strong> periféricos
              (rango {data.min_lote}–{data.max_lote})
            </p>
            <div className="chart-wrapper" style={{ height: 400 }}>
              <Bar data={diasData} options={diasOptions} plugins={[zeroLinePlugin]} />
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#16a34a' }} /> Días trabajados
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#3b82f6' }} /> Ganancia ($)
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#86efac', border: '2px solid #15803d' }} /> Escenario óptimo
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#fca5a5', border: '2px dashed #dc2626' }} /> No factible / pérdida
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
