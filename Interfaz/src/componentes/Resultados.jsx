// Resultados.jsx
import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import "../styless/Resultados.css";

// 1. REGISTRAR MÓDULOS DE CHART.JS
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function Resultados({ data }) {
  // 2. ESTADOS PARA LOS MODALES
  const [detallesModal, setDetallesModal] = useState(null);
  const [mostrarGrafico, setMostrarGrafico] = useState(false);

  // Helper para formato de moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(value);
  };

  // 3. PREPARACIÓN DE DATOS PARA EL GRÁFICO
  // ---> CAMBIO 1: Usar "Todos_Los_Escenarios"
  const escenarios = data.Todos_Los_Escenarios || [];
  const recomendacion = data.Recomendacion_Optima || {};

  const labels = escenarios.map(e => `${e.n_empleados} emp.`);
  const values = escenarios.map(e => e.rentabilidad);
  
  // ---> CAMBIO 2: Nueva lógica para identificar el óptimo y las pérdidas
  const bgColors = escenarios.map(e => {
    if (e.n_empleados === recomendacion.n_empleados) return 'rgba(22,163,74,0.85)'; // Óptimo (Verde fuerte)
    if (e.rentabilidad < 0) return 'rgba(220,38,38,0.55)'; // Pérdida (Rojo)
    return 'rgba(22,163,74,0.45)'; // Rentable (Verde claro)
  });

  const borderColors = escenarios.map(e => {
    if (e.n_empleados === recomendacion.n_empleados) return '#15803d';
    if (e.rentabilidad < 0) return '#dc2626';
    return '#16a34a';
  });

  const chartData = {
    labels,
    datasets: [{
      label: 'Rentabilidad ($)',
      data: values,
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: 2,
      borderRadius: 7,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#052e16',
        titleColor: '#86efac',
        bodyColor: '#dcfce7',
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: ctx => ' ' + formatCurrency(ctx.raw)
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { 
        grid: { color: 'rgba(187,247,208,0.5)' },
        ticks: {
          callback: v => {
            const abs = Math.abs(v);
            if (abs >= 1e6) return (v / 1e6).toFixed(1) + 'M';
            if (abs >= 1e3) return (v / 1e3).toFixed(0) + 'k';
            return v;
          }
        }
      }
    }
  };

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
    }
  };


  return (
    <section className="results-container active">
      {/* --- KPIs PRINCIPALES --- */}
      <div className="kpi-grid">
        <div className="kpi-card highlight">
          <div className="kpi-label">Mejor Escenario</div>
          {/* Actualizado a la nueva ruta */}
          <div className="kpi-value">{data.Recomendacion_Optima?.n_empleados || 'N/A'}</div>
          <div className="kpi-label" style={{ marginTop: '5px' }}>Empleados</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Ingreso Bruto</div>
          {/* Actualizado a la nueva ruta */}
          <div className="kpi-value">{formatCurrency(data.Datos_Generales?.Ingreso_Bruto_USD || 0)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Costo Total (Óptimo)</div>
          <div className="kpi-value">{formatCurrency(data.Recomendacion_Optima?.costo_total || 0)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Rentabilidad Neta</div>
          <div className={`kpi-value ${data.Recomendacion_Optima?.rentabilidad >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(data.Recomendacion_Optima?.rentabilidad || 0)}
          </div>
        </div>
      </div>

      {/* --- MÉTRICAS OPERATIVAS --- */}
      <div className="card" style={{ marginBottom: 0 }}>
        <h2 style={{ fontSize: '0.9rem', marginBottom: '1.1rem', paddingBottom: '0.6rem' }}>
          Métricas Operativas — Totales del Lote
        </h2>
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))' }}>
          <div className="kpi-card">
            <div className="kpi-label">Perif. Reciclados</div>
            <div className="kpi-value">{data.Datos_Generales?.Perifericos_Reciclados || 0}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Perif. Reutilizados</div>
            <div className="kpi-value">{data.Datos_Generales?.Perifericos_Reutilizados || 0}</div>
          </div>
          <div className="kpi-card">
            {/* Cambiamos piezas desechadas por los gramos calculados */}
            <div className="kpi-label">Residuo Peligroso</div>
            <div className="kpi-value">{data.Datos_Generales?.Residuo_Peligroso_gr?.toFixed(2) || 0}</div>
            <div className="kpi-label" style={{ marginTop: '5px' }}>Gramos</div>
          </div>
          <div className="kpi-card">
            {/* Agregamos el material reutilizable */}
            <div className="kpi-label">Mat. Reutilizable</div>
            <div className="kpi-value">{data.Datos_Generales?.Material_Reutilizable_gr?.toFixed(2) || 0}</div>
            <div className="kpi-label" style={{ marginTop: '5px' }}>Gramos</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Tiempo Total</div>
            <div className="kpi-value">{data.Datos_Generales?.Tiempo_Total_Horas || 0}</div>
            <div className="kpi-label" style={{ marginTop: '5px' }}>Horas</div>
          </div>
        </div>
      </div>

      {/* --- TABLA DE ESCENARIOS --- */}
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          Análisis de Escenarios
          <button className="btn-chart" onClick={() => setMostrarGrafico(true)}>
             Ver Gráfico
          </button>
        </h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {/* Eliminamos columnas de Factible y Jornales */}
                <th>Empleados</th>
                <th>Días Necesarios</th>
                <th>Costo Laboral</th>
                <th>Costo Almacén</th>
                <th>Costo Total</th>
                <th>Rentabilidad</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {data.Todos_Los_Escenarios?.map((esc) => {
                // Nueva forma de verificar si es el óptimo
                const esOptimo = esc.n_empleados === data.Recomendacion_Optima?.n_empleados;
                
                return (
                  <tr key={esc.n_empleados}>
                    <td style={{ fontWeight: 700 }}>
                      {esc.n_empleados}
                      <br />
                      {esOptimo && <span className="badge-optimal">ÓPTIMO</span>}
                    </td>
                    {/* Actualizado a dias_requeridos (como lo manda FastAPI) */}
                    <td>{esc.dias_requeridos}</td>
                    <td>{formatCurrency(esc.costo_laboral)}</td>
                    <td>{formatCurrency(esc.costo_almacenamiento)}</td>
                    <td>{formatCurrency(esc.costo_total)}</td>
                    <td className={esc.rentabilidad >= 0 ? 'positive' : 'negative'} style={{ fontWeight: 700 }}>
                      {formatCurrency(esc.rentabilidad)}
                    </td>
                    <td>
                      <button className="btn-sm" onClick={() => setDetallesModal(esc)}>
                        Ver Cálculo
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE DETALLES --- */}
      {detallesModal && (
        <div className="modal active" onClick={() => setDetallesModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setDetallesModal(null)}>&times;</button>
            <h2 style={{ marginBottom: '1.25rem' }}>Cálculo — {detallesModal.n_empleados} Empleado(s)</h2>
            
            {/* Reconstruimos las fórmulas usando las variables matemáticas directas porque quitamos los textos de la API */}
            <div className="formula-group">
              <span>Tiempo Total Lote</span>
              <code>{data.Datos_Generales?.Tiempo_Total_Horas} Horas Operativas</code>
            </div>
            <div className="formula-group">
              <span>Días Requeridos</span>
              <code>{detallesModal.dias_requeridos} días de trabajo</code>
            </div>
            <div className="formula-group" style={{ borderColor: '#f59e0b' }}>
              <span>Costo Laboral (Fijo)</span>
              <code>{formatCurrency(detallesModal.costo_laboral)}</code>
            </div>
            <div className="formula-group" style={{ borderColor: '#dc2626' }}>
              <span>Costo Almacenamiento</span>
              <code>{detallesModal.dias_requeridos > 1 ? `${detallesModal.dias_requeridos - 1} días extra x tarifa` : '0 (Terminado en el día)'} = {formatCurrency(detallesModal.costo_almacenamiento)}</code>
            </div>
            <div className="formula-group" style={{ borderColor: 'var(--text)' }}>
              <span>Costo Total</span>
              <code>{formatCurrency(detallesModal.costo_laboral)} + {formatCurrency(detallesModal.costo_almacenamiento)} = {formatCurrency(detallesModal.costo_total)}</code>
            </div>
            <div className="formula-group" style={{ borderColor: 'var(--primary)', background: '#f0fdf4' }}>
              <span>Rentabilidad Neta</span>
              <code>{formatCurrency(data.Datos_Generales?.Ingreso_Bruto_USD)} - {formatCurrency(detallesModal.costo_total)} = {formatCurrency(detallesModal.rentabilidad)}</code>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DEL GRÁFICO --- */}
      {mostrarGrafico && (
        <div className="modal modal-chart active" onClick={() => setMostrarGrafico(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setMostrarGrafico(false)}>&times;</button>
            <h2 style={{ marginBottom: 0 }}>Rentabilidad por N° de Empleados</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', marginBottom: 0 }}>
              Ingreso fijo vs. costo según cantidad de empleados. El punto óptimo maximiza la ganancia neta.
            </p>
            
            <div className="chart-wrapper">
              <Bar data={chartData} options={chartOptions} plugins={[zeroLinePlugin]} />
            </div>

            <div className="chart-legend">
              <div className="legend-item"><div className="legend-dot" style={{ background: '#16a34a' }}></div> Rentabilidad neta</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#86efac', border: '2px solid #16a34a' }}></div> Escenario óptimo</div>
              {/* Le quitamos el "No Factible" porque ya no existe esa regla */}
              <div className="legend-item"><div className="legend-dot" style={{ background: '#fca5a5', border: '2px dashed #dc2626' }}></div> Pérdida</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}