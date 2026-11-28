import Link from "next/link";
import { Calendar, Plus, Users, ArrowRight, DollarSign } from "lucide-react";
import { getDeparturesList } from "@/actions/departures";
import { getToursList } from "@/actions/tours";
import { formatCurrency } from "@/lib/utils";
import { Suspense } from "react";

async function SalidasIndexContent() {
  let departures: any[] = [];
  let tours: any[] = [];

  try {
    departures = await getDeparturesList();
    tours = await getToursList();
  } catch (err) {
    console.warn("Base de datos no disponible durante el build.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Agenda de Salidas y Manifiestos</h2>
          <p className="text-sm text-slate-400 mt-1">
            Paso 5 del Core Loop: control de aforo, pasajeros, anticipos y cierre de caja en campo.
          </p>
        </div>

        {tours.length > 0 && (
          <Link
            href="/salidas/nueva"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Programar Nueva Salida
          </Link>
        )}
      </div>

      {departures.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No hay salidas programadas</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Programa tu primera fecha oficial para abrir cupos y registrar los pasajeros en el manifiesto.
          </p>
          <Link
            href="/salidas/nueva"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            Programar Fecha
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departures.map((dep: any) => (
            <div
              key={dep.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-white text-lg">{dep.tour?.title}</h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      dep.status === "COMPLETADA"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : dep.status === "REPROGRAMADA"
                        ? "bg-amber-500/10 text-amber-300"
                        : "bg-blue-500/10 text-blue-300"
                    }`}
                  >
                    {dep.status}
                  </span>
                </div>

                <p className="text-xs font-mono text-emerald-400 font-semibold mb-4">
                  {new Date(dep.departureDate).toLocaleDateString("es-CO", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-white">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    {dep.passengers?.length || 0} / {dep.maxCapacity} Pasajeros
                  </span>
                  <span>•</span>
                  <span>{dep.availableSlots} cupos libres</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                {dep.status === "COMPLETADA" ? (
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Utilidad Real: {formatCurrency(Number(dep.netProfit))}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">En curso</span>
                )}

                <Link
                  href={`/salidas/${dep.id}`}
                  className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white hover:underline font-semibold"
                >
                  Abrir Manifiesto
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SalidasPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Cargando agenda de salidas...</div>}>
      <SalidasIndexContent />
    </Suspense>
  );
}
