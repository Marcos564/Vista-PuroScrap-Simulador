import { useState } from 'react';
import Nav from './componentes/Nav';
import Formulario from './componentes/Formulario';
import Resultados from './componentes/Resultados';
import { ejecutarSimulacion } from './simulacion';

function App() {
  const [resultado, setResultado] = useState(null);
  const [nombre,    setNombre]    = useState(null);

  const handleSimular = (params) => {
    if (params.loteMin > params.loteMax) {
      alert('El lote mínimo no puede ser mayor que el lote máximo.');
      return;
    }
    setNombre(params.nombre);
    setResultado(ejecutarSimulacion(params));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Nav />

      <main
        style={{
          maxWidth: 1400,
          margin: '2.5rem auto',
          padding: '0 1.5rem',
          display: 'grid',
          gridTemplateColumns: '360px minmax(0, 1fr)',
          gap: '2rem',
          alignItems: 'start',
          width: '100%',
        }}
      >
        <Formulario onSimular={handleSimular} />

        {resultado ? (
          <Resultados data={resultado} nombre={nombre} />
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: 320, gap: 12,
            color: 'var(--text-muted)',
          }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
              <polyline points="1 4 1 10 7 10" />
              <polyline points="23 20 23 14 17 14" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              Configurá los parámetros y ejecutá la simulación
            </p>
          </div>
        )}
      </main>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          main { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default App;
