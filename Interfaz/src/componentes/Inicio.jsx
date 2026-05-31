import { Link } from 'react-router-dom';

const pasos = [
  { n: '1', title: 'Ingresa los datos', desc: 'Completa el formulario con los parámetros iniciales de los equipos que ingresan al sistema.' },
  { n: '2', title: 'Inicia el proceso', desc: 'Haz clic en "Simular" para calcular automáticamente el flujo logístico y los costos.' },
  { n: '3', title: 'Analiza el impacto', desc: 'Revisa a la derecha el balance económico y las métricas de rendimiento generadas.' },
  { n: '4', title: 'Exporta la información', desc: 'Utiliza el menú superior para descargar tu reporte en formato Excel o PDF.' },
];

const Inicio = () => {
  return (
    <div style={{ width: '100%', flexGrow: 1, display: 'flex', justifyContent: 'center', backgroundColor: '#f6f7f5', padding: '3rem 1.5rem 4rem', boxSizing: 'border-box' }}>
      <main style={{ maxWidth: '640px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '5px 14px', marginBottom: '1.25rem', alignSelf: 'center', width: 'fit-content', boxSizing: 'border-box' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#14532d', letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Simulador de Reciclaje
          </span>
        </div>

        {/* Título */}
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#111827', textAlign: 'center', margin: '0 0 0.5rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          Bienvenido al Simulador de <span style={{ color: '#16a34a' }}>PuroScrap</span>
        </h1>
        <p style={{ fontSize: '14.5px', color: '#6b7280', textAlign: 'center', margin: '0 0 2rem', maxWidth: '380px', lineHeight: 1.65 }}>
          Modelá, simulá y optimizá el flujo de reciclaje de periféricos informáticos en un solo lugar.
        </p>

        {/* Card */}
        <div style={{ background: '#ffffff', width: '100%', border: '1px solid #e5e7eb', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.75rem', overflow: 'hidden', boxSizing: 'border-box' }}>

          {/* Sección: Objetivo */}
          <div style={{ padding: '1.6rem 1.75rem', borderBottom: '1px solid #f3f4f6', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>¿Para qué sirve esta herramienta?</h2>
            </div>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.75, margin: 0 }}>
              Esta plataforma está diseñada para modelar y optimizar el proceso de reciclaje y reutilización de periféricos informáticos (mouses y teclados). Su objetivo es simular todo el flujo físico de los dispositivos —desde que ingresan al sistema— para proyectar con precisión los resultados económicos y operativos de la empresa.
            </p>
          </div>

          {/* Sección: Pasos */}
          <div style={{ padding: '1.6rem 1.75rem', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
              <div style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="14 2 18 6 7 17 3 17 3 13 14 2" /><line x1="3" y1="22" x2="21" y2="22" />
                </svg>
              </div>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>¿Cómo realizar una simulación?</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {pasos.map((paso, i) => (
                <div key={paso.n} style={{ display: 'flex', flexDirection: 'row', gap: '14px', alignItems: 'stretch', width: '100%' }}>

                  {/* Conector */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '30px' }}>
                    <div style={{ width: '30px', height: '30px', minWidth: '30px', borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>{paso.n}</span>
                    </div>
                    {i < pasos.length - 1 && (
                      <div style={{ width: '1.5px', background: '#bbf7d0', flex: 1, margin: '3px 0' }} />
                    )}
                  </div>

                  {/* Texto */}
                  <div style={{ paddingBottom: i < pasos.length - 1 ? '1.25rem' : 0, paddingTop: '4px', flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: '0 0 3px', lineHeight: 1.3 }}>{paso.title}</h3>
                    <p style={{ fontSize: '13.5px', color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{paso.desc}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botón */}
        <Link
          to="/simulador"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#16a34a', color: '#ffffff', fontSize: '15px', fontWeight: 700, padding: '11px 32px', borderRadius: '12px', border: 'none', textDecoration: 'none', cursor: 'pointer', alignSelf: 'center', width: 'fit-content', whiteSpace: 'nowrap', boxSizing: 'border-box' }}
          onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
          onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
        >
          Empezar
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

      </main>
    </div>
  );
};

export default Inicio;