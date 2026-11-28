"use client";

import { useState, useTransition } from "react";
import { Plus, ArrowLeft, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { createDeparture } from "@/actions/departures";
import { useRouter } from "next/navigation";

export default function NuevaSalidaView({ tours }: { tours: { id: string; title: string; maxPax: number }[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [tourId, setTourId] = useState(tours[0]?.id || "");
  const [departureDate, setDepartureDate] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(12);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourId || !departureDate) {
      setErrorMsg("Selecciona un tour y la fecha oficial de salida.");
      return;
    }

    startTransition(async () => {
      const res = await createDeparture(tourId, departureDate, maxCapacity);
      if (res.success) {
        router.push(`/salidas/${res.departureId}`);
      } else {
        setErrorMsg(res.error || "Error al programar salida");
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link
          href="/salidas"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-white">Programar Fecha de Salida</h2>
          <p className="text-xs text-slate-400">Apertura de cupos y manifiesto de pasajeros.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Selecciona el Tour a Programar *</label>
          <select
            value={tourId}
            onChange={(e) => setTourId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
          >
            {tours.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha y Hora de Encuentro *</label>
          <input
            type="datetime-local"
            required
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Aforo Máximo de Cupos *</label>
          <input
            type="number"
            min="1"
            max="30"
            required
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Link
            href="/salidas"
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-medium"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            {isPending ? "Programando..." : "Crear y Abrir Manifiesto"}
          </button>
        </div>
      </form>
    </div>
  );
}
