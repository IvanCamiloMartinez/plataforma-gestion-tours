# Reglas de Proyecto: Plataforma de Gestión y Desarrollo Turístico (SaaS B2B)
> **Versión de Reglas:** `v2.0` | **Última Actualización:** 28 de Noviembre de 2026

Este archivo define las **reglas de comportamiento, invariantes de negocio y restricciones técnicas obligatorias** para cualquier agente o desarrollador que trabaje en este repositorio. Su fuente canónica de verdad es [`DOCUMENTO_DISENO_PLATAFORMA_GESTION_TURISTICA.md`](file:///c:/Users/ivanc/OneDrive/Desktop/Programación/IA/Proyecto%20Gestor%20de%20Tours%20-%20Antigravity/DOCUMENTO_DISENO_PLATAFORMA_GESTION_TURISTICA.md).

---

## 🛑 1. Parámetro Anti-Alucinaciones y Certeza Obligatoria

> **INVARIANTE CRÍTICA:**
> **Si la IA no tiene una respuesta/solución/propuesta exacta, no generar ninguna respuesta sino notificar al usuario y preguntar por otras opciones.**

- Queda estrictamente prohibido inventar librerías, inventar datos, asumir requerimientos no descritos o generar código especulativo.
- Toda decisión debe fundamentarse en el diseño validado en este documento o en consultas explícitas al usuario.
- Respetar siempre las convenciones de certeza del proyecto: `[CONFIRMADO]`, `[RECOMENDACIÓN]`, `[HIPÓTESIS]` y `[FASE POSTERIOR]`.

---

## 2. Identidad del Producto y Alcance Innegociable

- **Propósito:** Plataforma SaaS B2B de productividad, diseño de experiencias y gestión financiera/operativa para **guías de turismo independientes con tarjeta profesional y agencias boutique receptivas (1 a 4 personas)** en Colombia y Latinoamérica.
- **Lo que NUNCA es la plataforma:**
  - **NO es un marketplace B2C.**
  - **NO es una OTA (Online Travel Agency)** (no compite con Civitatis, Viator ni Airbnb Experiences).
  - **NO compite con el cliente:** No vende al viajero final ni cobra comisiones por reserva de turistas.
- **Hito de Lanzamiento Público:** Feria Vitrina Turística ANATO (Febrero de 2027).

---

## 3. Invariante de Experiencia de Usuario: Ley de Tesler

> *"El software absorbe el 100% de la complejidad administrativa, matemática y operativa para que el profesional del turismo pueda concentrarse en diseñar y desarrollar buenas experiencias."*

- **Cero Fricción:** El usuario no hace cálculos manuales ni configuraciones contables complejas.
- **Flujo Vital ("Core Loop" de 5 Pasos):**
  1. **Directorio Base:** Proveedores y tarifas unitarias estandarizadas.
  2. **Diseñador de Itinerario con Storytelling en 3 Capas:** Bloques cronológicos modulares con recálculo automático de horarios en cascada.
  3. **Motor Financiero Desacoplado:** Simulación de costos fijos/variables, márgenes y punto de equilibrio.
  4. **Ficha Comercial e Impresión en 1 Clic:** PDF descargable y hoja de ruta lista para imprimir en papel estándar carta (`@media print`).
  5. **Agenda de Salidas y Manifiesto:** Programación de fechas, aforos y registro legal de pasajeros.
- **Eficiencia:** El flujo asistido (*wizard*) debe permitir diseñar y costear un tour completo en menos de 20 minutos.
- **Mobile-First:** Interfaz de campo diseñada para uso con una sola mano (botones de acción $\ge 44\times44\text{px}$ en la zona del pulgar).

---

## 4. Arquitectura de Storytelling en 3 Capas por Hito/Bloque

Cada bloque de itinerario (`ItineraryBlock`) contiene estrictamente 3 capas de información:

1. **Capa Comercial (Pública / Turista):** Título atractivo, fotos, tiempos y promesas de valor ("Qué incluye / No incluye"). Visible en la web y en la ficha compartible.
2. **Capa Interpretativa (Storytelling / Guía Titular y Administrador):** Hitos históricos, datos biológicos/patrimoniales, anécdotas y preguntas detonantes para romper el hielo en ruta. Solo visible para el equipo del tour; jamás expuesta al cliente.
3. **Capa Operativa Privada (Logística y Confidencial):** Teléfonos directos de aliados, instrucciones de acceso, datos médicos/dietéticos de pasajeros y notas de caja menor (efectivo, saldos pendientes). Oculta al cliente final.

---

## 5. Motor Financiero Desacoplado y Rigor Numérico

- **Tipado Decimal Estricto:** Prohibido el uso de punto flotante nativo (`number`) para cálculos financieros acumulativos. Usar `Decimal(12,2)` en Prisma/PostgreSQL y tipos de precisión decimal en TypeScript.
- **Moneda Local (COP) y Cotización Referencial en USD:** 
  - Contabilidad y tarifas oficiales operan **100% en pesos colombianos (COP)** en tipos `Decimal(12,2)`. Precios al público redondeados al millar más cercano (sin centavos en interfaces de cotización).
  - La Ficha Comercial puede mostrar cotización informativa en USD/EUR basada en TRM referencial configurada por el operador, acompañada de la leyenda legal obligatoria: *"Tarifa oficial liquidada en COP; valor en USD puramente referencial sujeto a la tasa de cambio del día de pago"*.
- **Distinción Inmutable: Margen sobre Ventas vs. Markup:**
  - **Costo Total:** $CostoTotal(n) = CF + (CV_{pax} \cdot n) + CV_{grupo}(n)$
  - **Costo Unitario:** $CostoUnitario(n) = \frac{CostoTotal(n)}{n}$
  - **Margen sobre Venta ($m$, con $0 \le m < 1$):**
    $$Precio_{margen}(n, m) = \frac{CostoUnitario(n)}{1 - m}$$
  - **Recargo / Markup ($k$):**
    $$Precio_{markup}(n, k) = CostoUnitario(n) \cdot (1 + k)$$
  - **Punto de Equilibrio ($n_{eq}$ a Precio $P$):**
    $$n_{eq}(P) = \left\lceil \frac{CF + CV_{grupo}}{P - CV_{pax}} \right\rceil \quad \text{donde } P > CV_{pax}$$
- **Inmutabilidad de Tarifas:** Las salidas y tours confirmados conservan un *snapshot* histórico de las tarifas, sin recalcularse si el proveedor sube precios posteriormente.

---

## 6. Filtros y Disciplina de Depuración para el MVP

Para garantizar el lanzamiento puntual en ANATO 2027, aplican las siguientes restricciones deliberadas:

1. **Sin Ingesta por IA / OCR en v1:** Registro de tarifas y aliados mediante formularios asistidos en 2 minutos. Cero costos de inferencia y cero riesgo de alucinación en números.
2. **Sin Sincronización Bidireccional Offline Compleja (CRDT/OT) en v1:** Operación en campo mediante descarga de PDFs vectoriales estáticos y hojas de ruta listas para imprimir (`@media print`).
3. **Sin Pasarela de Pagos Transaccional Integrada en v1:** La plataforma no procesa tarjetas de turistas ni cobra comisiones. El cobro lo hace el operador (Nequi, Daviplata, efectivo, transferencia).
4. **Foco en 4 Categorías Core Iniciales:** Transporte, Alimentación, Actividad/Cata y Seguros. Las 6 categorías restantes se habilitan progresivamente.
5. **Reutilización Ligera:** Duplicación de tours y clonación de itinerarios en 1 clic en lugar de motores abstractos N:M con sobreingeniería.
6. **Carga Centralizada del Manifiesto Exclusivo por el Operador:** El turista final nunca interactúa con formularios de la plataforma. El guía registra los pasajeros mediante carga rápida en lote (*Fast Entry*) en su panel privado, previniendo condiciones de carrera, sobreventas y bloqueos concurrentes en base de datos.

---

## 7. Cumplimiento Normativo Colombiano y Estándar de Seguros

- **Habeas Data (Ley Estatutaria 1581 de 2012):**
  - Casilla de verificación juramentada obligatoria al cargar pasajeros en el manifiesto (`habeasDataConsent: true`, `habeasDataConsentAt`).
  - Implementación obligatoria de soporte para el **Derecho al Olvido** (anonimización/purga de datos personales a solicitud del titular).
- **Registro Nacional de Turismo (Ley 2068 de 2020) y Tarjeta Profesional de Guía:**
  - **RNT Escalonado:** Registro inicial libre sin RNT obligatorio (evita fricción al probar el taller) ➔ Exigencia estrictamente obligatoria y bloqueante para publicar la Ficha Comercial (Web/PDF) o despachar Salidas oficiales, estampando el RNT y la cláusula legal de prevención de ESCNNA (Ley 679 de 2001).
  - **Tarjeta Profesional de Guía (Ley 1558 de 2012 / Ley 2068 de 2020):** Campo opcional en el perfil de guía pero **altamente recomendado**. Al registrarse, se estampa la acreditación profesional en la Ficha Comercial (*"Guía Profesional Certificado - T.P. No. XXXXX"*) otorgando prestigio y confianza ante el viajero.
- **Estándar de Asistencia Médica en Viaje (Colasistencia / Assist Card):**
  - Registro obligatorio en `Passenger`: tipo y número de documento (CC, CE, PAS, PPT, TI), fecha de nacimiento y edad calculada, contacto de emergencia obligatorio de un tercero no viajero, y alertas médicas/dietéticas críticas (alergias severas, condición cardíaca, vegetarianismo/veganismo).
  - Exportación en 1 clic de manifiesto en CSV/Excel compatible con las plataformas de emisión de pólizas.

---

## 8. Stack Tecnológico, Arquitectura y Trazabilidad

- **Frontend & Backend:** Next.js (App Router, React Server Components y Server Actions).
- **Lenguaje:** TypeScript en modo estricto (`strict: true`, sin `any` arbitrarios).
- **UI & Accesibilidad:** Tailwind CSS + shadcn/ui (Radix UI), con componentes accesibles (WCAG AA).
- **Base de Datos y ORM:** PostgreSQL gestionado con Prisma ORM con transacciones ACID para control estricto de cupos y aforos.
- **Validación:** Esquemas compartidos con Zod entre cliente y servidor.
- **Aislamiento Multi-Tenant:**
  - Todas las entidades de negocio pertenecen a una `Organization`.
  - Toda consulta, mutación o eliminación en base de datos debe filtrar de forma obligatoria por `organizationId` obtenido de la sesión autenticada. Queda prohibida cualquier consulta transversal no aislada.
- **Trazabilidad y Borrado Lógico (*Soft Delete*):**
  - Invariante estricta: entidades clave (`Provider`, `Stop`, `Tour`, `Departure`) implementan `deletedAt: DateTime?`.
  - Queda terminantemente prohibido el borrado destructivo (`DELETE` físico en SQL) para preservar la integridad referencial de salidas pasadas, auditorías contables y comprobantes de Habeas Data.
- **Ciclo de Vida de Salidas, Cierre de Caja y Reprogramación por Clima / Fuerza Mayor:**
  - Estados oficiales de `Departure`: `PROGRAMADA`, `EN_CURSO`, `COMPLETADA`, `REPROGRAMADA` y `CANCELADA`.
  - Al mutar a `COMPLETADA`, la plataforma genera automáticamente el **Cierre de Caja** (Total recaudado - Costos liquidados = Utilidad neta real en el bolsillo del operador) persistido en `Decimal(12,2)`.
  - Mecanismo en 1 clic para mover fecha/hora conservando intacto el manifiesto de pasajeros y el historial de costos.
  - **Invariante de Canal WhatsApp (`wa.me`):** Los enlaces directos se usan **únicamente para comunicar a los turistas solicitudes importantes, cambios de horario o imprevistos/contingencias graves de la salida** (cero spam y cero costos de Meta).
- **Control de Anticipos en Pasajeros (Regla 50% / Saldo):**
  - Manejo de estados de pago (`PENDIENTE`, `ANTICIPO`, `PAGADO_TOTAL`) con cálculo reactivo de saldo pendiente para cobro en el punto de encuentro.
- **Política de Free Trial de 30 Días y Bloqueo Estricto de Proveedores Excedentes:**
  - El usuario puede iniciar 30 días de prueba gratuita sin tarjeta de crédito para Plan Guía o Tour Leader.
  - Si al terminar el periodo de 30 días no contrata suscripción de pago, retorna de inmediato al Plan Rastrillo ($0 COP).
  - **Invariante Anti-Bypass de Proveedores:** Ningún dato se borra, pero los proveedores que excedan el límite de 5 por categoría o que pertenezcan a categorías no cubiertas en Rastrillo (categorías 5 a 10) quedan **estrictamente inaccesibles** (bloqueados para lectura de teléfonos/tarifas, edición y uso en tours). Para volver a acceder a ellos, verlos o modificarlos, el usuario debe pagar al menos un mes de suscripción superior.
- **Deslinde Legal Total de Responsabilidad, Veto y Reporte a Autoridades:**
  - Los propietarios, desarrolladores, socios y distribuidores del software operan **exclusivamente como proveedores tecnológicos B2B** y se deslindan total y absolutamente de la prestación del tour, seguridad física de viajeros, accidentes, calidad del servicio y de cualquier uso fraudulento, engañoso, ilegal o perjudicial por parte del operador o sus guías.
  - La plataforma no intermedia pagos ni custodia fondos de reservas de turistas.
  - **Facultad Expresa de Veto y Denuncia:** Los administradores del sistema se reservan el derecho irrenunciable de vetar, desactivar y bloquear de forma definitiva (`isSuspended: true`) la organización del usuario y a todos sus miembros ante indicios de estafas, delitos, falsedad en RNT/tarjeta profesional, o infracciones a la Ley 679 (ESCNNA) o Ley 1581 (Habeas Data), además de denunciar y colaborar directamente con las autoridades competentes (Fiscalía, Policía, MinCIT, SIC).

---

## 9. Comunicación y Enfoque Pedagógico Dual

- **Claridad de Negocio:** Toda explicación para el usuario debe formularse en español claro, profesional y comprensible para el guía o empresario turístico, sin tecnicismos innecesarios.
- **Rigor Técnico:** Todas las especificaciones para desarrollo deben mantener precisión matemática, tipado exacto y contratos de datos sin ambigüedades.

---

## 10. Protocolo de Consulta ante Ambigüedad o Falta de Certeza

Cuando se presente un escenario no cubierto explícitamente en [`DOCUMENTO_DISENO_PLATAFORMA_GESTION_TURISTICA.md`](file:///c:/Users/ivanc/OneDrive/Desktop/Programación/IA/Proyecto%20Gestor%20de%20Tours%20-%20Antigravity/DOCUMENTO_DISENO_PLATAFORMA_GESTION_TURISTICA.md) o clasificado como `[HIPÓTESIS]`:
1. **Detenerse de inmediato:** No escribir código preliminar ni asumir valores por defecto arbitrarios.
2. **Identificar la disyuntiva:** Describir con precisión qué dato, regla de negocio o decisión técnica falta.
3. **Ofrecer alternativas fundadas:** Presentar 2 o 3 opciones alineadas con los principios del proyecto (simplicidad MVP, Ley de Tesler, legislación colombiana).
4. **Esperar la confirmación:** Requerir la decisión explícita del usuario antes de proceder con la implementación.

---

## 11. Invariante de Versionamiento Documental Obligatorio

- **Regla Estricta de Versionado:** Cada vez que se actualice o modifique cualquier documento del proyecto (Markdown, Word, esquemas, etc.), el agente debe registrar y actualizar de forma obligatoria en el encabezado:
  1. El número de versión explícito (ej. `v1.0`, `v1.1`, `v1.2`).
  2. La fecha exacta de la última actualización.
  3. El estado del hito (ej. *MVP Canónico Validado*).
- **Prohibido omitir:** Queda terminantemente prohibido publicar o actualizar un documento sin su correspondiente etiqueta de versión y fecha.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
