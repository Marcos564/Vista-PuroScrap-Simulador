import "../styless/Formulario.css";

export default function FormularioLote({ onSimular, isLoading }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const p = Object.fromEntries(fd.entries());
    onSimular(p);
  };

  const noNeg = (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
  };

  const clampMax = (e) => {
    const { value, max } = e.target;
    if (value.length > 1 && value.startsWith('0'))
      e.target.value = value.replace(/^0+(?=\d)/, '');
    if (value !== '' && max && parseInt(value, 10) > parseInt(max, 10))
      e.target.value = max;
  };

  return (
    <section className="card">
      <h2>Simulación por Lote</h2>
      <form onSubmit={handleSubmit}>

        {/* Rango de lote */}
        <div className="form-section-label">Rango de Lote</div>
        <div className="row">
          <div className="form-group">
            <label>Mín. periféricos</label>
            <input
              type="number" name="min_lote"
              defaultValue="100" min="1" max="20000" required
              onKeyDown={noNeg} onInput={clampMax}
            />
          </div>
          <div className="form-group">
            <label>Máx. periféricos</label>
            <input
              type="number" name="max_lote"
              defaultValue="500" min="1" max="20000" required
              onKeyDown={noNeg} onInput={clampMax}
            />
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
          El lote se genera aleatoriamente dentro del rango (distribución uniforme). Se divide 60% mouses / 40% teclados.
        </p>

        {/* Operarios */}
        <div className="section-divider" />
        <div className="form-section-label">Operarios</div>
        <div className="form-group">
          <label>Cantidad de Operarios</label>
          <input
            type="number" name="cantidad_mesas"
            defaultValue="5" min="1" max="50" required
            onKeyDown={noNeg} onInput={clampMax}
          />
        </div>

        {/* Costos */}
        <div className="section-divider" />
        <div className="form-section-label">Costos</div>
        <div className="row">
          <div className="form-group">
            <label>Costo Hora ($)</label>
            <input type="number" name="costo_hora" defaultValue="4500" min="0" step="100" max="100000" required onKeyDown={noNeg} onInput={clampMax} />
          </div>
          <div className="form-group">
            <label>Horas Jorn.</label>
            <input type="number" name="horas_jornada" value={8} readOnly />
          </div>
        </div>
        <div className="form-group">
          <label>Costo Fijo Diario ($)</label>
          <input type="number" name="costo_fijo_diario" defaultValue="20000" min="0" step="100" max="1000000" required onKeyDown={noNeg} onInput={clampMax} />
        </div>

        <div className="section-divider" />
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading
            ? <><span className="loader-inline" /> Simulando...</>
            : <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Ejecutar Simulación
              </>
          }
        </button>
      </form>
    </section>
  );
}
