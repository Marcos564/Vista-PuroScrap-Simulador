import '../styless/Formulario.css';

export default function Formulario({ onSimular }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd  = new FormData(e.target);
    const raw = Object.fromEntries(fd.entries());

    onSimular({
      nombre:               raw.nombre?.trim() || null,
      loteMin:              parseInt(raw.loteMin),
      loteMax:              parseInt(raw.loteMax),
      operarios:            parseInt(raw.operarios),
      costoHora:            parseFloat(raw.costoHora),
      costoDiarioPorUnidad: parseFloat(raw.costoDiarioPorUnidad),
    });
  };

  const noNeg = (e) => {
    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
  };

  const clamp = (e) => {
    const { value, max } = e.target;
    if (value.length > 1 && value.startsWith('0'))
      e.target.value = value.replace(/^0+(?=\d)/, '');
    if (max && parseInt(value) > parseInt(max))
      e.target.value = max;
  };

  return (
    <section className="card">
      <h2>Parámetros de Simulación</h2>
      <form onSubmit={handleSubmit}>

        {/* Identificación */}
        <div className="form-section-label">Identificación</div>
        <div className="form-group">
          <label>Nombre de simulación</label>
          <input type="text" name="nombre" placeholder="Opcional" maxLength={60} />
        </div>

        {/* Llegada de lotes */}
        <div className="section-divider" />
        <div className="form-section-label">Llegada de Lotes</div>
        <div className="row">
          <div className="form-group">
            <label>Lote mínimo</label>
            <input
              type="number" name="loteMin"
              defaultValue="100" min="1" max="50000" required
              onKeyDown={noNeg} onInput={clamp}
            />
          </div>
          <div className="form-group">
            <label>Lote máximo</label>
            <input
              type="number" name="loteMax"
              defaultValue="500" min="1" max="50000" required
              onKeyDown={noNeg} onInput={clamp}
            />
          </div>
        </div>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '-0.4rem', marginBottom: '0.5rem' }}>
          Cantidad entrante ~ Uniforme(min, max). Se clasifica 50% mouses / 50% teclados.
        </p>

        {/* Personal */}
        <div className="section-divider" />
        <div className="form-section-label">Personal</div>
        <div className="form-group">
          <label>Cantidad de Operarios</label>
          <input
            type="number" name="operarios"
            defaultValue="5" min="1" max="200" required
            onKeyDown={noNeg} onInput={clamp}
          />
        </div>

        {/* Costos */}
        <div className="section-divider" />
        <div className="form-section-label">Costos</div>
        <div className="form-group">
          <label>Costo Hora Operario ($)</label>
          <input
            type="number" name="costoHora"
            defaultValue="4500" min="0" step="100" max="200000" required
            onKeyDown={noNeg} onInput={clamp}
          />
        </div>
        <div className="form-group">
          <label>Costo Diario por Unidad Almacenada ($)</label>
          <input
            type="number" name="costoDiarioPorUnidad"
            defaultValue="50" min="0" step="1" max="100000" required
            onKeyDown={noNeg} onInput={clamp}
          />
        </div>

        <div className="section-divider" />
        <button type="submit" className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Ejecutar Simulación
        </button>
      </form>
    </section>
  );
}
