import { useState, useEffect } from 'react';
import Header from './componentes/Header';
import Formulario from './componentes/Formulario';
import Resultados from './componentes/Resultados';
import Nav from './componentes/Nav';

const API_URL = 'https://logica-puroscrap-simulador-production.up.railway.app/';

function App() {
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
      setResultados(data); // Esto automáticamente actualiza la vista
    } catch (error) {
      alert('Error al conectar con la API: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Nav></Nav> 
      <div className="w-full">
        <main className="max-w-310 my-10 mx-auto px-0 grid grid-cols-[360px_minmax(0,1fr)] gap-8 items-start">
          <Formulario onSimular={ejecutarSimulacion} isLoading={loading} />
          {resultados && <Resultados data={resultados} />}
        </main>
      </div>
    </div>
      
    
  );
}

export default App;
