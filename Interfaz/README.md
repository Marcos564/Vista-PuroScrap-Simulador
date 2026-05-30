# PuroScrap — Simulador de Reciclaje de Periféricos

Simulador web de procesamiento de residuos electrónicos (mouses y teclados).
Toda la lógica corre en el frontend, sin backend ni base de datos.

---

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 + Vite 8 |
| Estilos | Tailwind CSS 4 + CSS custom properties |
| Simulación | JavaScript puro (`simulacion.js`) |

---

## Instalación

```bash
cd "Front-TFI SIMULACION/Vista-PuroScrap-Simulador/Interfaz"
npm install
npm run dev
```

Disponible en `http://localhost:5173`.

---

## Parámetros de entrada

| Campo | Descripción | Ejemplo |
|---|---|---|
| Nombre | Identificador opcional | "Lote Enero" |
| Lote mínimo | Mínimo de periféricos que pueden llegar | 100 |
| Lote máximo | Máximo de periféricos que pueden llegar | 500 |
| Operarios | Cantidad de trabajadores disponibles | 5 |
| Costo hora operario | Costo por hora-hombre en $ | 4500 |
| Costo diario por unidad almacenada | Costo de almacenamiento por periférico por día | 50 |

---

## Proceso paso a paso con valores de ejemplo

Los valores de ejemplo asumen:
- Lote mínimo = 100, Lote máximo = 500
- Operarios = 5
- Costo hora = $4500
- Costo diario por unidad = $50

---

### Paso 1 — Llegada del lote

Se genera la cantidad de periféricos que ingresan usando una distribución **uniforme discreta**.

```
CantidadEntrante ~ Uniforme(100, 500)

Ejemplo: se sortea u = 0.62
CantidadEntrante = floor(100 + (500 - 100 + 1) × 0.62)
                 = floor(100 + 248.62)
                 = 348 periféricos
```

---

### Paso 2 — Clasificación por tipo (Binomial)

Cada uno de los 348 periféricos se evalúa individualmente con **Bernoulli(0.5)**.
Si el valor aleatorio < 0.5 → es mouse. Si no → es teclado.

```
Para cada periférico i de 1 a 348:
    si random() < 0.50 → mouse
    sino               → teclado

Ejemplo resultado:
    CantMouses   = 174   (≈ 50%)
    CantTeclados = 174   (≈ 50%)
    Total        = 348   ✓
```

---

### Paso 3 — Clasificación de mouses (Binomial)

Cada uno de los 174 mouses se evalúa con **Bernoulli(0.6)**.

```
Para cada mouse i de 1 a 174:
    si random() < 0.60 → reutilizable
    sino               → reciclable

Ejemplo resultado:
    MousesReutilizables = 106   (≈ 60%)
    MousesReciclables   =  68   (≈ 40%)
    Total               = 174   ✓
```

---

### Paso 4 — Clasificación de teclados (Binomial)

Mismo procedimiento para los 174 teclados.

```
Para cada teclado i de 1 a 174:
    si random() < 0.60 → reutilizable
    sino               → reciclable

Ejemplo resultado:
    TecladosReutilizables = 103   (≈ 60%)
    TecladosReciclables   =  71   (≈ 40%)
    Total                 = 174   ✓
```

---

### Paso 5 — Reciclaje de mouses (68 unidades)

Para **cada mouse reciclable** se generan tres valores aleatorios independientes:

```
Peso   ~ Normal(μ=100, σ=10)     [gramos]
Cobre  ~ Uniforme(15, 30)        [gramos]
Hierro ~ Uniforme(50, 150)       [gramos]
```

Con esos valores se calculan:

```
MaterialReutilizable = Peso × 0.25
ResiduoPeligroso     = Peso × 0.03
IngresoCobre         = Cobre  × $13.70
IngresoHierro        = Hierro × $0.50
IngresoMouse         = IngresoCobre + IngresoHierro
```

Ejemplo para un mouse individual:

