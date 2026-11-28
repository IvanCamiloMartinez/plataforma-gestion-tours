# Plataforma de Gestión y Desarrollo Turístico (SaaS B2B)

> **Versión:** `v1.0` | **Última Actualización:** 28 de Noviembre de 2026  
> **Lanzamiento Comercial Oficial:** Vitrina Turística ANATO (Febrero 2027)  
> **Licencia:** Privada / Propietaria

---

## 📌 1. Visión y Propósito del Producto

Plataforma SaaS B2B orientada a la **productividad, diseño de experiencias, optimización financiera y control operativo** para **guías de turismo independientes con tarjeta profesional** y **agencias boutique receptivas (1 a 4 personas)** en Colombia y Latinoamérica.

### 🛑 Lo que NUNCA es la plataforma:
- **NO es un marketplace B2C ni una OTA (Online Travel Agency):** No compite con Civitatis, Viator, GetYourGuide ni Airbnb Experiences.
- **NO vende al viajero final ni cobra comisiones por reserva:** La plataforma provee el software de trabajo profesional del operador.

---

## ⚡ 2. El Flujo Vital ("Core Loop" de 5 Pasos)

1. **Directorio Base Centralizado:** Proveedores y tarifas unitarias estándar (Transporte, Alimentación, Actividades/Catas, Seguros).
2. **Diseñador de Itinerario con Storytelling en 3 Capas:**
   - *Capa Comercial:* Información pública y atractiva para el turista.
   - *Capa Interpretativa:* Guión cultural, datos patrimoniales y anécdotas exclusivas para el guía.
   - *Capa Operativa Privada:* Teléfonos directos de aliados, logística confidencial y saldos de caja.
   - *Automatización:* Recálculo en cascada de horarios ante cualquier cambio de duración (Ley de Tesler).
3. **Motor Financiero Decimal Desacoplado:** Simulación de costos fijos, variables unitarios por pax y grupales por umbral, cálculo exacto de margen sobre venta vs. markup y punto de equilibrio en pesos colombianos (`Decimal(12,2)`).
4. **Ficha Comercial e Impresión en 1 Clic:** Ficha web compartible vía WhatsApp y hoja de ruta vectorial en PDF lista para imprimir en papel carta (`@media print`).
5. **Agenda de Salidas y Manifiesto Legal:** Control de aforos, anticipos (regla 50%/saldo), registro de pasajeros con Habeas Data (Ley 1581) y exportación para emisión de pólizas de asistencia médica (Colasistencia / Assist Card). Cierre de caja automático (`netProfit`) al completar la salida.

---

