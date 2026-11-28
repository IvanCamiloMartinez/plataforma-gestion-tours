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
![Captura de Pantalla del Error Prisma](docs/assets/error_prisma_connection.jpg)

---

## 7. Análisis de Causa Raíz (Root Cause Analysis - RCA)
- La función de inicialización `ensureDefaultOrganization()` en [`src/actions/providers.ts`](src/actions/providers.ts#L8-L15) ejecuta una consulta directa `prisma.organization.findUnique()` al inicio de cada ciclo de carga o guardado.
- La variable de entorno `DATABASE_URL` apunta a un socket de red local (`localhost:5432`) donde no existe ningún demonio de base de datos escuchando peticiones TCP.
- Falta aprovisionamiento de una instancia gestionada de PostgreSQL (DBaaS en Supabase/Neon) o un archivo `docker-compose.yml` para levantar PostgreSQL en local.
- Carencia de envoltorio de seguridad (*ErrorBoundary* / `try...catch`) en la Server Action que capture el error antes de romper el renderizado del cliente.

---

## 8. Soluciones Recomendadas (Workaround & Fix)

### Solución A (Recomendada): Aprovisionamiento de DBaaS en la Nube
1. Crear una base de datos PostgreSQL en **Supabase** o **Neon**.
2. Actualizar el archivo `.env` local con la cadena de conexión remota con SSL:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
   ```
3. Ejecutar `npx prisma db push` para aplicar las tablas canónicas.

### Solución B: Resiliencia en Código (*Error Handling*)
Modificar `src/actions/providers.ts` para capturar la desconexión:
```typescript
try {
  return await prisma.organization.findUnique({ where: { id: DEFAULT_ORG_ID } });
} catch (err) {
  console.warn("Fallo de conexión a BD. Retornando estado degradado.");
  return null;
}
```
