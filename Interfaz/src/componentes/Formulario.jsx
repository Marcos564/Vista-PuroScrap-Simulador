export default function Formulario({ onSimular, isLoading }) {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Captura todos los inputs que tengan el atributo "name"
    const formData = new FormData(e.target);
    const parametros = Object.fromEntries(formData.entries());
    
    // Elimina la semilla si está vacía para no mandarla al backend
    if (!parametros.semilla) delete parametros.semilla;
    
    onSimular(parametros);
  };

  return (
    <section className="card">
      <h2>Parámetros de Simulación</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-section-label">Inventario</div>
        <div className="form-group">
          <label>Cantidad de Mouses</label>
          <input type="number" name="cant_mouses" min="0" defaultValue="100" min="1" required />
        </div>
        <div className="form-group">
          <label>Cantidad de Teclados</label>
          <input type="number" name="cant_teclados" min="0" defaultValue="50" min="1" required />
        </div>

        <div className="section-divider"></div>
        <div className="form-section-label">Personal & Capacidad</div>

        <div className="row">
          <div className="form-group">
            <label>Min Empleados</label>
            <input type="number" name="min_empleados" min="0" defaultValue="1" min="1" />
          </div>
          <div className="form-group">
            <label>Max Empleados</label>
            <input type="number" name="max_empleados" min="0" defaultValue="8" min="1" />
          </div>
        </div>

        <div className="form-group">
          <label>Capacidad Mesas (Máx)</label>
          <input type="number" name="cantidad_mesas" min="0" defaultValue="5" min="1" />
        </div>

        <div className="section-divider"></div>
        <div className="form-section-label">Costos</div>

        <div className="row">
          <div className="form-group">
            <label>Costo Hora ($)</label>
            <input type="number" name="costo_hora" defaultValue="4500" min="1" step="100" />
          </div>
          <div className="form-group">
            <label>Horas Jorn.</label>
            <input type="number" name="horas_jornada" value={8} readOnly/>
          </div>
        </div>

        <div className="form-group">
          <label>Costo Fijo Diario ($)</label>
          <input type="number" name="costo_fijo_diario" min="1" defaultValue="20000" step="100" />
        </div>

        <div className="section-divider"></div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Simulando...' : 'Ejecutar Simulación'}
        </button>
      </form>
    </section>
  );
}