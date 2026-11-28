# [BUG-001] Crash en runtime por fallo de conexión a PostgreSQL (`PrismaClientInitializationError`)

> **ID del Defecto:** `BUG-001`  
> **Proyecto:** Plataforma de Gestión y Desarrollo Turístico (SaaS B2B)  
> **Versión Afectada:** `v2.0` (Rama `F01-guardar-proveedores`)  
> **Fecha de Detección:** 28 de Noviembre de 2026  
> **Reportado por:** Iván Camilo Martínez (`[CEO]`)  
> **Asignado a:** Andrés (`[DEV]`)  
> **Estado:** 🔴 Abierto (Pendiente de Corrección / Configuración de Infraestructura)  
> **Severidad:** 🚨 Alta (Bloquea la persistencia de datos y el flujo CRUD de aliados)  
> **Prioridad:** ⚡ P1 - Alta (Requisito bloqueante para continuar pruebas de integración)  

---

## 1. Título / Resumen del Defecto
**Error de inicialización de cliente de base de datos en Next.js Server Action (`PrismaClientInitializationError: Can't reach database server at localhost:5432`) al renderizar o mutar en `/proveedores`.**

---

## 2. Entorno de Ejecución (Test Environment)
- **Sistema Operativo:** Windows 11 (x64)
- **Framework:** Next.js 16.4.6 (App Router + Turbopack)
- **Motor de Ejecución:** Node.js v26.8.1 / npm v12.0.2
- **ORM / Base de Datos:** Prisma ORM v6.19.3 / PostgreSQL
- **Navegador:** Google Chrome / Microsoft Edge
- **URL / Endpoint:** `http://localhost:3000/proveedores`

---

## 3. Pasos para Reproducir (Steps to Reproduce)
1. Clonar el repositorio y situarse en la rama `F01-guardar-proveedores`.
2. Verificar que el archivo `.env` contenga la cadena por defecto:  
   `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/plataforma_tours?schema=public"`
3. Sin levantar un contenedor de Docker ni un servicio local de PostgreSQL en el puerto 5432, ejecutar:
   ```bash
   npm run dev
   ```
4. Abrir el navegador e ingresar a la URL: `http://localhost:3000/proveedores`.
5. Observar la respuesta del servidor en pantalla.

---

## 4. Resultado Esperado (Expected Result)
La aplicación debería conectarse a una base de datos accesible y listar los proveedores existentes; o en su defecto, implementar un mecanismo de degradación grácil (*Graceful Degradation* con `try/catch` y UI Fallback) informando amigablemente al usuario que la base de datos se encuentra fuera de línea, sin arrojar una pantalla roja de excepción no controlada (*Server Crash Overlay*).

---

## 5. Resultado Real (Actual Result)
Next.js interrumpe la ejecución del servidor y despliega el *Server Error Overlay* bloqueante con la traza de fallo:
```text
Runtime PrismaClientInitializationError: Invalid `prisma.organization.findUnique()` invocation in
C:\Users\ivanc\OneDrive\Desktop\Programación\IA\Proyecto Gestor de Tours - Antigravity\src\actions\providers.ts:10:15

Can't reach database server at `localhost:5432`
Please make sure your database server is running at `localhost:5432`.
```

---

## 6. Evidencia Visual (Screenshot)
![Captura de Pantalla del Error Prisma](../assets/error_prisma_connection.jpg)

---

## 7. Análisis de Causa Raíz (Root Cause Analysis - RCA)
- La función de inicialización `ensureDefaultOrganization()` en [`src/actions/providers.ts`](../../src/actions/providers.ts#L8-L15) ejecuta una consulta directa `prisma.organization.findUnique()` al inicio de cada ciclo de carga o guardado.
- La variable de entorno `DATABASE_URL` apunta a un socket de red local (`localhost:5432`) donde no existe ningún demonio de base de datos escuchando peticiones TCP.
- Falta aprovisionamiento de una instancia gestionada de PostgreSQL (DBaaS en Supabase/Neon) o un archivo `docker-compose.yml` para levantar PostgreSQL en local.
- Carencia de envoltorio de seguridad (*ErrorBoundary* / `try...catch`) en la Server Action que capture el error antes de romper el renderizado del cliente.

---

## 8. Solución Técnica Oficial Adoptada (`[CEO]` e Ingeniería)

### Decisión de Infraestructura: Neon Serverless Postgres (`neon.tech`)
Tras evaluar las alternativas disponibles (Supabase, Docker local y PostgreSQL de escritorio), se ha determinado por decisión de producto y arquitectura que **Neon Serverless Postgres es la mejor solución técnica para el proyecto** debido a:
1. **Despertar Automático Transparente (*Zero Auto-Pause Friction*):** A diferencia del límite de inactividad de 7 días de Supabase que suspende proyectos gratuitos, Neon entra en reposo y se reactiva automáticamente en milisegundos (< 300ms) ante la primera petición de Next.js, eliminando falsos positivos de indisponibilidad.
2. **Colaboración Centralizada en Nube:** Permite que Iván (`[CEO]`) y Andrés (`[DEV]`) compartan el mismo estado de datos transaccionales en tiempo real sin requerir servicios locales pesados instalados en Windows.
3. **Cero Dependencia de Tarjeta de Crédito:** Plan permanente *Always-Free* (0.5 GB de almacenamiento, suficiente para miles de tours y manifiestos).

### Procedimiento de Aprovisionamiento e Implementación:
1. Registrarse o autenticarse en [neon.tech](https://neon.tech) mediante la cuenta de GitHub del proyecto.
2. Crear un nuevo proyecto denominado `plataforma-gestion-tours` (Región recomendada: `US East - N. Virginia`).
3. Copiar la cadena de conexión generada (*Pooled connection string* con SSL):
   ```env
   DATABASE_URL="postgresql://[USER]:[PASSWORD]@[ENDPOINT].neon.tech/plataforma_tours?sslmode=require"
   ```
4. Actualizar la variable `DATABASE_URL` en el archivo `.env` local.
5. Sincronizar el esquema relacional de 12 modelos en Neon:
   ```bash
   npx prisma db push
   ```
6. **Cierre del Defecto:** Verificar que `/proveedores` cargue en verde y permita el guardado del primer aliado sin excepciones en runtime.
