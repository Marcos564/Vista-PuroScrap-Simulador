// =====================================
// PARÁMETROS GENERALES DEL SISTEMA
// =====================================

// Tiempo entre eventos (Exponencial)
// T = -BETA * ln(U)
export const TIEMPO_BETA = 12;

// Probabilidad de que un periférico sea mouse
export const PROB_MOUSE = 0.5;

// Probabilidad de que sea reutilizable
export const PROB_REUTILIZABLE = 0.6;


// =====================================
// MOUSE RECICLABLE
// =====================================

// Peso total ~ N(media, desvío)
export const MOUSE_PESO_MEDIA = 100;
export const MOUSE_PESO_DESVIO = 10;

// Cobre recuperable ~ N(media, desvío)
export const MOUSE_COBRE_MEDIA = 15;
export const MOUSE_COBRE_DESVIO = 30;

// Hierro recuperable ~ N(media, desvío)
export const MOUSE_HIERRO_MEDIA = 50;
export const MOUSE_HIERRO_DESVIO = 150;


// =====================================
// TECLADO RECICLABLE
// =====================================

export const TECLADO_PESO_MEDIA = 100;
export const TECLADO_PESO_DESVIO = 10;

export const TECLADO_COBRE_MEDIA = 10;
export const TECLADO_COBRE_DESVIO = 1.6;

export const TECLADO_HIERRO_MEDIA = 7;
export const TECLADO_HIERRO_DESVIO = 1.6;


// =====================================
// PORCENTAJES DE MASA
// =====================================

export const PORC_MASA_RECICLABLE = 0.72;
export const PORC_MASA_REUTILIZABLE = 0.25;
export const PORC_MASA_PELIGROSA = 0.03;


// =====================================
// PRECIOS DE VENTA
// =====================================

// $/gramo o unidad según tu modelo
export const PRECIO_COBRE = 13.7;
export const PRECIO_HIERRO = 0.50;


// =====================================
// REUTILIZACIÓN
// =====================================

// Mouse:
// Ingreso = 6000 + 6000u
export const MOUSE_REUTIL_BASE = 6000;
export const MOUSE_REUTIL_RANGO = 6000;

// Teclado:
// Ingreso = 5000 + 3000u
export const TECLADO_REUTIL_BASE = 5000;
export const TECLADO_REUTIL_RANGO = 3000;