"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Clock, MapPin, Eye, BookOpen, Lock, ChevronDown, ChevronUp, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { recalculateTimelineCascade } from "@/lib/math/timeline";
import { createOrUpdateTour } from "@/actions/tours";
import { useRouter } from "next/navigation";

interface ProviderOption {
  id: string;
  commercialName: string;
  category: string;
}

interface BlockState {
  id?: string;
  title: string;
  durationMinutes: number;
  descriptionPublic: string;
  narrativeScript: string;
  icebreakers: string;
  providerId?: string;
  operationalNotes: string;
  cashNotes: string;
  activeLayer: "COMERCIAL" | "GUION" | "OPERATIVA";
  isExpanded: boolean;
}

export default function DisenadorTourView({
  providers,
  initialTour,
}: {
  providers: ProviderOption[];
  initialTour?: any;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Datos Generales del Tour
  const [title, setTitle] = useState(initialTour?.title || "");
  const [startTimeDefault, setStartTimeDefault] = useState("08:00");
  const [difficulty, setDifficulty] = useState<"BAJA" | "MEDIA" | "ALTA" | "EXPERTO">(
    initialTour?.difficulty || "BAJA"
  );
  const [city, setCity] = useState(initialTour?.destination || "Bogotá");
  const [meetingPoint, setMeetingPoint] = useState(
    initialTour?.recommendations?.replace("Punto de encuentro: ", "") || "Plaza de Bolívar"
  );
  const [summary, setSummary] = useState(initialTour?.commercialSummary || "");

  // Bloques de Itinerario
  const [blocks, setBlocks] = useState<BlockState[]>(
    initialTour?.itineraryBlocks?.map((b: any) => ({
      id: b.id,
      title: b.commercialTitle,
      durationMinutes: b.durationMinutes,
      descriptionPublic: b.commercialDesc || "",
      narrativeScript: b.customStorytelling || "",
      icebreakers: b.icebreakerPrompt || "",
      providerId: b.providerId || "",
      operationalNotes: b.privateLogisticsNotes || "",
      cashNotes: "",
      activeLayer: "COMERCIAL",
      isExpanded: false,
    })) || [
      {
        title: "Punto de Encuentro y Bienvenida",
        durationMinutes: 30,
        descriptionPublic: "Recepción de viajeros, verificación de asistencia y bienvenida sensorial.",
        narrativeScript: "Pregunta detonante: ¿Cuál fue la primera bebida fermentada que probaron en su vida?",
        icebreakers: "¿Sabían que la chicha estuvo prohibida por ley para promover la cerveza industrial?",
        operationalNotes: "Verificar documento de identidad y póliza médica de cada participante.",
        cashNotes: "",
        activeLayer: "COMERCIAL",
        isExpanded: true,
      },
    ]
  );

  // Recálculo automático en cascada (Ley de Tesler)
  const timelineBlocks = recalculateTimelineCascade(blocks, startTimeDefault);
  const totalMinutes = blocks.reduce((acc, b) => acc + b.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const addBlock = () => {
    setBlocks([
      ...blocks,
      {
        title: `Hito ${blocks.length + 1}: Nueva Experiencia`,
        durationMinutes: 45,
        descriptionPublic: "",
        narrativeScript: "",
        icebreakers: "",
        providerId: "",
        operationalNotes: "",
        cashNotes: "",
        activeLayer: "COMERCIAL",
        isExpanded: true,
      },
    ]);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, field: keyof BlockState, value: any) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], [field]: value };
    setBlocks(updated);
  };

  const handleSave = () => {
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg("El tour debe tener un título comercial.");
      return;
    }

    if (blocks.length === 0) {
      setErrorMsg("Debes agregar al menos una parada al itinerario.");
      return;
    }

    startTransition(async () => {
      const res = await createOrUpdateTour(
        {
          title,
          startTimeDefault,
          difficulty,
          city,
          meetingPoint,
          summary,
          blocks: blocks.map((b) => ({
            title: b.title,
            durationMinutes: b.durationMinutes,
            descriptionPublic: b.descriptionPublic,
            narrativeScript: b.narrativeScript,
            icebreakers: b.icebreakers,
            providerId: b.providerId || undefined,
            operationalNotes: b.operationalNotes,
            cashNotes: b.cashNotes,
          })),
        },
        initialTour?.id
      );

      if (res.success) {
        router.push("/tours");
      } else {
        setErrorMsg(res.error || "Error al guardar el itinerario");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Barra Superior */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/tours"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Diseñador de Itinerarios (3 Capas)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Paso 2 del Core Loop: recálculo automático de horarios en cascada y guión interpretativo.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Guardando..." : "Guardar Itinerario"}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Ficha General del Tour */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Comercial del Tour *</label>
            <input
              type="text"
              placeholder="ej. Bogotá Ancestral: Chicha, Café y Memoria Muisca"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hora de Inicio Oficial</label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <input
                type="time"
                value={startTimeDefault}
                onChange={(e) => setStartTimeDefault(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Punto de Encuentro *</label>
            <input
              type="text"
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              placeholder="ej. Plazoleta del Chorro de Quevedo"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dificultad</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="BAJA">Baja (Paseo Urbano)</option>
              <option value="MEDIA">Media (Caminata moderada)</option>
              <option value="ALTA">Alta (Montaña / Sendero)</option>
              <option value="EXPERTO">Experto (Alta montaña)</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Duración Estimada:</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {totalHours} horas ({totalMinutes} min)
            </span>
          </div>
        </div>
      </div>

      {/* Línea de Tiempo de Hitos (3 Capas) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Secuencia de Hitos del Itinerario</span>
            <span className="text-xs font-normal text-slate-400">({blocks.length} paradas)</span>
          </h3>

          <button
            onClick={addBlock}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Parada
          </button>
        </div>

        <div className="space-y-4">
          {timelineBlocks.map((item, index) => {
            const block = item.data;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all shadow-sm"
              >
                {/* Cabecera del Hito con Horario Calculado */}
                <div className="p-4 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                      <Clock className="w-3.5 h-3.5" />
                      {item.startTime} - {item.endTime}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Parada #{index + 1}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400">Duración:</span>
                      <input
                        type="number"
                        min="5"
                        step="5"
                        value={block.durationMinutes}
                        onChange={(e) =>
                          updateBlock(index, "durationMinutes", parseInt(e.target.value, 10) || 5)
                        }
                        className="w-12 text-center bg-transparent text-white font-mono text-xs font-bold focus:outline-none"
                      />
                      <span className="text-xs text-slate-500">min</span>
                    </div>

                    <button
                      onClick={() => updateBlock(index, "isExpanded", !block.isExpanded)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      {block.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {blocks.length > 1 && (
                      <button
                        onClick={() => removeBlock(index)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Contenido Expandido del Hito */}
                {block.isExpanded && (
                  <div className="p-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Hito *</label>
                      <input
                        type="text"
                        value={block.title}
                        onChange={(e) => updateBlock(index, "title", e.target.value)}
                        placeholder="ej. Cata de Café y Métodos de Filtrado Ancestral"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Selector de las 3 Capas */}
                    <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => updateBlock(index, "activeLayer", "COMERCIAL")}
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all ${
                          block.activeLayer === "COMERCIAL"
                            ? "bg-slate-800 text-emerald-400 shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        1. Capa Comercial (Pública)
                      </button>

                      <button
                        type="button"
                        onClick={() => updateBlock(index, "activeLayer", "GUION")}
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all ${
                          block.activeLayer === "GUION"
                            ? "bg-slate-800 text-purple-400 shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        2. Capa Interpretativa (Guía)
                      </button>

                      <button
                        type="button"
                        onClick={() => updateBlock(index, "activeLayer", "OPERATIVA")}
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all ${
                          block.activeLayer === "OPERATIVA"
                            ? "bg-slate-800 text-amber-400 shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        3. Capa Operativa (Privada)
                      </button>
                    </div>

                    {/* Contenido Capa 1: Comercial */}
                    {block.activeLayer === "COMERCIAL" && (
                      <div className="space-y-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
                        <p className="text-xs text-slate-400">
                          ℹ️ Esta información es visible para el turista en la cotización web y en la ficha PDF.
                        </p>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Descripción Sensorial y Promesa de Valor
                          </label>
                          <textarea
                            rows={3}
                            value={block.descriptionPublic}
                            onChange={(e) => updateBlock(index, "descriptionPublic", e.target.value)}
                            placeholder="Qué vivirá el turista: aromas, vistas, degustaciones y promesas..."
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Contenido Capa 2: Interpretativa (Guión) */}
                    {block.activeLayer === "GUION" && (
                      <div className="space-y-3 p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
                        <p className="text-xs text-purple-300">
                          🔒 Exclusivo para el Guía y la Agencia. Tu activo intelectual: qué narrar y cómo romper el hielo.
                        </p>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Guión Cultural / Hitos Históricos
                          </label>
                          <textarea
                            rows={3}
                            value={block.narrativeScript}
                            onChange={(e) => updateBlock(index, "narrativeScript", e.target.value)}
                            placeholder="Anécdotas del lugar, personajes históricos, mitos muiscas..."
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Pregunta Detonante / Rompehielos en Ruta
                          </label>
                          <input
                            type="text"
                            value={block.icebreakers}
                            onChange={(e) => updateBlock(index, "icebreakers", e.target.value)}
                            placeholder="Pregunta para activar al grupo..."
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Contenido Capa 3: Operativa */}
                    {block.activeLayer === "OPERATIVA" && (
                      <div className="space-y-3 p-4 rounded-xl bg-amber-950/20 border border-amber-900/30">
                        <p className="text-xs text-amber-300">
                          🤫 Logística confidencial: vinculación de aliados del Directorio y pagos de caja menor.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Aliado Vinculado (Directorio Paso 1)
                            </label>
                            <select
                              value={block.providerId || ""}
                              onChange={(e) => updateBlock(index, "providerId", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                            >
                              <option value="">-- Sin proveedor vinculado --</option>
                              {providers.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.commercialName} ({p.category})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Instrucciones de Caja / Pagos en Campo
                            </label>
                            <input
                              type="text"
                              value={block.operationalNotes}
                              onChange={(e) => updateBlock(index, "operationalNotes", e.target.value)}
                              placeholder="ej. Pagar $30.000 en efectivo al llegar"
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
