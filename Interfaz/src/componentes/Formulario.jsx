import "../styless/Formulario.css";
import { useState } from "react";
export default function Formulario({ onSimular, isLoading }) {
  
  const [minEmp, setMinEmp] = useState(1);
  const [maxEmp, setMaxEmp] = useState(8);

  const handleMinBlur = (e) => {
    let val = parseInt(e.target.value, 10);
    if (!val || val < 1) val = 1;
    if (val > maxEmp) val = maxEmp; // Nunca mayor que el máximo
    setMinEmp(val);
  };

  const handleMaxBlur = (e) => {
    let val = parseInt(e.target.value, 10);
    if (!val) val = maxEmp;
    if (val < minEmp) val = minEmp; // Nunca menor que el mínimo
    setMaxEmp(val);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Captura todos los inputs que tengan el atributo "name"
    const formData = new FormData(e.target);
    const parametros = Object.fromEntries(formData.entries());
    
    onSimular(parametros);
  };

  const preventInvalidChars = (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const enforceMaxValue = (e) => {
    // Usamos 'let' para permitir que 'value' sea modificado más abajo
    let { value, max } = e.target;

    // 1. Limpiar ceros a la izquierda
    if (value.length > 1 && value.startsWith('0')) {
      value = value.replace(/^0+(?=\d)/, '');
      e.target.value = value; 
    }
    
    // Si el input está vacío o no tiene un máximo definido, no hacemos nada
    if (value === "" || !max) return;

    // 2. Clavar el número en el máximo permitido
    if (parseInt(value, 10) > parseInt(max, 10)) {
      e.target.value = max; 
    }
  };

  return (
    <section className="card">
      <h2>Parámetros de Simulación</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-section-label">Inventario</div>
        <div className="form-group">
          <label>Cantidad de Mouses</label>
          <input type="number" name="cant_mouses" min="0" defaultValue="100" min="1" required max="10000" onKeyDown={preventInvalidChars} onInput={enforceMaxValue} />
        </div>
        <div className="form-group">
          <label>Cantidad de Teclados</label>
          <input type="number" name="cant_teclados" min="0" defaultValue="50" min="1" required max="10000" onKeyDown={preventInvalidChars} onInput={enforceMaxValue} />
        </div>

        <div className="section-divider"></div>
        <div className="form-section-label">Personal & Capacidad</div>

        <div className="row">
          <div className="form-group">
            <label>Min Empleados</label>
            <input 
              type="number" 
              name="min_empleados" 
              min="1" 
              max={maxEmp} 
              value={minEmp} 
              onChange={(e) => setMinEmp(e.target.value)} 
              onBlur={handleMinBlur} 
              onKeyDown={(e) => e.preventDefault()}
              required
            />
          </div>
          <div className="form-group">
            <label>Max Empleados</label>
            <input 
              type="number" 
              name="max_empleados" 
              min={minEmp} 
              max="1000" 
              value={maxEmp} 
              onChange={(e) => setMaxEmp(e.target.value)} 
              onBlur={handleMaxBlur} 
              onKeyDown={(e) => e.preventDefault()}
              required 
            />
          </div>
        </div>

  

        <div className="section-divider"></div>
        <div className="form-section-label">Costos</div>

        <div className="row">
          <div className="form-group">
            <label>Costo Hora ($)</label>
            <input type="number" name="costo_hora" defaultValue="4500" min="0" step="100" max="100000"  onKeyDown={preventInvalidChars} onInput={enforceMaxValue} required/>
          </div>
          <div className="form-group">
            <label>Horas Jorn.</label>
            <input type="number" name="horas_jornada" value={8} readOnly/>
          </div>
        </div>

        <div className="form-group">
          <label>Costo por Unidad ($/día)</label>
          <input type="number" name="costo_fijo_diario" min="0" defaultValue="20000" step="100" max="1000000"  onKeyDown={preventInvalidChars} onInput={enforceMaxValue} required/>
        </div>

        <div className="section-divider"></div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Simulando...' : 'Ejecutar Simulación'}
        </button>
      </form>
    </section>
  );
}