```
Peso   = 97.3 g    → MaterialReutilizable = 97.3 × 0.25 = 24.3 g
                   → ResiduoPeligroso     = 97.3 × 0.03 =  2.9 g
Cobre  = 22.1 g    → IngresoCobre  = 22.1 × 13.70 = $302.77
Hierro = 88.4 g    → IngresoHierro = 88.4 ×  0.50 = $ 44.20
IngresoMouse = $302.77 + $44.20 = $346.97
```

Se acumula para los 68 mouses reciclables:

```
TotalMaterialReutilizable += 24.3 g  (por cada mouse)
TotalResiduoPeligroso     +=  2.9 g
TotalCobreRecuperado      += 22.1 g
TotalHierroRecuperado     += 88.4 g
IngresoReciclajeM         += $346.97
```

---

### Paso 6 — Reciclaje de teclados (71 unidades)

Mismo procedimiento, pero con distribuciones **normales** para cobre y hierro:

```
Peso   ~ Normal(μ=100, σ=10)    [gramos]
Cobre  ~ Normal(μ=10,  σ=1.6)   [gramos]
Hierro ~ Normal(μ=7,   σ=1.6)   [gramos]
```

Ejemplo para un teclado individual:

```
Peso   = 102.5 g   → MaterialReutilizable = 102.5 × 0.25 = 25.6 g
                   → ResiduoPeligroso     = 102.5 × 0.03 =  3.1 g
Cobre  =  10.3 g   → IngresoCobre  = 10.3 × 13.70 = $141.11
Hierro =   6.8 g   → IngresoHierro =  6.8 ×  0.50 = $  3.40
IngresoTeclado = $141.11 + $3.40 = $144.51
```

Al finalizar los 71 teclados, se acumula todo junto con los mouses:

```
IngresoReciclaje = IngresoReciclajeM + IngresoReciclajeT
                 = $23,594 + $10,260
                 = $33,854
```

---

### Paso 7 — Reutilización de mouses (106 unidades)

Para cada mouse reutilizable se genera un ingreso con **uniforme**:

```
IngresoMouse = 6000 + 6000 × u    donde u ~ Uniforme(0, 1)
Rango: [$6,000 — $12,000]
```

Ejemplo para tres mouses:

```
u = 0.73  → Ingreso = 6000 + 6000 × 0.73 = $10,380
u = 0.21  → Ingreso = 6000 + 6000 × 0.21 = $ 7,260
u = 0.95  → Ingreso = 6000 + 6000 × 0.95 = $11,700
...
IngresoReutilizacionM = Σ 106 valores ≈ $952,000
```

---

### Paso 8 — Reutilización de teclados (103 unidades)

```
IngresoTeclado = 5000 + 3000 × u    donde u ~ Uniforme(0, 1)
Rango: [$5,000 — $8,000]
```

Ejemplo para tres teclados:

```
u = 0.44  → Ingreso = 5000 + 3000 × 0.44 = $6,320
u = 0.88  → Ingreso = 5000 + 3000 × 0.88 = $7,640
u = 0.10  → Ingreso = 5000 + 3000 × 0.10 = $5,300
...
IngresoReutilizacionT = Σ 103 valores ≈ $672,000
```

---

### Paso 9 — Ingreso total

```
IngresoReutilizacion = IngresoReutilizacionM + IngresoReutilizacionT
                     = $952,000 + $672,000
                     = $1,624,000

IngresoTotal = IngresoReciclaje + IngresoReutilizacion
             = $33,854 + $1,624,000
             = $1,657,854
```

---

### Paso 10 — Tiempo de procesamiento

Para **cada uno de los 348 periféricos** se genera un tiempo individual:

```
TiempoProceso ~ Normal(μ=420, σ=60)    [minutos]
```

Ejemplo para cinco periféricos:

```
Periférico 1: 408 min
Periférico 2: 391 min
Periférico 3: 445 min
Periférico 4: 372 min
Periférico 5: 429 min
...
TiempoTotalProceso = Σ 348 valores ≈ 146,160 min
                                    ≈ 2,436 horas
```

