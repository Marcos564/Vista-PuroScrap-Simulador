// ── Generadores estadísticos ──────────────────────────────────────────────────

/** Normal Box-Muller, resultado >= 0 */
function normal(media, desv) {
  let u, v;
  do { u = Math.random(); } while (u === 0);
  do { v = Math.random(); } while (v === 0);
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.max(0, media + desv * z);
}

/** Uniforme discreta [min, max] */
function uniformeDiscreta(min, max) {
  return Math.floor(min + (max - min + 1) * Math.random());
}

/** Bernoulli individual — devuelve true con probabilidad p */
function bernoulli(p) {
  return Math.random() < p;
}

// ── Constantes del modelo ─────────────────────────────────────────────────────
const PROB_MOUSE        = 0.50; // 50% del lote son mouses
const PROB_REUTILIZABLE = 0.60; // 60% de cada tipo es reutilizable

const PRECIO_COBRE  = 13.7;  // $/g
const PRECIO_HIERRO = 0.50;  // $/g

const PCT_REUTILIZABLE = 0.25; // 25% del peso → material reutilizable
const PCT_PELIGROSO    = 0.03; // 3%  del peso → residuo peligroso

const MINUTOS_JORNADA = 480;   // 8 h × 60 min

// ── Motor de simulación ───────────────────────────────────────────────────────

/**
 * @param {object} p
 * @param {number} p.loteMin
 * @param {number} p.loteMax
 * @param {number} p.operarios
 * @param {number} p.costoHora
 * @param {number} p.costoDiarioPorUnidad
 */
