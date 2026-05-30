/*Aqui haremos las distribuciones para tenerlas a mano y solo llamar
 a las funciones mas adelante */
export function generarCantidadLote(min, max) {
  const valor = Math.floor(
    Math.random() * (max - min + 1)
  ) + min;

  return valor;
}
// Aqui le mandamos la u, y los resultado de exito y fracaso

export function binomial(
  probabilidad,
  resultadoExito,
  resultadoFracaso
) {
  const rnd = Math.random();

  return rnd <= probabilidad
    ? resultadoExito
    : resultadoFracaso;
}

//Aqui realizamos la normal mandandole la media y la desviacion estandar
export function normal(
  media,
  desviacion
) {

  const u1 = Math.random();
  const u2 = Math.random();

  const z =
    Math.sqrt(-2 * Math.log(u1)) *
    Math.cos(2 * Math.PI * u2);

  return media + z * desviacion;
}

// Distribución exponencial, útil para modelar tiempos entre eventos

export function exponencial(beta) {
  const u = Math.random();
  return -beta * Math.log(u);
}