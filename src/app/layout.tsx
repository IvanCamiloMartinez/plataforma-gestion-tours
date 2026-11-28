import Link from "next/link";
import { Compass, Users, MapPin, Calculator, Calendar } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Lateral */}
      <aside className="w-full md:w-64 bg-slate-900/80 border-r border-slate-800 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-800">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white">GESTOR DE TOURS</h1>
              <span className="text-xs text-emerald-400 font-medium">Plan Rastrillo ($0 COP)</span>
            </div>
          </div>

          <nav className="space-y-1 text-sm font-medium">
            <Link
              href="/proveedores"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              Directorio de Aliados (Paso 1)
            </Link>
            <Link
              href="/tours"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              Diseñador de Tours (Paso 2)
            </Link>
            <Link
              href="/finanzas"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              <Calculator className="w-4 h-4" />
              Motor Financiero (Paso 3)
            </Link>
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 cursor-not-allowed">
              <Calendar className="w-4 h-4" />
              Agenda y Salidas (Paso 5)
            </span>
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 cursor-not-allowed">
              <Calendar className="w-4 h-4" />
              Agenda y Salidas (Paso 5)
            </span>
          </nav>
        </div>

        <div className="mt-8 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Bogotá Nativa</p>
          <p>Organización en modo Demo</p>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