export function ejecutarSimulacion(p) {
  const { loteMin, loteMax, operarios, costoHora, costoDiarioPorUnidad } = p;

  // ── 1. Llegada del lote: Uniforme(loteMin, loteMax) ──────────────────────
  const cantidadEntrante = uniformeDiscreta(loteMin, loteMax);

  // ── 2. Clasificación por tipo: Binomial(PROB_MOUSE) ──────────────────────
  let cantMouses = 0;
  for (let i = 0; i < cantidadEntrante; i++) {
    if (bernoulli(PROB_MOUSE)) cantMouses++;
  }
  const cantTeclados = cantidadEntrante - cantMouses;

  // ── 3. Clasificación mouses: Binomial(PROB_REUTILIZABLE) ─────────────────
  let mousesReutilizables = 0;
  for (let i = 0; i < cantMouses; i++) {
    if (bernoulli(PROB_REUTILIZABLE)) mousesReutilizables++;
  }
  const mousesReciclables = cantMouses - mousesReutilizables;

  // ── 4. Clasificación teclados: Binomial(PROB_REUTILIZABLE) ───────────────
  let tecladosReutilizables = 0;
  for (let i = 0; i < cantTeclados; i++) {
    if (bernoulli(PROB_REUTILIZABLE)) tecladosReutilizables++;
  }
  const tecladosReciclables = cantTeclados - tecladosReutilizables;

  // ── 5. Reciclaje de mouses ────────────────────────────────────────────────
  // Peso:   Normal(100, 10)
  // Cobre:  Uniforme(15, 30)
  // Hierro: Uniforme(50, 150)
  let totalMaterialReutilizable = 0;
  let totalResiduoPeligroso     = 0;
  let totalCobreRecuperado      = 0;
  let totalHierroRecuperado     = 0;
  let ingresoReciclajeM         = 0;

  for (let i = 0; i < mousesReciclables; i++) {
    const peso   = normal(100, 10);
    const cobre  = Math.max(0, 15 + (30 - 15) * Math.random()); // Uniforme(15,30)
    const hierro = Math.max(0, 50 + (150 - 50) * Math.random()); // Uniforme(50,150)

    totalMaterialReutilizable += peso * PCT_REUTILIZABLE;
    totalResiduoPeligroso     += peso * PCT_PELIGROSO;
    totalCobreRecuperado      += cobre;
    totalHierroRecuperado     += hierro;
    ingresoReciclajeM         += cobre * PRECIO_COBRE + hierro * PRECIO_HIERRO;
  }

  // ── 6. Reciclaje de teclados ──────────────────────────────────────────────
  // Peso:   Normal(100, 10)
  // Cobre:  Normal(10, 1.6)
  // Hierro: Normal(7, 1.6)
  let ingresoReciclajeT = 0;

  for (let i = 0; i < tecladosReciclables; i++) {
    const peso   = normal(100, 10);
    const cobre  = normal(10, 1.6);
    const hierro = normal(7, 1.6);

    totalMaterialReutilizable += peso * PCT_REUTILIZABLE;
    totalResiduoPeligroso     += peso * PCT_PELIGROSO;
    totalCobreRecuperado      += cobre;
    totalHierroRecuperado     += hierro;
    ingresoReciclajeT         += cobre * PRECIO_COBRE + hierro * PRECIO_HIERRO;
  }

  const ingresoReciclaje = ingresoReciclajeM + ingresoReciclajeT;

  // ── 7. Reutilización mouses: 6000 + 6000·u → [6000, 12000] ──────────────
  let ingresoReutilizacionM = 0;
  for (let i = 0; i < mousesReutilizables; i++) {
    ingresoReutilizacionM += 6000 + 6000 * Math.random();
  }

  // ── 8. Reutilización teclados: 5000 + 3000·u → [5000, 8000] ─────────────
  let ingresoReutilizacionT = 0;
  for (let i = 0; i < tecladosReutilizables; i++) {
    ingresoReutilizacionT += 5000 + 3000 * Math.random();
  }

  const ingresoReutilizacion = ingresoReutilizacionM + ingresoReutilizacionT;

  // ── 9. Ingreso total ──────────────────────────────────────────────────────
  const ingresoTotal = ingresoReciclaje + ingresoReutilizacion;

  // ── 10. Tiempo de procesamiento: Normal(420, 60) por periférico ───────────
  let tiempoTotalProceso = 0;
  for (let i = 0; i < cantidadEntrante; i++) {
    tiempoTotalProceso += normal(420, 60);
  }

  // ── 11. Días requeridos ───────────────────────────────────────────────────
  const capacidadDiaria = operarios * MINUTOS_JORNADA;
  const diasTrabajo     = Math.ceil(tiempoTotalProceso / capacidadDiaria);

  // ── 12. Tiempo restante ───────────────────────────────────────────────────
  const tiempoDisponible = diasTrabajo * capacidadDiaria;
  const diferencia       = tiempoDisponible - tiempoTotalProceso;
  const tiempoRestante   = diferencia > 0 ? diferencia : 0;
  const tiempoFaltante   = 0; // ceil garantiza que nunca falte

  // ── 13. Costo laboral ─────────────────────────────────────────────────────
  const costoLaboral = (tiempoTotalProceso / 60) * costoHora;

  // ── 14. Costo almacenamiento ──────────────────────────────────────────────
  const costoAlmacenamiento =
    diasTrabajo <= 1
      ? 0
      : (diasTrabajo - 1) * costoDiarioPorUnidad * (cantidadEntrante / 2);

  // ── 15. Costo total y rentabilidad ────────────────────────────────────────
  const costoTotal   = costoLaboral + costoAlmacenamiento;
  const rentabilidad = ingresoTotal - costoTotal;

  const r2 = (v) => Math.round(v * 100) / 100;

  return {
    // Lote
    cantidadEntrante,
    cantMouses,
    cantTeclados,
    // Clasificación
    mousesReutilizables,
    mousesReciclables,
    tecladosReutilizables,
    tecladosReciclables,
    // Recuperación
    totalMaterialReutilizable: r2(totalMaterialReutilizable),
    totalResiduoPeligroso:     r2(totalResiduoPeligroso),
    totalCobreRecuperado:      r2(totalCobreRecuperado),
    totalHierroRecuperado:     r2(totalHierroRecuperado),
    // Tiempos
    operarios,
    tiempoTotalProceso: r2(tiempoTotalProceso),
    tiempoTotalHoras:   r2(tiempoTotalProceso / 60),
    capacidadDiaria,
    diasTrabajo,
    tiempoRestante:     r2(tiempoRestante),
    tiempoFaltante,
    // Ingresos
    ingresoReciclaje:     r2(ingresoReciclaje),
    ingresoReutilizacion: r2(ingresoReutilizacion),
    ingresoTotal:         r2(ingresoTotal),
    // Costos
    costoLaboral:         r2(costoLaboral),
    costoAlmacenamiento:  r2(costoAlmacenamiento),
    costoTotal:           r2(costoTotal),
    // Resultado
    rentabilidad: r2(rentabilidad),
    esGanancia:   rentabilidad >= 0,
  };
}
