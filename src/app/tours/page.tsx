import Link from "next/link";
import { Plus, MapPin, Clock, ArrowRight } from "lucide-react";
import { getToursList } from "@/actions/tours";
import { Suspense } from "react";

async function ToursContent() {
  let tours: any[] = [];

  try {
    tours = await getToursList();
  } catch (err) {
    console.warn("Base de datos no disponible durante el build.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Diseñador de Tours</h2>
          <p className="text-sm text-slate-400 mt-1">
            Paso 2 del Core Loop: crea rutas con narrativa en 3 capas y recálculo automático de horarios.
          </p>
        </div>

        <Link
          href="/tours/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Diseñar Nuevo Tour
        </Link>
      </div>

      {tours.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">Aún no has creado ningún tour</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Crea tu primera experiencia con storytelling en 3 capas. El Plan Rastrillo te permite tener hasta 2 tours activos.
          </p>
          <Link
            href="/tours/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            Comenzar Ahora
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tours.map((tour: any) => (
            <div
              key={tour.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-white text-lg">{tour.title}</h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                    {tour.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                  {tour.commercialSummary || "Sin resumen comercial."}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    {Number(tour.durationHours)} horas
                  </span>
                  <span>•</span>
                  <span>{tour.itineraryBlocks?.length || 0} paradas</span>
                  <span>•</span>
                  <span>{tour.destination}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <Link
                  href={`/ficha/${tour.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Ver Ficha Comercial (PDF)
                </Link>

                <Link
                  href={`/finanzas/${tour.id}`}
                  className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white hover:underline"
                >
                  Costear
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Cargando tours...</div>}>
      <ToursContent />
    </Suspense>
  );
}
