# Plataforma de Gestión y Desarrollo Turístico (SaaS B2B)
## Documento Maestro de Diseño, Arquitectura y Estado del MVP

---

> ### 🧭 Guía de Lectura y Gobernanza de este Documento (Para Negocio, Desarrollo e IA)
> Este documento es la **fuente canónica de verdad** del proyecto y está diseñado con un **enfoque dual**:
> 1. **Para el Responsable de Negocio / Creador:** Explica el *porqué* de cada decisión, cómo funciona el producto en la vida real, cómo se gana dinero y cómo se protege legalmente la operación en un lenguaje claro, sin tecnicismos innecesarios.
> 2. **Para el Desarrollador de Software y Agentes de IA:** Define las entidades de datos, las fórmulas matemáticas exactas, las reglas de negocio, los algoritmos reactivos y las restricciones de base de datos sin ambigüedades.
>
> ---
>
> ### 🛑 Protocolo Anti-Alucinaciones y Certeza Obligatoria (Gobernanza de IA)
> **Si la IA no tiene una respuesta/solución/propuesta exacta, no generar ninguna respuesta sino notificar al usuario y preguntar por otras opciones.**
> - Queda estrictamente prohibido generar código especulativo, inventar dependencias, asumir requerimientos no documentados o alterar decisiones arquitectónicas sin consulta previa.
> - Toda decisión debe fundamentarse en el diseño validado en este documento o en consultas explícitas al usuario.
>
> **Convención de Certeza:**
> * `[CONFIRMADO]`: Decisión acordada, validada y firme de producto o arquitectura.
> * `[RECOMENDACIÓN]`: Práctica técnica o de diseño recomendada para garantizar calidad y robustez.
> * `[HIPÓTESIS]`: Supuesto de negocio o comportamiento que requiere validación empírica en campo.
> * `[FASE POSTERIOR]`: Funcionalidad identificada y deseable, deliberadamente excluida del MVP para contener el alcance y asegurar el lanzamiento.
>
> 📌 *Las reglas de comportamiento operativo e invariantes técnicas obligatorias para el código están formalizadas y priorizadas en [AGENTS.md](file:///c:/Users/ivanc/OneDrive/Desktop/Programación/IA/Proyecto%20Gestor%20de%20Tours%20-%20Antigravity/AGENTS.md).*

---

## 1. Visión y Principio Central del Producto

### A. Enfoque de Negocio (En Palabras Sencillas)
* **¿Qué es la plataforma?** Es un **taller digital de productividad** para el profesional del turismo. Es el lugar donde un guía o agencia pequeña entra a diseñar su tour, calcular sus costos reales, armar su guión de historias, exportar una ficha hermosa para vender por WhatsApp y controlar a sus pasajeros el día de la salida.
* **¿Qué NO es?** **No es un marketplace ni una plataforma de reservas para turistas** (no compite con Civitatis, Viator ni Airbnb Experiences). No le vendemos al viajero final; le damos herramientas al profesional.
* **Público Objetivo:** Guías de turismo independientes con tarjeta profesional, pequeños operadores locales y agencias boutique receptivas (equipos de 1 a 4 personas) en Colombia y Latinoamérica.
* **Hito de Lanzamiento Público:** **Feria Internacional de Turismo de ANATO (Febrero de 2027)** `[CONFIRMADO]`.

### B. El Principio Rector Inmutable (Ley de Tesler)
> *"El software debe absorber la complejidad administrativa, matemática y operativa para que el profesional del turismo pueda concentrarse en diseñar y desarrollar buenas experiencias."*
* **Explicación Intuitiva:** El guía no tiene por qué ser contador, diseñador gráfico ni experto en bases de datos. Si hay que calcular márgenes, encadenar horarios o armar un PDF, **lo hace la máquina**, no el usuario.

---

## 2. Marco Inmutable de UX, Psicología Cognitiva y Calidad (QA)

Toda pantalla y flujo del sistema debe construirse respetando las siguientes leyes psicológicas y estándares de calidad:

### A. Leyes de Psicología Cognitiva Aplicadas `[CONFIRMADO]`

| Ley / Principio | Explicación Intuitiva para Negocio | Especificación Técnica para el Desarrollador |
| :--- | :--- | :--- |
| **1. Ley de Tesler** | La complejidad la asume la plataforma, nunca el usuario. | El backend y cliente computan costos fijos/variables, márgenes y recálculos de tiempos sin intervención manual. |
| **2. Ley de Hick** | A menor número de opciones simultáneas, más rápida la decisión. | Reemplazar formularios kilométricos por un asistente progresivo (*wizard*) de pasos cortos con valores por defecto. |
| **3. Ley de Fitts** | Botones clave grandes y fáciles de tocar en el móvil. | Elementos interactivos móviles con tamaño mínimo de 44×44px / 48×48px ubicados en la zona natural del pulgar. |
| **4. Ley de Miller** | La mente humana procesa información en paquetes de 5 a 7 datos. | Agrupación de datos (*chunking*) en bloques digeribles (categorías de aliados, etapas del tour). |
| **5. Usabilidad Estética** | Una interfaz bonita y limpia transmite orden y confianza. | Uso estricto de Tailwind CSS + shadcn/ui con espaciado generoso, tipografía legible y paleta profesional. |
| **6. Efecto Von Restorff** | Lo que es diferente y contrasta se recuerda y se pulsa primero. | Botones de acción primaria (CTA "Exportar Ficha", "Imprimir") y alertas de margen negativo en alto contraste. |
| **7. Efecto Zeigarnik** | Las tareas incompletas motivan a terminar el trabajo. | Barras de progreso visuales (*"Tu tour está al 75% listo para salir al mercado"*). |
| **8. Regla de los 3 Clics** | Navegación plana: llegar a lo importante sin dar vueltas. | Descargar el PDF del día, revisar la lista de pasajeros o programar una salida debe tomar ≤ 3 clics desde el inicio. |
| **9. Ley de Parkinson** | Los formularios eternos hacen perder tiempo. | Flujos optimizados para que el primer tour se diseñe y costee en **menos de 20 minutos**. |
| **10. Posición Serial** | La mente recuerda mejor lo primero (*Primacy*) y lo último (*Recency*). | Datos vitales e impactantes ubicados al inicio y al cierre de menús, resúmenes de costos y fichas comerciales. |

### B. 10 Heurísticas de Usabilidad de Jakob Nielsen `[RECOMENDACIÓN]`
1. **Visibilidad del estado del sistema:** Indicadores claros de guardado automático (*"Borrador guardado a las 10:30 AM"*), spinners de carga no invasivos y estados de tour visibles (*Borrador / Listo / En Salida*).
2. **Correspondencia con el mundo real:** Vocabulario del sector turístico colombiano (*Pax, Salida, Manifiesto, Guía, RNT, Refrigerio*), descartando tecnicismos informáticos.
3. **Control y libertad del usuario:** Botones claros para deshacer, cancelar, duplicar tours en 1 clic y recuperación de borradores sin pérdida de datos.
4. **Consistencia y estándares:** Patrones uniformes de interacción y componentes en toda la aplicación.
5. **Prevención de errores:** Validaciones en tiempo real (impedir guardar con precio $0, advertir si faltan datos de póliza médica o sobrecupo de pasajeros).
6. **Reconocimiento antes que recuerdo:** Selectores asistidos con catálogo precargado y sugerencias dinámicas.
7. **Flexibilidad y eficiencia de uso:** Atajos para usuarios recurrentes, como clonar salidas periódicas y duplicar plantillas de itinerarios.
8. **Diseño estético y minimalista:** Cero datos innecesarios en pantalla; jerarquía visual estricta.
9. **Ayuda para reconocer y recuperarse de errores:** Mensajes empáticos en lenguaje natural que explican qué pasó y cómo solucionarlo (nunca errores crudos tipo `Error 500`).
10. **Ayuda y documentación contextual:** Tooltips interactivos y micro-guías en puntos clave como la calculadora financiera.

### C. Fundamentos de Calidad y Aseguramiento (QA) `[RECOMENDACIÓN]`
* **Pirámide de Pruebas Automatizadas:**
  * *Unitarias:* Cobertura matemática del 100% en el motor financiero (fijo, variable, grupal, márgenes sobre venta vs. markup, punto de equilibrio, división por 0 pasajeros).
  * *Integración:* Verificación de Server Actions, persistencia transaccional ACID en PostgreSQL y respeto estricto de las cuotas Freemium.
  * *E2E (End-to-End):* Flujo crítico automatizado (*Crear Tour → Asignar Proveedor → Fijar Precio → Programar Salida → Exportar PDF*).
* **Shift-Left Quality & Tipado Estricto:** Validación de contratos de datos compartidos con **TypeScript y Zod** en cliente y servidor.
* **Resiliencia Offline:** Garantía de lectura para guías en áreas sin señal celular mediante PDFs vectoriales pre-renderizados del lado del servidor.
* **Control de Concurrencia:** Bloqueos a nivel de fila en base de datos para impedir que se confirmen más pasajeros que los cupos reales de la salida.

---

## 3. El Núcleo de Valor del MVP ("Core Loop" de 5 Pasos) `[CONFIRMADO]`

### A. El Flujo de Valor
Toda la plataforma gira alrededor de una secuencia continua de 5 pasos operativos:

```
[1. Directorio Base de Proveedores]
                 ↓
[2. Diseñador de Tours e Itinerario con Storytelling]
                 ↓
[3. Calculadora y Motor Financiero Desacoplado]
                 ↓
[4. Ficha Comercial Exportable (PDF / Enlace WhatsApp)]
                 ↓
[5. Agenda de Salidas, Asignación de Guías y Manifiesto]
```

### B. Distinción Conceptual Clave: Tour vs. Salida
Para entender el sistema, es fundamental distinguir estos dos conceptos:
* **El Tour (La Receta / Plantilla):** Es el producto conceptual. Define el recorrido, las paradas, el guión cultural, qué incluye, qué no incluye y los costos base. Se crea una sola vez.
* **La Salida (El Plato Servido / La Ejecución):** Es la instancia real en el calendario. Es el tour programado para una fecha y hora específica (ej. *Sábado 28 de Noviembre a las 2:00 PM*), con un guía responsable asignado, un aforo máximo y una lista de pasajeros con nombre y cédula.
* *Beneficio:* Permite programar 20 salidas de un mismo tour sin tener que volver a escribir todo desde cero.

---

## 4. Perfiles de Usuario, Roles y Permisos (RBAC) `[CONFIRMADO]`

### A. Enfoque de Negocio
* **Administrador (Dueño de la Agencia / Guía Titular):** Tiene control absoluto de la plataforma, ve los márgenes de ganancia, crea los tours, programa salidas y gestiona el equipo.
* **Guía Asignado (El Guía de Campo):** Solo ve las salidas a las que fue asignado. Puede ver el itinerario, su guión cultural, los teléfonos de los aliados y la lista de pasajeros para pasar asistencia. **Tiene acceso ciego a las finanzas** (no ve cuánto cobró la agencia ni los márgenes de ganancia, evitando roces comerciales). Puede descargar la hoja de ruta en PDF para trabajar sin señal.

### B. Matriz de Permisos (Especificación Técnica)

| Permiso / Acción Operativa | Administrador (Dueño) | Guía Asignado |
| :--- | :---: | :---: |
| Crear / Editar Tours, Paradas y Guiones | ✅ | ❌ |
| Gestionar Directorio de Proveedores y Tarifas | ✅ | ❌ |
| Programar Salidas y definir cupos | ✅ | ❌ |
| Registrar y gestionar Pasajeros (Manifiesto) | ✅ | Solo Lectura en Campo |
| Ver Itinerario y Guión de salidas asignadas | ✅ | ✅ |
| **Descargar PDF offline de salida (para campo)** | ✅ | ✅ *(Solo lectura)* |
| Ver Finanzas, Costos, Márgenes y Ganancias | ✅ | ❌ *(Acceso ciego)* |
| Invitar y administrar equipo de guías | ✅ | ❌ |

---

## 5. Directorio de Proveedores y Cadena de Valor `[CONFIRMADO]`

### A. Lógica Operativa
El directorio es la libreta de contactos centralizada del operador. Los aliados se clasifican en categorías de la cadena de valor turística. Al armar un tour, el usuario puede vincular 1 aliado por categoría a cada parada o actividad.

### B. Distribución de las 10 Categorías según el Plan

| # | Categoría de la Cadena de Valor | Plan Rastrillo (Gratis) | Plan Guía (Medio) | Plan Tour Leader (Avanzado) |
| :-: | :--- | :---: | :---: | :---: |
| 1 | 🚐 Transporte (vans, camperos, chivas, lanchas) | ✅ | ✅ | ✅ |
| 2 | 🍽️ Alimentación (restaurantes locales, refrigerios) | ✅ | ✅ | ✅ |
| 3 | 🏥 Salud / Emergencias (centros de salud cercanos) | ✅ | ✅ | ✅ |
| 4 | 🛡️ Seguros (pólizas de asistencia médica en viaje) | ✅ | ✅ | ✅ |
| 5 | 🎭 Actividad / Experiencia (catas, talleres, cabalgatas) | ❌ | ✅ | ✅ |
| 6 | 🛏️ Hospedaje (hoteles, glamping, fincas campesinas) | ❌ | ✅ | ✅ |
| 7 | 🌿 Naturaleza / Ecoturismo (reservas, parques naturales) | ❌ | ✅ | ✅ |
| 8 | 🧶 Artesanía / Cultura (comunidades, artesanos locales) | ❌ | ❌ | ✅ |
| 9 | 📸 Fotografía / Contenido audiovisual | ❌ | ❌ | ✅ |
| 10 | 🏛️ Permisos / Institucional (Parques Nacionales, resguardos) | ❌ | ❌ | ✅ |
| | **Total Categorías Habilitadas** | **4 básicas** | **7 categorías** | **10 categorías (Total)** |

---

## 6. Modelo Comercial Freemium y Pricing Oficial (Regla 3x) `[CONFIRMADO]`

### A. Filosofía de Nombres
Los planes llevan nombres de la cultura del senderismo y la montaña en Colombia:
* **Plan Rastrillo ($0 COP):** El guía escoba o rastrillo es el que va al final del grupo, cuidando que nadie se quede atrás. Es el plan gratuito para que cualquier profesional empiece a organizarse sin barrera económica.
* **Plan Guía ($79.000 COP/mes):** El profesional en ruta continua. Tiene marca propia (White-Label) para que sus clientes vean su logo, no el de la plataforma.
* **Plan Tour Leader ($199.000 COP/mes):** El líder de expedición para agencias u operadores consolidados con múltiples salidas simultáneas y equipo amplio.

### B. Tabla de Capacidades y Límites (Regla de Progresión 3x)

| Variable de Capacidad | Plan Rastrillo | Plan Guía | Plan Tour Leader |
| :--- | :---: | :---: | :---: |
| **Precio Mensual** | **$0 COP** | **$79.000 COP** *(~$20 USD)* | **$199.000 COP** *(~$50 USD)* |
| **Precio Anual (Ahorro 2 meses)** | **$0 COP** | **$790.000 COP/año** | **$1.990.000 COP/año** |
| **Guías por organización** | 2 | 6 | Ilimitados |
| **Tours activos** | 2 | 6 | Ilimitados |
| **Salidas programadas al mes** | 4 (1 semanal) | 12 | Ilimitadas |
| **Proveedores por categoría** | 5 | 15 | Ilimitados |
| **Categorías habilitadas** | 4 básicas | 7 categorías | 10 categorías |
| **Ficha comercial PDF / Web** | Con marca de plataforma | Con marca propia (White-label) | Con marca propia (White-label) |
| **Calculadora financiera** | Costo base vs. Precio | Escenarios múltiples | Escenarios múltiples avanzados |
| **Historial de salidas pasadas** | 3 meses | 9 meses | Completo |
| **Descarga offline de itinerario (guías)** | ✅ Solo lectura | ✅ Solo lectura | ✅ Solo lectura |
| **Gatillo al tocar techo (Von Restorff)** | Modal de upgrade asistido en 1 clic | Modal de upgrade asistido en 1 clic | N/A |

---

## 7. Componentes Diferenciales Centrales del Producto

### A. Guión Interpretativo y Storytelling Cultural `[CONFIRMADO]`
En la industria del turismo, **el verdadero activo de un guía es su conocimiento y su relato**. La plataforma estructura cada parada o actividad en **tres capas de información nativas**:

```
┌────────────────────────────────────────────────────────────────────────┐
│             ARQUITECTURA DE TRES CAPAS POR PARADA / ACTIVIDAD          │
├────────────────────────────────────────────────────────────────────────┤
│ 1. CAPA COMERCIAL (Pública / Turista):                                 │
│    • Qué ve el cliente en la Ficha y en la Web.                        │
│    • Título y duración (ej. "La Chicha y las Raíces Indígenas - 45 min")│
│    • Descripción atractiva y sensorial para enamorar y vender.         │
├────────────────────────────────────────────────────────────────────────┤
│ 2. CAPA INTERPRETATIVA (Storytelling Cultural / Guía y Admin):        │
│    • Qué cuenta el guía durante el recorrido (su guión narrativo).     │
│    • Hitos históricos, anécdotas locales y datos curiosos.             │
│    • Preguntas detonantes para romper el hielo en la calle.            │
├────────────────────────────────────────────────────────────────────────┤
│ 3. CAPA OPERATIVA PRIVADA (Logística Confidencial / Guía y Admin):     │
│    • Qué se hace tras bambalinas (completamente oculto al cliente).    │
│    • Teléfono del aliado y dirección de acceso.                        │
│    • Notas de dinero: pagos en efectivo, saldos pendientes y alertas.  │
└────────────────────────────────────────────────────────────────────────┘
```

* **Reutilización Ágil `[CONFIRMADO]`:** El guía puede duplicar un tour completo en 1 clic o reutilizar guiones entre diferentes experiencias sin volver a redactarlos.

---

### B. Motor Financiero Automático y Rigor Matemático `[CONFIRMADO]`

#### 1. Explicación Intuitiva de Negocio
En turismo existen tres tipos de gastos muy diferentes que los operadores suelen confundir en Excel:
1. **Costos Fijos ($CF$):** Los que pagas vaya 1 persona o vayan 10 (ej. los honorarios del guía de $200.000 o la van de $350.000).
2. **Costos Variables por Persona ($CV_{pax}$):** Lo que cuesta cada turista individual (ej. la cata de $15.000 y el seguro médico de $8.000). Si van 10 turistas, pagas 10 seguros; si va 1, pagas 1.
3. **Costos Variables por Grupo ($CV_{grupo}$):** Gastos que se activan por umbrales (ej. un guía auxiliar obligatorio cuando el grupo pasa de 8 personas).

#### 2. Rigor Matemático: Margen sobre Ventas vs. Recargo (Markup)
> [!IMPORTANT]
> **No son lo mismo:**
> * Si un tour te cuesta **$100.000 COP** por persona y quieres un **20% de ganancia**:
>   * Con **Recargo (Markup del 20%)**: Cobras $100.000 \times 1.20 = \mathbf{\$120.000\text{ COP}}$. (Ganaste $20.000, pero tu margen real sobre lo vendido fue del 16.6%).
>   * Con **Margen sobre Ventas (20%)**: Cobras $\frac{\$100.000}{1 - 0.20} = \mathbf{\$125.000\text{ COP}}$. (Aquí sí, de cada $125.000 que entran, el 20% exacto —$25.000— es tu ganancia limpia).
> * La plataforma le permite al operador elegir cuál de las dos fórmulas desea usar y nunca las confunde.

#### 3. Fórmulas Oficiales del Motor (Especificación para el Desarrollador)
El motor opera desacoplado en TypeScript con tipos `Decimal`:
1. **Costo Total del Grupo:**
   $$CostoTotal(n) = CF + (CV_{pax} \cdot n) + CV_{grupo}(n)$$
2. **Costo Unitario por Participante:**
   $$CostoUnitario(n) = \frac{CostoTotal(n)}{n}$$
3. **Precio Sugerido según Margen sobre Ventas ($m$ con $0 \le m < 1$):**
   $$Precio_{margen}(n, m) = \frac{CostoUnitario(n)}{1 - m}$$
4. **Precio Sugerido según Recargo sobre Costos / Markup ($k$):**
   $$Precio_{markup}(n, k) = CostoUnitario(n) \cdot (1 + k)$$
5. **Punto de Equilibrio ($n_{eq}$ a Precio de Venta $P$):**
   $$n_{eq}(P) = \left\lceil \frac{CF + CV_{grupo}}{P - CV_{pax}} \right\rceil \quad \text{donde } P > CV_{pax}$$

* **Inmutabilidad de Tarifas:** Si un restaurante sube sus precios en el directorio general, los tours ya creados y las salidas pasadas **no se alteran automáticamente**. Conservan su *snapshot* histórico registrado.

#### 4. Gestión Multimoneda e Informativa en Moneda Extranjera (USD / EUR) `[CONFIRMADO]`

* **Explicación Intuitiva para Negocio:**
  La agencia y el guía operan en Colombia: pagan el transporte, la alimentación campesina y las pólizas médicas en pesos colombianos (COP). Por lo tanto, el costeo real, los márgenes y la contabilidad interna se manejan **100% en pesos (COP)** para evitar desfases financieros. Sin embargo, para captar turistas extranjeros o nómadas digitales que compran por WhatsApp o visitan la web, la plataforma permite mostrar una cotización referencial en dólares estadounidenses (USD) o euros (EUR). Para proteger al operador frente a la volatilidad cambiaria, la plataforma estampa obligatoriamente la advertencia legal de que el cobro final se liquida en pesos.

* **Especificación Técnica para el Desarrollador:**
  * **Moneda Base Inmutable:** El motor financiero y la base de datos liquidan y persisten todas las tarifas, costos y precios oficiales **100% en pesos colombianos (COP)** utilizando tipos `@db.Decimal(12, 2)`. Se excluye deliberadamente la sobreingeniería de un libro mayor contable multimoneda transaccional en el MVP.
  * **Módulo de Conversión Informativa:** En `Tour` u `Organization`, se habilita el campo `referenceTrmUsd: Decimal(10, 2)?` (TRM referencial fijada manualmente por la agencia o actualizada periódicamente).
  * **Fórmula de Conversión en Capa de Presentación:**
    $$Precio_{USD} = \text{round}\left(\frac{Precio_{COP}}{TRM_{ref}}, 2\right)$$
  * **Leyenda Legal Obligatoria (Invariante en UI y PDF):**
    > *"Tarifa oficial liquidada en pesos colombianos (COP); valor en USD puramente referencial sujeto a la tasa de cambio del día de pago"*.

---

## 8. Automatización y Experiencia de Usuario (UX)

### A. Creación Progresiva de Tours (Flujo en 7 Etapas Asistidas) `[CONFIRMADO]`
Evita formularios abrumadores mediante un asistente paso a paso con autoguardado continuo:
1. *Info básica* (Nombre, destino, dificultad, aforo y concepto narrativo).
2. *Paradas y actividades* (Lugares a visitar).
3. *Itinerario y desplazamientos* (Orden cronológico y tiempos a pie/vehículo).
4. *Guión interpretativo* (Storytelling y preguntas para romper el hielo).
5. *Proveedores y aliados* (Vinculación de aliados del directorio).
6. *Costos y motor financiero* (Asignación de costos, simulación de grupos y margen deseado).
7. *Ficha comercial* (Revisión visual de la pieza pública y publicación).

### B. Automatización del Itinerario y Recálculo en Cascada `[CONFIRMADO]`
* **El reloj se calcula solo (Ley de Tesler):** Si fijas la salida a las 02:00 PM y la primera cata dura 45 min con 5 min de caminata, el sistema asigna automáticamente las 02:50 PM a la segunda parada.
* **Efecto Cascada:** Si en pleno diseño decides cambiar la duración de la primera parada de 45 a 60 minutos, **todas las horas de las paradas posteriores se ajustan automáticamente** en tiempo real.

### C. Fichas Comerciales de Alta Conversión `[CONFIRMADO]`
* **Explicación Intuitiva para Negocio:**
  El operador no necesita un diseñador gráfico para vender. Con un solo clic, el sistema genera una pieza comercial impecable para enviar por WhatsApp o compartir por enlace. Muestra fotos del tour, qué incluye y qué no incluye, el itinerario resumido para el turista, las recomendaciones de ropa y calzado, y el precio transparente. Además, para turistas extranjeros o nómadas digitales, permite mostrar la equivalencia aproximada en dólares (USD) o euros (EUR) con su respectiva salvedad legal de liquidación en pesos.
* **Especificación Técnica para el Desarrollador:**
  * Generación instantánea en doble formato: **PDF descargable** (vectorial optimizado para compartir en móvil) y **Página web compartible** (SSR / Server Component con OpenGraph tags para vista previa atractiva en WhatsApp).
  * Elementos obligatorios: Título evocador, galería de fotos, cronograma visual (exclusivamente Capa Comercial pública), tabla comparativa "Qué incluye vs. Qué no incluye", recomendaciones técnicas de vestuario, precio oficial en COP, campo opcional de conversión informativa en USD/EUR con leyenda legal obligatoria, número de RNT legal y **Botón Flotante de WhatsApp** con mensaje de reserva precargado.

### D. Descarga e Impresión del Itinerario en 1 Clic (Modo Lectura Universal) `[CONFIRMADO]`
* Un botón visible **[ 🖨️ Imprimir / Descargar Itinerario ]** genera una hoja de ruta simple que cualquier persona (el turista, un familiar o el chofer) comprende en 10 segundos.
* Optimizado con `@media print` para imprimir en papel estándar carta en blanco y negro sin gastar tinta, o guardar en PDF vectorial ligero.
* **Dos versiones según destinatario:** Versión Viajero (pública y limpia) vs. Versión Guía/Conductor (con teléfonos de emergencia y notas privadas).

### E. Experiencia Mobile-First y Modo Offline `[CONFIRMADO para MVP]`
* El guía consulta desde su teléfono: itinerario, geolocalización, teléfonos de aliados, guión y manifiesto de pasajeros.
* **Alcance del MVP:** Descarga local de documentos estáticos en PDF para operar 100% offline sin señal celular. PWA con sincronización bidireccional postergada a fases posteriores.

### F. Autoguardado y Prevención de Errores Operativos `[RECOMENDACIÓN]`
* Indicadores visuales de autoguardado en borrador.
* Prevención transaccional de sobreventa: la base de datos bloquea cualquier intento de registrar pasajeros que excedan el cupo máximo de la salida.

### G. Política de Cancelación, Clima y Reprogramación por Fuerza Mayor `[CONFIRMADO]`

* **Explicación Intuitiva para Negocio:**
  En el turismo colombiano, factores imprevistos como alertas climáticas del IDEAM, lluvias torrenciales en páramos, derrumbes en carretera o cierres preventivos de Parques Nacionales Naturales (PNN) obligan a suspender o mover salidas a última hora. El guía o agencia no puede perder tiempo reescribiendo a mano la lista de 15 pasajeros ni volviendo a calcular costos. Con el botón de **"Reprogramar por Fuerza Mayor / Clima"**, el operador selecciona la nueva fecha u horario: el sistema mantiene intactos a todos los pasajeros inscritos, preserva los costos históricos acordados y genera de inmediato un mensaje personalizado y empático listo para enviar por WhatsApp al grupo de viajeros con un solo toque.

* **Especificación Técnica para el Desarrollador:**
  * **Ciclo de Vida y Estados Oficiales de `Departure` (`DepartureStatus`):**
    1. `PROGRAMADA`: Salida agendada en calendario, activa para asignación de cupos y registro de pasajeros.
    2. `EN_CURSO`: Salida en fecha de ejecución; el guía asignado se encuentra en campo operando la ruta.
    3. `COMPLETADA`: Salida finalizada con éxito; pasa a histórico cerrado para balance contable y archivo.
    4. `REPROGRAMADA`: Salida aplazada o modificada en fecha/hora por fuerza mayor (clima, cierres) o acuerdo con los viajeros. Conserva la relación 1:N con los registros existentes de `Passenger` y los snapshots de `CostItem` asociados, auditando `rescheduledFrom: DateTime` y `rescheduledReason: String`.
    5. `CANCELADA`: Salida suspendida definitivamente sin ejecución. Libera compromisos y marca el estado para trazabilidad contable sin eliminar registros.
  * **Mecanismo de Reprogramación en 1 Clic (Server Action `rescheduleDeparture`):**
    - Ejecuta una transacción ACID en PostgreSQL que actualiza `departureDate` al nuevo timestamp, cambia el estado a `REPROGRAMADA`, preserva íntegramente las relaciones 1:N con `Passenger` (sin requerir reinscripción de clientes) y mantiene congelados los snapshots de tarifas históricas.
  * **Generador Automático de Mensaje Informativo para WhatsApp:**
    - Genera una URL con esquema `https://wa.me/?text=...` que inyecta la siguiente plantilla parametrizada:
      > *"Hola [Nombre Pax], te informamos que por motivos de [fuerza mayor/condición climática/cierre de parque], nuestra salida del tour [Nombre del Tour] ha sido reprogramada para el día [Nueva Fecha] a las [Nueva Hora]. El punto de encuentro se mantiene en [Punto de Encuentro]. Tu cupo y condiciones están 100% asegurados. Por favor confírmanos tu disponibilidad respondiendo a este mensaje."*

---

## 9. Marco Legal Colombiano y Cumplimiento Normativo `[CONFIRMADO]`

### A. Habeas Data y Tratamiento de Datos Personales (Ley 1581 de 2012)
* **Responsabilidad:** La Plataforma es *Encargada del Tratamiento* (almacén seguro y cifrado); la Agencia/Guía es *Responsable del Tratamiento* de los datos de sus clientes.
* **Mecanismo en 1 Clic:** Al cargar el manifiesto de pasajeros, el operador marca una casilla obligatoria donde declara bajo juramento contar con la autorización de los titulares para fines logísticos y de póliza de asistencia médica.
* **Derecho al Olvido:** Botón de 1 clic para anonimizar o eliminar los datos de los pasajeros una vez completada la salida y el tiempo de auditoría de seguros.

### B. Registro Nacional de Turismo (RNT - Ley 2068 de 2020)
* En Colombia es legalmente obligatorio exhibir el número de RNT activo en toda publicidad turística.
* La plataforma solicita el RNT en el perfil, ofrece enlace de verificación al RUES / MinCIT y lo estampa automáticamente en todas las fichas comerciales y manifiestos.

---

## 10. Organización del MVP en Tres Bloques `[CONFIRMADO]`

El desarrollo técnico se divide en tres bloques lógicos con ruta crítica:

```
┌────────────────────────────────────────────────────────────────────────┐
│ BLOQUE 1: CONSTRUCCIÓN DEL PRODUCTO                                    │
│ • Directorio de Proveedores y Categorías Básicas.                      │
│ • Diseñador de Tours e Itinerario con encadenamiento automático.       │
│ • Guión Interpretativo (Storytelling Cultural).                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ BLOQUE 2: RENTABILIDAD Y COMERCIALIZACIÓN                              │
│ • Motor Financiero desacoplado (Costos Fijos, Variables y Grupales).   │
│ • Simulador de escenarios, Margen vs. Markup y Punto de Equilibrio.    │
│ • Generador de Fichas Comerciales (PDF / Web para WhatsApp).           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ BLOQUE 3: OPERACIÓN EN CAMPO Y LOGÍSTICA                               │
│ • Agenda y Programación de Salidas en calendario.                      │
│ • Manifiesto de Pasajeros con consentimiento legal de Habeas Data.     │
│ • Hoja de Ruta descargable e imprimible en 1 clic para campo.          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Arquitectura Tecnológica y Modelo Conceptual de Datos

### A. Stack Tecnológico e Invariantes de Desarrollo `[CONFIRMADO]`
* **Frontend & Backend:** Next.js (React 19 + TypeScript) con App Router y Server Actions.
* **Lenguaje:** TypeScript en modo estricto (`strict: true`, sin `any` arbitrarios).
* **Estilos & UI:** Tailwind CSS + shadcn/ui con cumplimiento accesible (WCAG AA).
* **Base de Datos:** PostgreSQL con transacciones ACID para control de cupos y multi-tenancy.
* **ORM:** Prisma ORM.
* **Tipado:** Zod schemas compartidos entre cliente y servidor.
* **Comunicaciones:** Resend (emails transaccionales) y enlaces directos a la API de WhatsApp.
* **Aislamiento Multi-Tenant Obligatorio:** Toda consulta, mutación o eliminación en base de datos debe filtrar estrictamente por `organizationId` obtenido de la sesión autenticada. Queda prohibida cualquier consulta transversal no aislada.
* **Rigor Numérico Inmutable:** Prohibido el uso de coma flotante nativa (`number`) para finanzas acumulativas; uso obligatorio de `Decimal(12,2)` en Prisma y tipos de precisión decimal en TypeScript.
* **Trazabilidad y Borrado Lógico (*Soft Delete*) Inmutable:**
  * **Explicación Intuitiva para Negocio:**
    En una agencia real, un restaurante aliado puede cerrar o un tour puede dejar de ofrecerse. Si el guía presiona "Eliminar", el software **nunca destruye la información del pasado**. Si borrara físicamente el aliado o el tour, se corromperían las salidas que ya se hicieron el mes pasado, se arruinarían los registros contables de cuánto dinero se gastó y se perderían las pruebas de qué pasajeros asistieron. El borrado lógico simplemente "archiva" el elemento para que no aparezca en futuros tours, pero conserva intacta toda la historia de la empresa.
  * **Especificación Técnica para el Desarrollador:**
    - **Invariante de Soft Delete:** Regla arquitectónica inmutable donde las entidades críticas (`Provider`, `Stop`, `Tour`, `Departure`) incorporan el campo `deletedAt: DateTime?` con índice en base de datos.
    - **Prohibición Estricta de Borrado Destructivo (`DELETE` Físico):** Queda terminantemente prohibido ejecutar sentencias `DELETE` directas sobre estas entidades en Prisma / PostgreSQL.
    - **Patrón de Consulta:** Todas las consultas de lectura (`findMany`, `findFirst`, etc.) filtran por defecto `{ deletedAt: null }` junto con `organizationId`.
    - **Integridad Referencial y Auditoría:** Salidas pasadas, liquidaciones de costos, cotizaciones históricas y consentimientos de Habeas Data retienen sus llaves foráneas intactas y auditables sin generar violaciones de restricción referencial (`Foreign Key Constraint Violations`).

### B. Las 12 Entidades del Esquema de Datos (`prisma/schema.prisma`) `[CONFIRMADO]`

```
[Organization] (Tenant Raíz Multi-Tenant)
   ├── 1:N ──► [User] (Rol: ADMIN o GUIA)
   ├── 1:N ──► [Provider] ── 1:N ──► [Tariff] (Historial inmutable de tarifas)
   ├── 1:N ──► [Stop] (Paradas reutilizables)
   ├── 1:N ──► [Activity] (Actividades reutilizables)
   ├── 1:N ──► [InterpretiveScript] (Guiones de storytelling reutilizables)
   └── 1:N ──► [Tour] (Plantilla del producto turístico)
                 ├── 1:N ──► [ItineraryBlock] (Paradas secuenciales con las 3 capas)
                 ├── 1:N ──► [CostItem] (Costos fijos, variables y grupales con Decimal)
                 └── 1:N ──► [Departure] (Salidas programadas en calendario)
                               ├── Asignada a User (Guía)
                               └── 1:N ──► [Passenger] (Manifiesto con Habeas Data y Póliza)
```

1. **`Organization`:** Tenant raíz. Almacena razón social, nombre comercial, RNT, logo, teléfono, plan suscrito (`RASTRILLO`, `GUIA`, `TOUR_LEADER`).
2. **`User`:** Cuenta de acceso. Vinculada a la organización, credenciales, celular, rol (`ADMIN` o `GUIA`).
3. **`Provider`:** Aliado comercial clasificado en las categorías de la cadena de valor (con soporte de *Soft Delete* `deletedAt`).
4. **`Tariff`:** Registro histórico y snapshots de tarifas de proveedores para trazabilidad inmutable.
5. **`Stop`:** Parada física o atractivo del catálogo (nombre, coordenadas GPS, municipio; con soporte de *Soft Delete* `deletedAt`).
6. **`Activity`:** Tipo de experiencia (cata, senderismo, taller) con duración estándar.
7. **`InterpretiveScript`:** Guión cultural y patrimonial (relato histórico, preguntas detonantes).
8. **`Tour`:** Plantilla del producto turístico (concepto narrativo, aforo mín/máx, estado, TRM referencial USD; con soporte de *Soft Delete* `deletedAt`).
9. **`ItineraryBlock`:** Instancia en el tour que vincula Stop, Activity, Script, Provider y notas privadas.
10. **`CostItem`:** Elemento de costo (`FIXED_DEPARTURE`, `VARIABLE_PAX`, `VARIABLE_GROUP`) con tipo exacto `Decimal(12,2)`.
11. **`Departure`:** Salida en calendario con fecha, hora, estado oficial (`PROGRAMADA`, `EN_CURSO`, `COMPLETADA`, `REPROGRAMADA`, `CANCELADA`), guía asignado, aforo máximo y soporte de *Soft Delete* `deletedAt`.
12. **`Passenger` (Estándar de Asistencia Médica y Manifiesto Legal):**
    * **Explicación Intuitiva para Negocio:**
      Las aseguradoras turísticas en Colombia (Colasistencia, Assist Card) exigen datos estrictos para activar la cobertura médica de los viajeros antes de salir al sendero o carretera. Si ocurre una emergencia y falta el tipo de documento o el teléfono de un familiar que no esté en el tour, la aseguradora puede rechazar el siniestro. Además, el guía necesita saber de antemano si algún participante tiene alergias graves, asma o requerimientos dietéticos (vegano/vegetariano), y poder descargar la lista en 1 clic para enviarla directamente al seguro sin transcribir nada a mano.
    * **Especificación Técnica para el Desarrollador:**
      * **Campos Obligatorios de Identificación y Edad:**
        - `docType`: Tipo de documento estandarizado (`CC` Cédula de Ciudadanía, `CE` Cédula de Extranjería, `PAS` Pasaporte, `PPT` Permiso por Protección Temporal, `TI` Tarjeta de Identidad).
        - `docNumber`: Número de documento validado (sin caracteres especiales).
        - `fullName`: Nombres y apellidos completos.
        - `birthDate`: Fecha de nacimiento estricta (`DateTime`).
        - `calculatedAge`: Edad calculada en tiempo de ejecución al momento de la salida (`Int`).
      * **Contacto de Emergencia Obligatorio (Tercero No Viajero):**
        - `emergencyContactName`: Nombre completo del familiar o contacto externo.
        - `emergencyContactPhone`: Teléfono móvil con código de país.
      * **Alertas Médicas y Restricciones Dietéticas:**
        - `medicalAlerts`: Texto libre estructurado para afecciones críticas (alergias severas a medicamentos/alimentos, problemas cardíacos, asma, toma de medicamentos vitales).
        - `dietaryRestrictions`: Preferencias o intolerancias alimentarias (`Vegetariano`, `Vegano`, `Celíaco / Libre de gluten`, `Intolerante a lactosa`).
      * **Cumplimiento Legal Habeas Data (Ley 1581 de 2012):**
        - `habeasDataConsent`: Checkbox booleano obligatorio (`true`).
        - `habeasDataConsentAt`: Timestamp de aceptación juramentada.
        - `anonymizedAt`: Soporte para el Derecho al Olvido (purga controlada de datos sensibles).
      * **Exportador a 1 Clic para Aseguradoras:**
        - Endpoint / Server Action `exportInsuranceManifest(departureId)` que genera un archivo `CSV / Excel (.xlsx)` con el formato de columnas exacto requerido por las plataformas de emisión masiva de Colasistencia y Assist Card.

---

## 12. Decisiones Pendientes, Hipótesis y Riesgos Técnicos

### A. Matriz de Clasificación de Certeza

| Elemento / Decisión | Clasificación | Estado y Acción Requerida |
| :--- | :---: | :--- |
| **Stack tecnológico (Next.js, Prisma, PostgreSQL)** | `[CONFIRMADO]` | Arquitectura base establecida sin cambios. |
| **Modelo Freemium (Rastrillo, Guía, Tour Leader)** | `[CONFIRMADO]` | Nombres, capacidades 3x y tarifas fijadas. |
| **Tres capas de información en itinerario** | `[CONFIRMADO]` | Integrado en modelo conceptual y diseño UX. |
| **Calculadora financiera de 3 categorías desacoplada** | `[CONFIRMADO]` | Fórmulas explícitas y tipos decimales acordados. |
| **Generación de Ficha PDF y Web con WhatsApp** | `[CONFIRMADO]` | Canal primario de comercialización en MVP. |
| **Consulta y descarga offline en móvil para guías** | `[CONFIRMADO para MVP]` | Descarga de documentos estáticos en dispositivo. |
| **PWA con sincronización bidireccional offline** | `[FASE POSTERIOR]` | Postergada para después del MVP por complejidad técnica. |
| **Extracción inteligente de tarifarios con IA** | `[FASE POSTERIOR]` | Funcionalidad complementaria posterior a la validación del core. |
| **Disposición de pago de $79.000 COP en agencias 1-4 pax** | `[HIPÓTESIS]` | Requiere validación durante la beta cerrada con 5-10 operadores. |
| **Adopción de guías del visor de storytelling en ruta** | `[HIPÓTESIS]` | Validar en campo si prefieren pantalla o tarjeta resumen. |

### B. Análisis Objetivo de Riesgos Técnicos y Mitigaciones
1. **Riesgo: Complejidad en Modo Offline:** Se mitiga usando **descarga de documentos vectoriales ligeros de solo lectura**, evitando el riesgo de construir un motor de sincronización bidireccional complejo antes de ANATO.
2. **Riesgo: Pérdida de Precisión Financiera:** Se mitiga usando **tipos `Decimal(12,2)`** tanto en base de datos como en TypeScript, erradicando los errores de coma flotante de JavaScript.
3. **Riesgo: Sobreventa de Cupos:** Se mitiga con transacciones ACID y bloqueos a nivel de fila en PostgreSQL.

---

## 13. Criterios de Priorización del Producto y Hoja de Ruta

### A. Los 7 Filtros de Priorización (Para evitar inflar el proyecto)
1. ¿Resuelve un problema real y diario del guía o pequeño operador?
2. ¿Reduce trabajo manual repetitivo o desorden operativo?
3. ¿Evita errores económicos (pérdida de margen) u operativos (confusiones de itinerario)?
4. ¿Aporta valor directo al Core Loop de 5 pasos?
5. ¿Aprovecha o reutiliza información ya registrada en el sistema?
6. ¿Es indispensable para operar en la feria de ANATO o puede esperar?
7. ¿Su complejidad técnica está justificada por el valor que aporta al usuario?

### B. Hoja de Ruta hacia la Feria de ANATO (Febrero de 2027) `[CONFIRMADO]`
* **Fases 0 y 1 (Concepción, UX, Arquitectura y Legal):** COMPLETADAS AL 100% ✅.
* **Fase 2 (Modelado Relacional de Datos y Engine Matemático):** EN CURSO 🟡 (Prisma schema y tests unitarios).
* **Fase 3 (Scaffolding y Core Engine - Semanas 1 a 4):** Next.js App Router, autenticación multi-tenant y Bloque 1 (Directorio, Diseñador y Guiones). Landing page con lista de espera (Meta: 50 operadores).
* **Fase 4 (Calculadora, Fichas y Operación - Semanas 5 a 8):** Bloque 2 (Motor financiero y Ficha PDF/WhatsApp) y Bloque 3 (Salidas y visor offline). Beta cerrada con 5–10 operadores.
* **Fase 5 (Lanzamiento Público - Febrero de 2027):** Demostración en vivo y lanzamiento comercial en la **Feria de ANATO**.

---

## 14. Matriz de Depuración del MVP: Alcance Estricto vs. Postergaciones (V1.5 / V2)

Esta tabla resume exactamente por qué la versión a construir es más rápida de desarrollar sin perder nada de valor:

| Módulo / Capacidad | Alcance Teórico Futuro *(Postergado a V1.5 / V2)* | Alcance Depurado para el MVP *(ANATO 2027)* | Justificación de la Depuración |
| :--- | :--- | :--- | :--- |
| **Ingesta de Documentos** | Extracción con IA (OCR + LLM) de tarifarios y facturas en PDF/imagen. | **Registro manual asistido en 2 minutos** (nombre, teléfono, categoría y tarifa). | La IA añade costo por token, latencia y semanas de dev para algo que un operador carga en 2 min. `[FASE POSTERIOR]` |
| **Operación Offline en Campo** | PWA con sincronización bidireccional local y resolución de conflictos. | **Descarga e Impresión en 1 Clic (PDF vectorial y Hoja de Ruta en papel)**. | Resolver conflictos offline/online es un pozo de tiempo. El PDF guardado en el celular o impreso funciona al 100% en la montaña sin bugs. `[CONFIRMADO]` |
| **Reutilización de Contenidos** | Catálogo abstracto global N:M con versionamiento complejo de paradas. | **Función "Duplicar Tour" / "Clonar Itinerario" en 1 Clic**. | Un guía tiene 2 o 3 tours en el Plan Rastrillo. Clonar un tour y cambiar 2 paradas resuelve la necesidad con cero fricción técnica. `[CONFIRMADO]` |
| **Categorías de Proveedores** | 10 categorías habilitadas simultáneamente desde el día 1. | **Foco en las 4 categorías esenciales de pasadía:** Transporte, Alimentación, Actividad/Cata y Seguros. | Evita ruido visual innecesario en la UI del MVP. Las otras 6 categorías se liberan progresivamente. `[CONFIRMADO]` |
| **Cobro y Transacciones** | Pasarela de pago online para turistas (Stripe/Wompi) con comisiones. | **Cobro directo del operador (Nequi, Daviplata, efectivo)** + botón WhatsApp. | La plataforma es B2B de productividad, no una OTA de reservas. No retiene fondos ni asume pasarelas bancarias en el MVP. `[CONFIRMADO]` |
| **Complejidad Tributaria** | Motor de retenciones tributarias avanzadas (ReteFuente, ReteICA). | **Calculadora Fijo/Variable + Margen + campo libre de "Imprevistos/Colchón %"**. | Protege el margen real del guía sin abrumarlo con contabilidad tributaria avanzada. `[CONFIRMADO]` |

### Síntesis del Músculo Innegociable del MVP:
1. ✅ **Directorio ágil de aliados** (con tarifas fijas o por persona).
2. ✅ **Diseñador de Itinerario con Storytelling en 3 capas** (Comercial, Guión Narrativo del Guía y Logística Privada).
3. ✅ **Cálculo automático de horarios en cascada** (Ley de Tesler).
4. ✅ **Calculadora Financiera** (Costo Total, Costo Unitario, Margen sobre Ventas vs. Markup y Punto de Equilibrio).
5. ✅ **Botón de 1 Clic** para imprimir / descargar la Hoja de Ruta en PDF (para el cliente o para el guía).
6. ✅ **Programación de Salidas y Manifiesto de Pasajeros** con consentimiento de Habeas Data (Ley 1581) y RNT obligatorio.
