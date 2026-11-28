---
name: bug-reporter-qa
description: >-
  Estándar de aseguramiento de calidad (QA) para registrar, clasificar, nombrar ramas y documentar
  incidencias técnicas (bugs) de la plataforma bajo formato IEEE 829 / Jira con evidencias visuales,
  análisis de causa raíz y planes de mitigación. Usar SIEMPRE que se identifique, reproduzca,
  documente o investigue un error en la aplicación.
---

# Procedimiento de Gestión y Documentación de Incidencias Técnicas (Bug Reporter QA)

Esta skill establece el protocolo estándar de aseguramiento de calidad e ingeniería de software para documentar, categorizar y solucionar cualquier anomalía técnica encontrada en el repositorio, garantizando total coherencia en la nomenclatura de archivos, ramas de Git, evidencias y soluciones.

---

## 🛑 Regla de Oro (Anti-Alucinaciones y Certeza Obligatoria)
> **Nunca documentes un síntoma superficial sin verificar la causa raíz ni propongas soluciones especulativas.**
> Si la causa de la falla es indeterminada o requiere decisiones de arquitectura, expón el análisis, presenta opciones fundamentadas y espera la decisión del usuario.

---

## 1. Convención de Nomenclatura Estricta

Para mantener absoluta trazabilidad entre el problema, el código y el repositorio, rige la siguiente nomenclatura:

### A. Identificador Único del Bug
- **Formato:** `BUG-XXX` (secuencial de 3 dígitos con ceros iniciales, ej. `BUG-001`, `BUG-002`, `BUG-003`).

### B. Nombre de la Rama de Git (*Branch*)
- **Formato:** `bug/BUG-XXX-slug-descriptivo-kebab-case`
- **Ejemplo:** `bug/BUG-001-conexion-postgresql-neon`
- **Regla:** NUNCA uses ramas de funcionalidades (`F01-...`) para documentar o parchar bugs. Toda solución de incidencia vive en su rama `bug/...`.

### C. Nombre del Documento de Reporte
- **Ruta Oficial:** `docs/qa/BUG-XXX_slug_descriptivo.md`
- **Ejemplo:** `docs/qa/BUG-001_conexion_postgresql_neon.md`
- *(Si existe un reporte histórico consolidado como `REPORTE_INCIDENCIA_TECNICA.md`, se mantiene como referencia o se enlaza a los reportes individuales).*

### D. Almacenamiento de Evidencias Visuales
- **Ruta Oficial:** `docs/assets/`
- **Formato de Archivo:** `bug_XXX_evidencia_descriptiva.png` (o `.jpg`)
- **Ejemplo:** `docs/assets/bug_001_error_prisma_connection.jpg`

---

## 2. Niveles de Severidad y Prioridad

| Severidad | Criterio de Impacto | Prioridad de Atención |
| :--- | :--- | :--- |
| **CRÍTICA (Blocker)** | Rompe la aplicación, impide compilar (`npm run build`), bloquea el Core Loop o imposibilita conectar a la base de datos. | Inmediata (P0) |
| **ALTA (Major)** | Un módulo o flujo principal falla (ej. cálculo de margen erróneo, error al guardar proveedor) sin caída total del sistema. | Alta (P1) |
| **MEDIA (Moderate)** | Problemas visuales notables, desalineación en pantallas móviles o warnings de deprecación que degradan UX. | Media (P2) |
| **BAJA (Minor)** | Errores cosméticos menores, inconsistencias de tipografía o textos con errores de redacción. | Baja (P3) |

---

## 3. Plantilla Oficial de Reporte de Incidencia (Estándar IEEE 829 / Jira)

Cada reporte generado en `docs/qa/` DEBE seguir obligatoriamente esta estructura:

```markdown
# Reporte de Incidencia Técnica: [BUG-XXX] [Título Claro del Error]
> **Versión del Sistema:** v2.0 (o versión activa)  
> **Fecha de Detección:** [Día de Mes de Año]  
> **Reportado por:** [CEO / DEV / Antigravity QA]  
> **Severidad:** [CRÍTICA | ALTA | MEDIA | BAJA]  
> **Prioridad:** [P0 | P1 | P2 | P3]  
> **Estado:** [ABIERTO | EN ANÁLISIS | RESUELTO | EN PRUEBAS]  
> **Rama Asignada:** `bug/BUG-XXX-slug-descriptivo`

---

## 1. Resumen Ejecutivo
Descripción concisa de qué falla, en qué vista o flujo y cuál es el impacto directo en el usuario o en la infraestructura.

## 2. Entorno y Contexto de Ejecución
- **Framework:** Next.js 15.x (App Router)
- **Base de Datos / ORM:** PostgreSQL / Prisma ORM
- **Entorno:** Local (Node.js en Windows) / Producción
- **Ruta / URL afectada:** `http://localhost:3000/proveedores`

## 3. Pasos Exactos para Reproducir
1. Paso 1...
2. Paso 2...
3. Observar el comportamiento inesperado.

## 4. Comportamiento Esperado vs. Comportamiento Observado
- **Comportamiento Esperado:** Qué debía hacer el sistema según el diseño funcional.
- **Comportamiento Observado:** Qué hizo el sistema (error en consola, pantalla en blanco, excepción).

## 5. Registro de Error y Stack Trace
Bloque con el log exacto capturado en terminal o consola del navegador:
\`\`\`text
[Pegar stack trace o mensaje de error exacto]
\`\`\`

## 6. Evidencia Visual (Screenshot)
![Evidencia Visual](../assets/bug_XXX_evidencia.jpg)

## 7. Análisis de Causa Raíz (RCA)
Explicación técnica detallada de por qué se generó la falla a nivel de código, red, base de datos o lógica de negocio.

## 8. Solución Técnica Adoptada / Recomendada
- **Mecanismo de Corrección:** Qué cambio se implementa para subsanar el error.
- **Impacto y Efectos Colaterales:** Verificación de que no rompa otras partes del sistema.
- **Prevención:** Patrón o salvaguarda para evitar que vuelva a ocurrir.
```

---

## 4. Flujo de Trabajo Operativo (Paso a Paso)

Cuando se identifique o reporte un error:

1. **Paso 1: Asignar Identificador y Crear Rama:**
   - Consultar el último número de bug en `docs/qa/`.
   - Generar el nuevo ID (ej. `BUG-002`).
   - Crear y cambiarse a la rama: `git checkout -b bug/BUG-XXX-descripcion`.

2. **Paso 2: Capturar Evidencias y Logs:**
   - Guardar la captura en `docs/assets/bug_XXX_...`.
   - Extraer el stack trace limpio sin información sensible.

3. **Paso 3: Redactar el Reporte:**
   - Crear el documento en `docs/qa/BUG-XXX_descripcion.md` con la plantilla canónica.

4. **Paso 4: Implementar la Corrección (Fix):**
   - Aplicar el fix mínimo necesario que resuelva la causa raíz sin sobreingeniería.
   - Probar con `npx tsc --noEmit` y `npm run build`.

5. **Paso 5: Sincronizar y Cerrar:**
   - Commit semántico: `fix(modulo): resolver BUG-XXX descripcion`.
   - Subir la rama: `git push origin bug/BUG-XXX-descripcion`.
   - Marcar el reporte como `RESUELTO`.
