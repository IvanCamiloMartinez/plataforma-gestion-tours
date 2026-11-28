---
name: tour-engine-workflow
description: >-
  Guía paso a paso para implementar, extender y auditar los módulos del Core Loop de 5 pasos
  de la Plataforma de Gestión Turística (Directorio, Diseñador 3 Capas, Motor Financiero Decimal, Fichas Comerciales y Salidas con Manifiesto).
  Usar SIEMPRE que se cree, modifique, depure o pruebe cualquier entidad, componente, Server Action o cálculo financiero del constructor de tours.
---

# Flujo de Trabajo e Ingeniería del Motor de Tours (Tour Engine Workflow)

Esta skill define el procedimiento técnico y operativo paso a paso para desarrollar, probar y mantener los 5 módulos del **Core Loop** de la plataforma, garantizando el cumplimiento de las invariantes de negocio, la Ley de Tesler y la legislación colombiana.

Su fuente de verdad y diseño detallado es [`DOCUMENTO_DISENO_PLATAFORMA_GESTION_TURISTICA.md`](../../docs/business/DOCUMENTO_DISENO_PLATAFORMA_GESTION_TURISTICA.md) y sus reglas están gobernadas por [`AGENTS.md`](../../AGENTS.md).

---

## 🛑 Regla de Oro Previa (Anti-Alucinaciones)
> **Si no cuentas con una respuesta, solución o valor exacto confirmado en el documento de diseño para un campo o fórmula, DETENTE de inmediato. No generes código especulativo; notifica al usuario y pregunta por las opciones requeridas.**

---

## Módulo 1: Directorio de Proveedores y Tarifas Inmutables

### Objetivo
Permitir el registro ágil de aliados turísticos clasificados en las categorías de la cadena de valor, asegurando la inmutabilidad de precios históricos.

### Procedimiento de Implementación:
1. **Validación de Categoría:** Asegurar que el proveedor pertenezca a una de las categorías habilitadas por el plan de la organización (4 básicas en Plan Rastrillo: Transporte, Alimentación, Actividad/Cata y Seguros).
2. **Registro de Tarifas:** Las tarifas deben tiparse como `FIXED` (por grupo/servicio) o `PER_PAX` (por participante individual) con valor en pesos colombianos (`COP`).
3. **Inmutabilidad por Snapshot:** Al vincular un proveedor a un bloque de itinerario (`ItineraryBlock`), nunca enlaces únicamente su `id` para leer el precio en vivo. **Copia el valor de la tarifa en un snapshot inmutable** en el bloque para que futuros aumentos del proveedor no alteren tours o salidas ya cotizadas.

---

## Módulo 2: Diseñador de Itinerario con Storytelling en 3 Capas

### Objetivo
Construir la secuencia cronológica del recorrido garantizando la separación estricta de audiencias y el recálculo automático de tiempos.

### Procedimiento de Implementación:
1. **Encadenamiento Temporal en Cascada (Ley de Tesler):**
   - El usuario solo define la hora de inicio del tour (ej. `09:00 AM`) y la duración de cada parada/desplazamiento.
   - El sistema calcula y propaga automáticamente las horas estimadas de llegada y salida para todos los bloques posteriores. Si se modifica un bloque intermedio, recalcular en cascada toda la cadena reactivamente.
2. **Separación Estricta de las 3 Capas por Bloque (`ItineraryBlock`):**
   - **Capa 1: Comercial (Pública):** Título descriptivo, duración, fotos y promesas ("Qué incluye / No incluye"). Expuesta en la Ficha Web y PDF para el turista.
   - **Capa 2: Interpretativa (Storytelling):** Guión histórico, anécdotas, datos patrimoniales y preguntas detonantes. **Solo visible para el Administrador y el Guía asignado; jamás expuesta en vistas públicas.**
   - **Capa 3: Operativa Privada (Logística):** Teléfono de emergencia del aliado, dirección de acceso y notas de caja/efectivo. Oculta al cliente final.

---

## Módulo 3: Motor Financiero Desacoplado y Precisión Decimal

### Objetivo
Calcular costos totales, costos unitarios, precios de venta sugeridos y punto de equilibrio sin errores de redondeo.

### Fórmulas Matemáticas Inmutables:
Toda operación financiera debe ejecutarse utilizando tipos de alta precisión (`Decimal(12,2)` en Prisma / librerías decimales en TypeScript). **Prohibido el uso de `number` para dinero acumulativo.**

