/*Aqui haremos las distribuciones para tenerlas a mano y solo llamar
 a las funciones mas adelante */
export function generarCantidadLote(min, max) {
  const valor = Math.floor(
    Math.random() * (max - min + 1)
  ) + min;

  return valor;
}