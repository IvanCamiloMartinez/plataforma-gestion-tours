"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Calculator, TrendingUp, Users, DollarSign, ShieldAlert, ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { calculateFinancialSimulation, CostItemInput } from "@/lib/math/finance";
import { saveTourCosts } from "@/actions/finance";

interface ProviderTariffItem {
  id: string;
  commercialName: string;
  concept: string;
  costType: "FIXED_DEPARTURE" | "VARIABLE_PAX";
  amount: number;
}

export default function CalculadoraFinancieraView({
  tour,
  suggestedProviders,
}: {
  tour: any;
  suggestedProviders: ProviderTariffItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Lista de Costos
  const [costs, setCosts] = useState<CostItemInput[]>(
    tour.costItems?.length > 0
      ? tour.costItems.map((c: any) => ({
          id: c.id,
          concept: c.concept,
          costType: c.costType,
          amount: Number(c.amount),
        }))
      : [
          { concept: "Honorarios Guía Principal", costType: "FIXED_DEPARTURE", amount: 200000 },
          { concept: "Póliza Asistencia Médica Colasistencia", costType: "VARIABLE_PAX", amount: 8000 },
          { concept: "Imprevistos y Caja Menor", costType: "FIXED_DEPARTURE", amount: 50000 },
        ]
  );

  // Parámetros de Simulación Interactiva
  const [paxCount, setPaxCount] = useState<number>(tour.maxPax || 8);
  const [marginPercent, setMarginPercent] = useState<number>(
    tour.targetMarginPercent ? Number(tour.targetMarginPercent) : 35
  );

  // Form para nuevo costo rápido
  const [newConcept, setNewConcept] = useState("");
  const [newCostType, setNewCostType] = useState<"FIXED_DEPARTURE" | "VARIABLE_PAX">("FIXED_DEPARTURE");
  const [newAmount, setNewAmount] = useState("");

  // Cálculo en tiempo real con el motor Decimal.js
  const simulation = calculateFinancialSimulation(costs, paxCount, marginPercent);

  const addCost = () => {
    const amountNum = parseFloat(newAmount);
    if (!newConcept.trim() || isNaN(amountNum) || amountNum <= 0) return;

    setCosts([...costs, { concept: newConcept.trim(), costType: newCostType, amount: amountNum }]);
    setNewConcept("");
    setNewAmount("");
  };

  const importSuggested = (provider: ProviderTariffItem) => {
    setCosts([
      ...costs,
      {
        concept: `${provider.commercialName} - ${provider.concept}`,
        costType: provider.costType,
        amount: provider.amount,
      },
    ]);
  };

  const removeCost = (index: number) => {
    setCosts(costs.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const res = await saveTourCosts(
        tour.id,
        costs,
        marginPercent,
        simulation.suggestedPriceMargin
      );

      if (res.success) {
        setSuccessMsg("¡Estructura de costos y precios guardada con éxito!");
      } else {
        setErrorMsg(res.error || "Error al guardar costos");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/tours"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Motor Financiero Desacoplado</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tour: <strong className="text-white">{tour.title}</strong> • Simulación en tiempo real en pesos COP.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Guardando..." : "Fijar Precios y Costos"}
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* BLOQUE CENTRAL: El Simulador Interactivo (Sliders) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Simulador de Escenarios y Margen
          </h3>
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
            Simulando para: {paxCount} Viajeros
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider de Pasajeros */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                Tamaño del Grupo Proyectado:
              </span>
              <span className="text-base font-bold font-mono text-white">{paxCount} pax</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={paxCount}
              onChange={(e) => setPaxCount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>1 pax (Privado)</span>
              <span>10 pax (Medio)</span>
              <span>20 pax (Grupo)</span>
            </div>
          </div>

          {/* Slider de Margen sobre Venta */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Margen sobre Venta Deseado:
              </span>
              <span className="text-base font-bold font-mono text-emerald-400">{marginPercent}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={marginPercent}
              onChange={(e) => setMarginPercent(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>10% (Bajo)</span>
              <span>35% (Estándar Recomendado)</span>
              <span>70% (Premium)</span>
            </div>
          </div>
        </div>

        {/* TARJETAS DE RESULTADOS EN TIEMPO REAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Precio Sugerido */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">PRECIO SUGERIDO / PAX</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {formatCurrency(simulation.suggestedPriceMargin)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Redondeado al millar COP</span>
          </div>

          {/* Punto de Equilibrio */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">PUNTO DE EQUILIBRIO</span>
            <span className="text-2xl font-black font-mono text-amber-300">
              {simulation.breakEvenPax} pasajeros
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Para salir en $0 ceros</span>
          </div>

          {/* Utilidad Neta Proyectada */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">UTILIDAD NETA TOTAL</span>
            <span className="text-2xl font-black font-mono text-white">
              {formatCurrency(simulation.netProfitProjected)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Para el grupo de {paxCount} pax</span>
          </div>

          {/* Costo Unitario */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">COSTO REAL POR PAX</span>
            <span className="text-2xl font-black font-mono text-slate-300">
              {formatCurrency(simulation.unitCost)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              Fijos: {formatCurrency(simulation.totalFixedCosts)}
            </span>
          </div>
        </div>
      </div>

      {/* BLOQUE DE GESTIÓN DE COSTOS */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-slate-400" />
            Estructura de Costos del Tour
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Total Fijos: {formatCurrency(simulation.totalFixedCosts)} • Total Var/Pax: {formatCurrency(simulation.totalVariablePaxCosts / paxCount)}
          </span>
        </div>

        {/* Proveedores del Itinerario Sugeridos para importar */}
        {suggestedProviders.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Aliados vinculados en el Itinerario (Paso 2):
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedProviders.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => importSuggested(sp)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 border border-slate-700 transition-all"
                >
                  <Plus className="w-3 h-3 text-emerald-400" />
                  <span>{sp.commercialName} ({formatCurrency(sp.amount)})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabla de Costos Actuales */}
        <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
          {costs.map((cost, idx) => (
            <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    cost.costType === "FIXED_DEPARTURE"
                      ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  }`}
                >
                  {cost.costType === "FIXED_DEPARTURE" ? "FIJO" : "POR PERSONA"}
                </span>
                <span className="text-slate-200 font-medium">{cost.concept}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-white">{formatCurrency(cost.amount)}</span>
                <button
                  onClick={() => removeCost(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Formulario Rápido para añadir costo adicional */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Concepto del Costo</label>
            <input
              type="text"
              placeholder="ej. Parqueadero van / Hidratación"
              value={newConcept}
              onChange={(e) => setNewConcept(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tipo</label>
            <select
              value={newCostType}
              onChange={(e) => setNewCostType(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="FIXED_DEPARTURE">Fijo por Salida</option>
              <option value="VARIABLE_PAX">Por Persona</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Monto (COP)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="ej. 45000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="button"
                onClick={addCost}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