1. **Costo Total:**
   $$CostoTotal(n) = CF + (CV_{pax} \cdot n) + CV_{grupo}(n)$$
   - $CF$: Costos fijos (honorarios del guía, vehículo exclusivo).
   - $CV_{pax}$: Costos variables por persona (catas, entradas, póliza médica).
   - $CV_{grupo}$: Costos escalonados por umbral de grupo (ej. guía auxiliar si $n > 8$).
2. **Costo Unitario:**
   $$CostoUnitario(n) = \frac{CostoTotal(n)}{n}$$
3. **Precio según Margen sobre Ventas ($m$, donde $0 \le m < 1$):**
   $$Precio_{margen}(n, m) = \frac{CostoUnitario(n)}{1 - m}$$
4. **Precio según Recargo sobre Costos / Markup ($k$):**
   $$Precio_{markup}(n, k) = CostoUnitario(n) \cdot (1 + k)$$
5. **Punto de Equilibrio ($n_{eq}$ a Precio $P$ con $P > CV_{pax}$):**
   $$n_{eq}(P) = \left\lceil \frac{CF + CV_{grupo}}{P - CV_{pax}} \right\rceil$$

*Redondeo comercial en interfaz:* Precios finales sugeridos al público redondeados al millar más cercano en COP.

---

## Módulo 4: Ficha Comercial e Impresión en 1 Clic

### Objetivo
Generar los entregables de venta y operación en campo sin fricción técnica.

### Procedimiento de Implementación:
1. **Ficha Web de Venta:** Página ligera y responsive con botón directo a WhatsApp con mensaje precargado (`https://wa.me/...`).
2. **Hoja de Ruta Imprimible (`@media print`):**
   - Estilos CSS limpios para impresión en papel carta en blanco y negro sin consumo innecesario de tinta.
   - Doble vista según destinatario:
     - **Vista Turista:** Itinerario público, recomendaciones de vestuario y cláusulas legales.
     - **Vista Guía/Conductor:** Incluye capas operativas, teléfonos de proveedores y datos de emergencia.
3. **Estampado Legal Obligatorio:** En el pie de toda ficha o PDF debe constar de forma visible el número de **RNT activo** del operador y la leyenda legal de prevención de ESCNNA (Ley 679 de 2001).

---

## Módulo 5: Agenda de Salidas y Manifiesto con Habeas Data

### Objetivo
Calendarizar ejecuciones reales del tour y gestionar el listado legal de pasajeros.

### Procedimiento de Implementación:
1. **Instanciación (Tour vs. Salida):** Una `Departure` toma como plantilla un `Tour`, fija fecha/hora específica, aforo máximo y asigna a un `User` con rol `GUIA`.
2. **Control Transaccional de Aforo (Anti-Sobrecupo):** Utilizar transacciones ACID en PostgreSQL con bloqueos de fila (`SELECT FOR UPDATE` o transacciones Prisma) al registrar pasajeros, impidiendo que peticiones concurrentes superen el cupo máximo.
3. **Consentimiento Legal de Habeas Data (Ley 1581 de 2012):**
   - El formulario de registro de pasajeros debe incluir la casilla juramentada obligatoria (`habeasDataConsent: true`, `habeasDataConsentAt: DateTime`).
   - Implementar la función de **Derecho al Olvido** (anonimización de nombres y documentos de pasajeros a solicitud del titular una vez finalizada la salida).
4. **Acceso Ciego para el Guía:** En las vistas de campo para usuarios con rol `GUIA`, ocultar completamente costos, márgenes y métricas financieras de la agencia.

---

## 📋 Checklist de Validación de Calidad (Definition of Done)

Antes de considerar terminada cualquier funcionalidad en el motor de tours:
- [ ] ¿Toda consulta o mutación a la base de datos filtra estrictamente por `organizationId`?
- [ ] ¿Los cálculos de dinero utilizan `Decimal(12,2)` y diferencian explícitamente entre Margen y Markup?
- [ ] ¿La capa interpretativa y la capa operativa privada están 100% blindadas de la vista pública del turista?
- [ ] ¿Los tiempos del itinerario se recalculan en cascada automáticamente si cambia una duración?
- [ ] ¿La ficha exportable incluye el número de RNT y la cláusula legal de prevención de ESCNNA?
- [ ] ¿El manifiesto de pasajeros exige el consentimiento explícito de Habeas Data?
- [ ] ¿Las pruebas unitarias del motor financiero cubren casos de 0 pasajeros, grupo mínimo y grupo máximo?
