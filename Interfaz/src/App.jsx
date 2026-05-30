import { useState, useEffect } from 'react';
import Nav from './componentes/Nav';
import Formulario from './componentes/Formulario';
import Resultados from './componentes/Resultados';
import Dashboard from './componentes/Dashboard';
import Historial from './componentes/Historial';
import { generarCantidadLote, binomial } from './componentes/Distribuciones';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [vista, setVista] = useState('simulacion'); // 'simulacion' | 'dashboard' | 'historial'
  const [apiStatus, setApiStatus] = useState('online');
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => { if (data.status !== 'ok') setApiStatus('offline'); })
      .catch(() => setApiStatus('offline'));
  }, []);

  const cargarDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard`);
      const data = await res.json();
      setDashboard(data);
    } catch (_) {}
  };

  const cargarHistorial = async () => {
    try {
      const res = await fetch(`${API_URL}/historial?limit=50`);
      const data = await res.json();
      setHistorial(data.simulaciones || []);
    } catch (_) {}
  };

  const cambiarVista = (v) => {
    setVista(v);
    if (v === 'dashboard') cargarDashboard();
    if (v === 'historial') cargarHistorial();
  };

  const ejecutarSimulacion = async (parametros) => {

  const loteMin = Number(parametros.lote_min);
  const loteMax = Number(parametros.lote_max);

  const cantidadEntrante =
    generarCantidadLote(loteMin, loteMax);

  let mouses = 0;
  let teclados = 0;
   for (let i = 0; i < cantidadEntrante; i++) {
// AQUI DEFINIMOS LA PROBABILIDAD DE QUE SEA MOUSE O TECLADO
    const tipo = binomial(
      0.5,
      "mouse",
      "teclado"
    );

    if (tipo === "mouse") {
      mouses++;
    } else {
      teclados++;
    }
  }


  console.log("Cantidad total:", cantidadEntrante);
  console.log("Mouses:", mouses);
  console.log("Teclados:", teclados);


    setLoading(true);
    try {
      const queryParams = new URLSearchParams(parametros);
      const res = await fetch(`${API_URL}/simular?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Error en la simulación');
      const data = await res.json();
      setResultados(data);
    } catch (error) {
      alert('Error al conectar con la API: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = async (id) => {
    try {
      const res = await fetch(`${API_URL}/historial/${id}`);
      const data = await res.json();
      setResultados(data);
      setVista('simulacion');
    } catch (_) {}
  };

  const limpiarHistorial = async () => {
    if (!confirm('¿Limpiar todo el historial?')) return;
    await fetch(`${API_URL}/historial`, { method: 'DELETE' });
    setHistorial([]);
    setDashboard(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Nav vista={vista} onCambiarVista={cambiarVista} apiStatus={apiStatus} />

      <div className="w-full">
        {/* ── Vista Simulación ── */}
        {vista === 'simulacion' && (
          <main className="max-w-[1400px] my-10 mx-auto px-4 grid grid-cols-[360px_minmax(0,1fr)] gap-8 items-start">
            <Formulario onSimular={ejecutarSimulacion} isLoading={loading} />
            {resultados && <Resultados data={resultados} />}
            {!resultados && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <p className="text-sm font-medium">Configurá los parámetros y ejecutá la simulación</p>
              </div>
            )}
          </main>
        )}

        {/* ── Vista Dashboard ── */}
        {vista === 'dashboard' && (
          <main className="max-w-[1400px] my-10 mx-auto px-4">
            <Dashboard data={dashboard} onRefresh={cargarDashboard} />
          </main>
        )}

        {/* ── Vista Historial ── */}
        {vista === 'historial' && (
          <main className="max-w-[1400px] my-10 mx-auto px-4">
            <Historial
              simulaciones={historial}
              onVerDetalle={verDetalle}
              onLimpiar={limpiarHistorial}
              onRefresh={cargarHistorial}
              apiUrl={API_URL}
            />
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
