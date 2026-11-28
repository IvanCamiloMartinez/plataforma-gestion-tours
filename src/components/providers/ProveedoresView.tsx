"use client";

import { useState, useTransition } from "react";
import { Plus, X, Bus, Utensils, Ticket, ShieldCheck, Phone, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { createProvider } from "@/actions/providers";

export type ProviderCategory = "TRANSPORTE" | "ALIMENTACION" | "ACTIVIDAD_EXPERIENCIA" | "SEGUROS";
export type CostType = "FIXED_DEPARTURE" | "VARIABLE_PAX";

export interface ProviderItem {
  id: string;
  commercialName: string;
  contactPerson?: string | null;
  phone: string;
  category: ProviderCategory;
  costType: CostType;
  baseRate: number;
  notesPrivate?: string | null;
}

const CATEGORIES: { id: ProviderCategory; label: string; icon: any; maxLimit: number }[] = [
  { id: "TRANSPORTE", label: "Transporte", icon: Bus, maxLimit: 5 },
  { id: "ALIMENTACION", label: "Alimentación", icon: Utensils, maxLimit: 5 },
  { id: "ACTIVIDAD_EXPERIENCIA", label: "Actividades / Catas", icon: Ticket, maxLimit: 5 },
  { id: "SEGUROS", label: "Seguros Médicos", icon: ShieldCheck, maxLimit: 5 },
];

export default function ProveedoresView({ initialProviders }: { initialProviders: ProviderItem[] }) {
  const [activeTab, setActiveTab] = useState<ProviderCategory>("TRANSPORTE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [commercialName, setCommercialName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [costType, setCostType] = useState<CostType>("FIXED_DEPARTURE");
  const [baseRate, setBaseRate] = useState("");
  const [notesPrivate, setNotesPrivate] = useState("");

  const filteredProviders = initialProviders.filter((p) => p.category === activeTab);
  const currentCategoryMeta = CATEGORIES.find((c) => c.id === activeTab)!;
  const isQuotaFull = filteredProviders.length >= currentCategoryMeta.maxLimit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const rateNumeric = parseFloat(baseRate);
    if (isNaN(rateNumeric) || rateNumeric <= 0) {
      setErrorMsg("Por favor ingresa una tarifa válida mayor a 0");
      return;
    }

    startTransition(async () => {
      const res = await createProvider({
        commercialName,
        contactPerson: contactPerson || undefined,
        phone,
        category: activeTab,
        concept: "Tarifa estándar",
        costType,
        baseRate: rateNumeric,
        currency: "COP",
        notesPrivate: notesPrivate || undefined,
      });

      if (res.success) {
        setCommercialName("");
        setContactPerson("");
        setPhone("");
        setBaseRate("");
        setNotesPrivate("");
        setIsModalOpen(false);
      } else {
        setErrorMsg(res.error || "Error al registrar proveedor");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Directorio de Aliados</h2>
          <p className="text-sm text-slate-400 mt-1">
            Paso 1 del Core Loop: tarifas unitarias estandarizadas para el costeo de tus tours.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isQuotaFull}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Nuevo Aliado
        </button>
      </div>

      {/* Pestañas de Categoría */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = initialProviders.filter((p) => p.category === cat.id).length;
          const isActive = activeTab === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{cat.label}</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  count >= cat.maxLimit
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {count}/{cat.maxLimit}
              </span>
            </button>
          );
        })}
      </div>

      {/* Alerta de Límite Freemium */}
      {isQuotaFull && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>
              Has alcanzado el límite de <strong>5 proveedores</strong> en esta categoría para el <strong>Plan Rastrillo</strong>.
            </span>
          </div>
          <span className="text-xs bg-amber-500/20 px-3 py-1 rounded-md font-semibold">
            Prueba Plan Guía (Hasta 15)
          </span>
        </div>
      )}

      {/* Listado de Proveedores */}
      {filteredProviders.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <currentCategoryMeta.icon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No hay proveedores en {currentCategoryMeta.label}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Registra tu primer aliado en menos de 2 minutos para poder asignarlo a tus rutas y calcular tus costos.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Aliado
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-white text-base leading-snug">{provider.commercialName}</h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono font-medium">
                    {provider.costType === "FIXED_DEPARTURE" ? "Fijo / Salida" : "Por Persona"}
                  </span>
                </div>

                {provider.contactPerson && (
                  <p className="text-xs text-slate-400 mb-1">Contacto: {provider.contactPerson}</p>
                )}

                <p className="text-lg font-bold text-slate-100 font-mono mt-3">
                  {formatCurrency(provider.baseRate)}
                  <span className="text-xs text-slate-400 font-sans font-normal ml-1">
                    {provider.costType === "FIXED_DEPARTURE" ? "/ grupo" : "/ pax"}
                  </span>
                </p>

                {provider.notesPrivate && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">“{provider.notesPrivate}”</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`https://wa.me/${provider.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {provider.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Formulario Rápido (Fast-Add) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Nuevo Aliado de {currentCategoryMeta.label}</h3>
            <p className="text-xs text-slate-400 mb-5">
              Registro asistido en 2 minutos para el costeo de salidas.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre Comercial del Aliado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Transportes La Sabana / Restaurante El Mirador"
                  value={commercialName}
                  onChange={(e) => setCommercialName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Don Pedro"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Celular / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. +573101234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tipo de Tarifa *
                  </label>
                  <select
                    value={costType}
                    onChange={(e) => setCostType(e.target.value as CostType)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="FIXED_DEPARTURE">Fijo por Salida (Van, Guía)</option>
                    <option value="VARIABLE_PAX">Por Persona (Almuerzo, Seguro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tarifa Base Oficial (COP) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="ej. 350000"
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notas de Operación (Privado)
                </label>
                <textarea
                  rows={2}
                  placeholder="ej. Incluye peajes; confirmar con 24h de anticipación; recibe Nequi."
                  value={notesPrivate}
                  onChange={(e) => setNotesPrivate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold text-xs transition-all shadow-md"
                >
                  {isPending ? "Guardando..." : "Guardar Aliado"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
