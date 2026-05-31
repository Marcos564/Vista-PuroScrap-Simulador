import { useState, useEffect } from 'react';
import Formulario from './Formulario';
import Resultados from './Resultados';

const API_URL = 'http://127.0.0.1:8000';

const Simulador = () => {
  const [apiStatus, setApiStatus] = useState('online');
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => { if (data.status !== 'ok') setApiStatus('offline'); })
      .catch(() => setApiStatus('offline'));
  }, []);

  const ejecutarSimulacion = async (parametros) => {
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

  return (
    <main className="max-w-300 w-full my-10 mx-auto px-6 grid grid-cols-1 md:grid-cols-[360px_minmax(0,1fr)] gap-8 items-start animate-fade-in">
      <Formulario onSimular={ejecutarSimulacion} isLoading={loading} />
      {resultados ? (
        <Resultados data={resultados} />
      ) : (
        <div className="bg-white w-full h-full min-h-125 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
          <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">No hay datos aún</p>
          <p className="text-sm mt-1">Completa el formulario y ejecuta la simulación para ver los resultados aquí.</p>
        </div>
      )}
    </main>
  );
};

export default Simulador;