## 🛠️ 3. Stack Tecnológico

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, React Server Components y Server Actions).
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) en modo estricto (`strict: true`).
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) (Soporte transaccional ACID y precisión `DECIMAL(12,2)`).
- **ORM:** [Prisma ORM](https://www.prisma.io/) (12 modelos de datos canónicos, migraciones y tipado seguro).
- **Estilos & UI:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI, estándar de accesibilidad WCAG AA).
- **Validación:** [Zod](https://zod.dev/) para esquemas compartidos cliente-servidor.

---

## 🚀 4. Guía de Instalación y Configuración del Entorno Local

Sigue estos pasos para clonar el repositorio y levantar un entorno de desarrollo idéntico:

### Prerrequisitos
Asegúrate de tener instalado en tu máquina:
- **Node.js:** Versión `20.x` LTS o superior.
- **Gestor de Paquetes:** `npm`, `pnpm` o `yarn`.
- **Git:** Instalado y configurado con tus credenciales de GitHub.
- **Base de Datos PostgreSQL:** Instancia local (PostgreSQL / Docker) o base de datos en la nube (Supabase / Neon).

---

### Paso a Paso para Desarrolladores

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/IvanCamiloMartinez/plataforma-gestion-tours.git
cd plataforma-gestion-tours
```

#### 2. Instalar Dependencias
```bash
npm install
# o si usas pnpm:
# pnpm install
```

#### 3. Configurar Variables de Entorno (`.env`)
Crea un archivo `.env` en la raíz del proyecto copiando el archivo de ejemplo:
```bash
cp .env.example .env
```
Configura la cadena de conexión a tu base de datos PostgreSQL:
```env
# URL de conexión a PostgreSQL (local o nube - Supabase/Neon)
DATABASE_URL="postgresql://usuario:password@localhost:5432/plataforma_tours?schema=public"

# Secreto para sesiones y tokens (generar uno seguro)
NEXTAUTH_SECRET="tu-clave-secreta-de-desarrollo"
NEXTAUTH_URL="http://localhost:3000"
```

#### 4. Ejecutar Migraciones de Base de Datos y Generar Cliente Prisma
El proyecto incluye un esquema relacional completo de 12 modelos en `prisma/schema.prisma`:
```bash
# Generar el cliente de TypeScript tipado de Prisma
npx prisma generate

# Aplicar las migraciones a tu base de datos
npx prisma migrate dev --name init

# (Opcional) Visualizar los datos en el navegador con Prisma Studio
npx prisma studio
```

#### 5. Iniciar el Servidor de Desarrollo
```bash
npm run dev
# o con pnpm:
# pnpm dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000) para ver la aplicación en ejecución.

---

## 📂 5. Estructura del Repositorio

```text
├── prisma/
│   └── schema.prisma           # 12 modelos canónicos (PostgreSQL + Multi-Tenant)
├── src/
│   ├── actions/                # Server Actions seguras (CRUD con validación Zod)
│   ├── app/                    # Next.js App Router (Páginas, layouts y rutas API)
│   │   ├── (auth)/             # Login, registro y verificación RNT
│   │   ├── (dashboard)/        # Panel administrativo multi-tenant
│   │   │   ├── proveedores/    # MÓDULO 1: Directorio base
│   │   │   ├── tours/          # MÓDULO 2: Diseñador 3 Capas
│   │   │   ├── finanzas/       # MÓDULO 3: Simulador financiero
│   │   │   └── salidas/        # MÓDULO 5: Salidas y Manifiesto
│   │   └── api/                # Endpoints auxiliares y webhooks
│   ├── components/             # Componentes UI (shadcn/ui + componentes de dominio)
│   └── lib/                    # Utilidades transversales, Prisma client y fórmulas
├── AGENTS.md                   # Reglas de comportamiento e invariantes técnicas obligatorias
├── DOCUMENTO_DISENO_PLATAFORMA_GESTION_TURISTICA.md  # Fuente canónica de negocio y diseño (v1.5)
└── ESPECIFICACION_TECNICA_ARQUITECTURA.md            # Especificación técnica detallada para DEV (v1.0)
```

---

## 📖 6. Documentación Canónica de Referencia

Para comprender todas las reglas de negocio, decisiones y arquitectura, consulta los documentos oficiales en la raíz del repositorio:
- [**DOCUMENTO_DISENO_PLATAFORMA_GESTION_TURISTICA.md**](DOCUMENTO_DISENO_PLATAFORMA_GESTION_TURISTICA.md): Visión integral de negocio, pricing Freemium 3x, marco normativo colombiano (RNT Ley 2068, Habeas Data Ley 1581, Tarjeta Profesional Ley 1558, Prevención ESCNNA Ley 679) y términos legales con deslinde de responsabilidad.
- [**ESPECIFICACION_TECNICA_ARQUITECTURA.md**](ESPECIFICACION_TECNICA_ARQUITECTURA.md): Especificación técnica para el equipo de desarrollo con contratos de datos, patrones de software e invariantes de base de datos.
- [**AGENTS.md**](AGENTS.md): Reglas de gobernanza estricta, protocolo anti-alucinaciones y directrices de ingeniería.

---

## 👥 Equipo del Proyecto

- **Iván Camilo Martínez:** `[CEO]` - Dirección de Producto, Modelo de Negocio y Operaciones.
- **Andrés:** `[DEV]` - Arquitectura de Software, Ingeniería y Desarrollo Full-Stack.
- **Antigravity AI:** Asistente de Ingeniería de Software y Documentación.
