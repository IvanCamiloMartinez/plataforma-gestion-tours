import Link from "next/link";
import { Calculator, ArrowRight, DollarSign } from "lucide-react";
import { getToursList } from "@/actions/tours";
import { formatCurrency } from "@/lib/utils";
import { Suspense } from "react";

async function FinanzasIndexContent() {
  let tours: any[] = [];

  try {
    tours = await getToursList();
  } catch (err) {
    console.warn("Base de datos no disponible durante el build.");
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Motor Financiero Desacoplado</h2>
        <p className="text-sm text-slate-400 mt-1">
          Paso 3 del Core Loop: simula costos fijos, variables por persona, margen sobre venta y punto de equilibrio.
        </p>
      </div>

      {tours.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <Calculator className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">Primero diseña un tour</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Para costear y simular márgenes, primero crea una experiencia en el Diseñador (Paso 2).
          </p>
          <Link
            href="/tours/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-semibold"
          >
            Ir al Diseñador de Tours
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
                <h4 className="font-bold text-white text-lg mb-1">{tour.title}</h4>
                <p className="text-xs text-slate-400 mb-4">{tour.destination}</p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-400">Precio Sugerido:</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {tour.suggestedPricePax ? formatCurrency(tour.suggestedPricePax) : "Sin costear"}
                  </span>
                </div>
              </div>

              <Link
                href={`/finanzas/${tour.id}`}
                className="inline-flex items-center justify-between px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                <span>Abrir Simulador Financiero</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FinanzasPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Cargando tours para costeo...</div>}>
      <FinanzasIndexContent />
    </Suspense>
  );
}