---

### Paso 11 — Capacidad diaria

```
CapacidadDiaria = Operarios × 480 min/día
                = 5 × 480
                = 2,400 min/día
```

---

### Paso 12 — Días de trabajo requeridos

```
DíasTrabajo = ceil(TiempoTotalProceso / CapacidadDiaria)
            = ceil(146,160 / 2,400)
            = ceil(60.9)
            = 61 días
```

---

### Paso 13 — Tiempo restante

```
TiempoDisponible = DíasTrabajo × CapacidadDiaria
                 = 61 × 2,400
                 = 146,400 min

Diferencia = TiempoDisponible - TiempoTotalProceso
           = 146,400 - 146,160
           = 240 min

Como Diferencia > 0:
    TiempoRestante = 240 min   (tiempo libre al final del último día)
    TiempoFaltante = 0
```

> El `ceil` garantiza que `TiempoFaltante` siempre sea 0.

---

### Paso 14 — Costo laboral

El costo se calcula sobre el **tiempo real de procesamiento**, no sobre los días completos:

```
CostoLaboral = (TiempoTotalProceso / 60) × CostoHoraOperario
             = (146,160 / 60) × $4,500
             = 2,436 h × $4,500
             = $10,962,000
```

---

### Paso 15 — Costo de almacenamiento

Solo aplica si el proceso dura más de 1 día.
Se usa `CantidadEntrante / 2` como promedio estimado de unidades almacenadas.

```
Como DíasTrabajo = 61 > 1:

CostoAlmacenamiento = (DíasTrabajo - 1) × CostoDiarioPorUnidad × (CantidadEntrante / 2)
                    = (61 - 1) × $50 × (348 / 2)
                    = 60 × $50 × 174
                    = $522,000
```

Si el lote se procesara en 1 día:

```
CostoAlmacenamiento = 0
```

---

### Paso 16 — Costo total

```
CostoTotal = CostoLaboral + CostoAlmacenamiento
           = $10,962,000 + $522,000
           = $11,484,000
```

---

### Paso 17 — Rentabilidad

```
Rentabilidad = IngresoTotal - CostoTotal
             = $1,657,854 - $11,484,000
             = -$9,826,146   → Pérdida
```

> En este ejemplo con costo hora alto y lote pequeño el resultado es pérdida.
> Con más periféricos o menor costo hora el resultado cambia a ganancia.

---

## Resumen de distribuciones

| Variable | Distribución | Parámetros |
|---|---|---|
| Cantidad entrante | Uniforme discreta | [loteMin, loteMax] |
| Tipo de periférico | Bernoulli | p = 0.50 mouse |
| Destino de periférico | Bernoulli | p = 0.60 reutilizable |
| Tiempo por periférico | Normal | μ = 420 min, σ = 60 min |
| Peso mouse/teclado | Normal | μ = 100 g, σ = 10 g |
| Cobre en mouse | Uniforme | [15, 30] g |
| Hierro en mouse | Uniforme | [50, 150] g |
| Cobre en teclado | Normal | μ = 10 g, σ = 1.6 g |
| Hierro en teclado | Normal | μ = 7 g, σ = 1.6 g |
| Ingreso mouse reutilizado | Uniforme | [6000, 12000] $ |
| Ingreso teclado reutilizado | Uniforme | [5000, 8000] $ |

---

## Precios de materiales

| Material | Precio unitario |
|---|---|
| Cobre | $13.70 / g |
| Hierro | $0.50 / g |

---

## Estructura de archivos

```
src/
├── simulacion.js          # Motor completo (lógica pura JS)
├── App.jsx                # Estado global y layout
├── index.css              # Variables CSS y estilos base
├── componentes/
│   ├── Nav.jsx            # Barra de navegación
│   ├── Formulario.jsx     # Formulario de parámetros
│   └── Resultados.jsx     # Cards KPI con todos los resultados
└── styless/
    ├── Formulario.css
    └── Resultados.css
```
