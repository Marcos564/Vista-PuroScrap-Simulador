import "../styless/Formulario.css";

export default function Formulario({ onSimular, isLoading }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const parametros = Object.fromEntries(formData.entries());

    if (!parametros.semilla) delete parametros.semilla;
    if (!parametros.nombre) delete parametros.nombre;

    onSimular(parametros);
  };

  const preventInvalidChars = (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
  };

  const enforceMaxValue = (e) => {
    let { value, max } = e.target;

    if (value.length > 1 && value.startsWith('0')) {
      value = value.replace(/^0+(?=\d)/, '');
      e.target.value = value;
    }

    if (value === "" || !max) return;

    if (parseInt(value, 10) > parseInt(max, 10)) {
      e.target.value = max;
    }
  };

  return (
    <section className="card">
      <h2>Parámetros de Simulación</h2>

      <form onSubmit={handleSubmit}>

        {/* IDENTIFICACIÓN */}
        <div className="form-section-label">
          Identificación
        </div>

        <div className="form-group">
          <label>Nombre (opcional)</label>
          <input
            type="text"
            name="nombre"
            placeholder="Ej: Lote Enero 2025"
            maxLength={60}
          />
        </div>

        {/* NUEVA SECCIÓN */}
        <div className="section-divider"></div>

        <div className="form-section-label">
          Llegada de Lotes
        </div>

        <div className="row">

          <div className="form-group">
            <label>Lote Mínimo</label>
            <input
              type="number"
              name="lote_min"
              defaultValue="50"
              min="1"
              max="100000"
              required
              onKeyDown={preventInvalidChars}
              onInput={enforceMaxValue}
            />
          </div>

          <div className="form-group">
            <label>Lote Máximo</label>
            <input
              type="number"
              name="lote_max"
              defaultValue="200"
              min="1"
              max="100000"
              required
              onKeyDown={preventInvalidChars}
              onInput={enforceMaxValue}
            />
          </div>

        </div>

        {/* INVENTARIO */}
        <div className="section-divider"></div>

        <div className="form-section-label">
          Inventario
        </div>

        <div className="form-group">
          <label>Cantidad de Mouses</label>
          <input
            type="number"
            name="cant_mouses"
            defaultValue="100"
            min="1"
            required
            max="10000"
            onKeyDown={preventInvalidChars}
            onInput={enforceMaxValue}
          />
        </div>

        <div className="form-group">
          <label>Cantidad de Teclados</label>
          <input
            type="number"
            name="cant_teclados"
            defaultValue="50"
            min="1"
            required
            max="10000"
            onKeyDown={preventInvalidChars}
            onInput={enforceMaxValue}
          />
        </div>

        {/* PERSONAL */}
        <div className="section-divider"></div>

        <div className="form-section-label">
          Personal & Capacidad
        </div>

        <div className="row">
          <div className="form-group">
            <label>Min Empleados</label>
            <input
              type="number"
              name="min_empleados"
              defaultValue="1"
              min="1"
              max="50"
              required
              onKeyDown={preventInvalidChars}
              onInput={enforceMaxValue}
            />
          </div>

          <div className="form-group">
            <label>Max Empleados</label>
            <input
              type="number"
              name="max_empleados"
              defaultValue="8"
              min="1"
              max="50"
              required
              onKeyDown={preventInvalidChars}
              onInput={enforceMaxValue}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Capacidad Mesas (Máx)</label>
          <input
            type="number"
            name="cantidad_mesas"
            defaultValue="5"
            min="1"
            max="50"
            required
            onKeyDown={preventInvalidChars}
            onInput={enforceMaxValue}
          />
        </div>

        {/* COSTOS */}
        <div className="section-divider"></div>

        <div className="form-section-label">
          Costos
        </div>

        <div className="row">

          <div className="form-group">
            <label>Costo Hora ($)</label>
            <input
              type="number"
              name="costo_hora"
              defaultValue="4500"
              min="0"
              step="100"
              max="100000"
              required
              onKeyDown={preventInvalidChars}
              onInput={enforceMaxValue}
            />
          </div>

          <div className="form-group">
            <label>Horas Jorn.</label>
            <input
              type="number"
              name="horas_jornada"
              value={8}
              readOnly
            />
          </div>

        </div>

        <div className="form-group">
          <label>Costo Fijo Diario ($)</label>
          <input
            type="number"
            name="costo_fijo_diario"
            defaultValue="20000"
            min="0"
            step="100"
            max="1000000"
            required
            onKeyDown={preventInvalidChars}
            onInput={enforceMaxValue}
          />
        </div>

        {/* SEMILLA */}
        <div className="section-divider"></div>

        <div className="form-section-label">
          Reproducibilidad
        </div>

        <div className="form-group">
          <label>Semilla aleatoria (opcional)</label>
          <input
            type="number"
            name="semilla"
            placeholder="Dejar vacío para aleatorio"
            min="0"
            onKeyDown={preventInvalidChars}
          />
        </div>

        {/* BOTÓN */}
        <div className="section-divider"></div>

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading
            ? (
              <>
                <span className="loader-inline" />
                Simulando...
              </>
            )
            : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>

                Ejecutar Simulación
              </>
            )
          }
        </button>

      </form>
    </section>
  );
}