# Reporte de Incidencia Técnica: Ausencia de Conexión a Base de Datos PostgreSQL
## Diagnóstico de Error en Runtime (`PrismaClientInitializationError`)
> **Versión del Documento:** `v1.0`  
> **Fecha del Reporte:** 28 de Noviembre de 2026  
> **Estado:** Abierto / Pendiente de Aprovisionamiento de Base de Datos (`[DEV] Andrés`)  
> **Severidad:** Media (Bloqueo en persistencia / Frontend 100% operativo)  
> **Ruta Afectada:** `http://localhost:3000/proveedores`

---

## 1. Resumen Ejecutivo de la Incidencia

Al interactuar con el entorno de desarrollo local en `http://localhost:3000/proveedores`, el navegador renderiza una pantalla roja de error de Next.js (*Server Error Overlay*):

![Captura de Pantalla del Error Prisma](docs/assets/error_prisma_connection.jpg)

```text
Runtime PrismaClientInitializationError: Invalid `prisma.organization.findUnique()` invocation in
C:\Users\ivanc\...\src\actions\providers.ts:10:15
Can't reach database server at `localhost:5432`
```

Este fallo no representa un error en el código de TypeScript ni en la arquitectura de Next.js, sino la **falta de un servidor físico de PostgreSQL escuchando en el puerto 5432 o una cadena de conexión remota válida configurada en `.env`**.

---

## 2. Detalle del Error y Trazabilidad (Stack Trace)

* **Excepción:** `PrismaClientInitializationError`
* **Origen de Invocación:** [`src/actions/providers.ts`](src/actions/providers.ts#L8-L15)
* **Función:** `ensureDefaultOrganization()`
* **Fragmento de Código Ejecutado:**
  ```typescript
  async function ensureDefaultOrganization() {
    // Falla aquí al intentar conectar con la base de datos
    const org = await prisma.organization.findUnique({
      where: { id: DEFAULT_ORG_ID },
    });
    ...
  }
  ```
* **Causa Raíz:**
  La variable de entorno `DATABASE_URL` en el archivo `.env` local apunta por defecto a:
  ```env
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/plataforma_tours?schema=public"
  ```
  Al no existir un servicio demonio de PostgreSQL instalado y corriendo localmente en la máquina Windows de Iván (`[CEO]`), el cliente de Prisma agota el tiempo de espera (*connection timeout*) y aborta la petición.

---

## 3. Plan de Acción y Solución Propuesta (Para `[DEV] Andrés`)

Existen dos vías de resolución estandarizadas en la industria:

### Opción A (Recomendada para Desarrollo Colaborativo): Base de Datos DBaaS en la Nube
Aprovisionar una instancia gratuita de PostgreSQL administrada en la nube (ej. **Supabase** o **Neon**):
1. Crear un proyecto en Supabase o Neon denominado `plataforma-gestion-tours`.
2. Obtener la cadena de conexión con SSL activado (`pooled` o `direct`):
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
   ```
3. Sustituir `DATABASE_URL` en el archivo `.env` local de Iván y de Andrés.
4. Ejecutar el comando de sincronización de esquema:
   ```bash
   npx prisma db push
   # o
   npx prisma migrate dev --name init
   ```
5. **Ventaja:** Permite que tanto Iván como Andrés lean y escriban sobre la misma base de datos compartida sin configurar servicios locales pesados.

---

### Opción B: Entorno Local con Contenedor Docker
Si se prefiere mantener la base de datos estrictamente local:
1. Crear un archivo `docker-compose.yml` en la raíz del repositorio:
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15-alpine
       container_name: tours_db
       environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgrespassword
         POSTGRES_DB: plataforma_tours
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```
2. Iniciar el servicio con: `docker compose up -d`.
3. Ejecutar: `npx prisma db push`.

---

## 4. Medida de Mitigación en el Código de Aplicación

Para mejorar la resiliencia de la interfaz (*Graceful Degradation*), se recomienda envolver las llamadas de inicialización en bloques controlados de captura de excepciones (`try/catch`), renderizando una alerta amigable en la interfaz en lugar del modal rojo de fallo fatal cuando la base de datos no esté accesible.
