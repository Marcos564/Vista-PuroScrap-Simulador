import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const fmt = (v) => new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
}).format(v);

const KPI = ({ label, value, sub, highlight, positive, negative }) => (
  <div className={`kpi-card ${highlight ? 'highlight' : ''}`}>
    <div className="kpi-label">{label}</div>
    <div className={`kpi-value ${positive ? 'positive' : ''} ${negative ? 'negative' : ''}`}>{value}</div>
    {sub && <div className="kpi-label" style={{ marginTop: 5 }}>{sub}</div>}
  </div>
);

export default function Dashboard({ data, onRefresh }) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
        <p className="text-sm font-medium">Ejecutá al menos una simulación para ver el dashboard</p>
        <button onClick={onRefresh} className="btn-sm">Actualizar</button>
      </div>
    );
  }

  if (data.total_simulaciones === 0) {
    return (
      <div className="card flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
        <p className="text-sm font-medium">Sin simulaciones aún. Ejecutá una desde la pestaña Simulación.</p>
        <button onClick={onRefresh} className="btn-sm">Actualizar</button>
      </div>
    );
  }

  // Gráfico dona: reciclados vs reutilizados
  const donaData = {
    labels: ['Reciclados', 'Reutilizados'],
    datasets: [{
      data: [
        data.porcentaje_reciclados,
        data.porcentaje_reutilizados,
      ],
      backgroundColor: ['rgba(22,163,74,0.85)', 'rgba(134,239,172,0.85)'],
      borderColor: ['#15803d', '#4ade80'],
      borderWidth: 2,
    }],
  };

  const donaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 12, weight: '600' }, color: '#166534' } },
      tooltip: {
        callbacks: { label: ctx => ` ${ctx.raw}%` },
      },
    },
    cutout: '65%',
  };

  // Gráfico barras: rentable vs pérdida
  const barData = {
    labels: ['Rentables', 'Con pérdida'],
    datasets: [{
      label: 'Simulaciones',
      data: [data.simulaciones_rentables, data.simulaciones_con_perdida],
      backgroundColor: ['rgba(22,163,74,0.8)', 'rgba(220,38,38,0.7)'],
      borderColor: ['#15803d', '#dc2626'],
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(187,247,208,0.5)' }, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="results-container active">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>Dashboard Global</h1>
        <button onClick={onRefresh} className="btn-sm flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Actualizar
        </button>
      </div>

      {/* KPIs principales */}
      <div className="kpi-grid">
        <KPI label="Total Simulaciones" value={data.total_simulaciones} highlight />
        <KPI label="Residuos Procesados" value={data.total_residuos_procesados.toLocaleString('es-AR')} />
        <KPI label="Ingreso Acumulado" value={fmt(data.ingreso_total_acumulado)} />
        <KPI
          label="Rentabilidad Acumulada"
          value={fmt(data.rentabilidad_total_acumulada)}
          positive={data.rentabilidad_total_acumulada >= 0}
          negative={data.rentabilidad_total_acumulada < 0}
        />
      </div>

      {/* KPIs secundarios */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <KPI label="Rentabilidad Promedio" value={fmt(data.rentabilidad_promedio)}
          positive={data.rentabilidad_promedio >= 0} negative={data.rentabilidad_promedio < 0} />
        <KPI label="% Reciclados" value={`${data.porcentaje_reciclados}%`} />
        <KPI label="% Reutilizados" value={`${data.porcentaje_reutilizados}%`} />
        <KPI label="Rentables" value={data.simulaciones_rentables} positive />
        <KPI label="Con Pérdida" value={data.simulaciones_con_perdida} negative={data.simulaciones_con_perdida > 0} />
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <h2>Distribución de Residuos</h2>
          <div style={{ height: 220 }}>
            <Doughnut data={donaData} options={donaOptions} />
          </div>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <h2>Simulaciones por Resultado</h2>
          <div style={{ height: 220 }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Última simulación */}
      {data.ultima_simulacion && (
        <div className="card" style={{ marginBottom: 0 }}>
          <h2>Última Simulación</h2>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            <KPI label="Nombre" value={data.ultima_simulacion.nombre || '—'} />
            <KPI label="Fecha" value={data.ultima_simulacion.fecha} />
            <KPI label="Mouses" value={data.ultima_simulacion.cant_mouses} />
            <KPI label="Teclados" value={data.ultima_simulacion.cant_teclados} />
            <KPI
              label="Rentabilidad"
              value={fmt(data.ultima_simulacion.optimo_rentabilidad || 0)}
              positive={(data.ultima_simulacion.optimo_rentabilidad || 0) >= 0}
              negative={(data.ultima_simulacion.optimo_rentabilidad || 0) < 0}
            />
          </div>
        </div>
      )}
    </div>
  );
}
