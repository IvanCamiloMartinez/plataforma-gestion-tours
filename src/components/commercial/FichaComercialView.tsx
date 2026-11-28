"use client";

import { useState } from "react";
import { Printer, Share2, Phone, MapPin, Clock, Shield, Award, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface PublicTourData {
  id: string;
  title: string;
  destination: string;
  difficulty: string;
  durationHours: number;
  meetingPoint: string;
  summary?: string | null;
  suggestedPricePax?: number | null;
  referenceTrmUsd?: number | null;
  organization: {
    commercialName: string;
    phone: string;
    rntNumber?: string | null;
    planType: string;
  };
  leadGuide?: {
    fullName: string;
    professionalCard?: string | null;
  };
  itineraryBlocks: {
    orderIndex: number;
    startTime: string;
    title: string;
    description?: string | null;
    durationMinutes: number;
  }[];
}

export default function FichaComercialView({ tour }: { tour: PublicTourData }) {
  const [currency, setCurrency] = useState<"COP" | "USD">("COP");
  const trm = tour.referenceTrmUsd || 4000; // TRM referencial por defecto

  const priceCop = tour.suggestedPricePax || 120000;
  const priceUsd = Math.round(priceCop / trm);

  const isWhiteLabel = tour.organization.planType !== "RASTRILLO";

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = encodeURIComponent(
      `¡Hola! Te comparto la información oficial del tour "${tour.title}" en ${tour.destination}:\n${url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Barra de Controles (Oculta en la Impresión) */}
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/tours"
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold block">PASO 4: FICHA COMERCIAL</span>
            <h1 className="text-sm font-bold text-white">Vista Previa e Impresión</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Selector de Moneda */}
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setCurrency("COP")}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                currency === "COP" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              COP
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                currency === "USD" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              USD Ref.
            </button>
          </div>

          {/* Botón WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartir Ruta
          </button>

          {/* Botón Imprimir / PDF */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir en 1 Clic (PDF)
          </button>
        </div>
      </div>

      {/* LA FICHA IMPRIMIBLE (Optimizada para pantalla y @media print) */}
      <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 max-w-4xl mx-auto">
        {/* Cabecera del Tour */}
        <div className="border-b border-slate-200 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {tour.organization.commercialName}
            </span>

            {/* Acreditación Profesional del Guía si la tiene */}
            {tour.leadGuide?.professionalCard && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                Guía Profesional Certificado — T.P. No. {tour.leadGuide.professionalCard}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            {tour.title}
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
            {tour.summary || "Una experiencia inmersiva diseñada con los más altos estándares de calidad y patrimonio local."}
          </p>

          {/* Metadatos Rápidos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Destino / Ciudad:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {tour.destination}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Duración Estimada:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                {tour.durationHours} horas
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Dificultad:</span>
              <span className="font-bold text-slate-800">{tour.difficulty}</span>
            </div>

            <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
              <span className="text-emerald-800 text-[10px] uppercase font-bold block">Tarifa Oficial</span>
              <span className="text-xl font-black font-mono text-emerald-950">
                {currency === "COP" ? formatCurrency(priceCop) : `$${priceUsd} USD`}
              </span>
              <span className="text-[10px] text-emerald-700 block">por participante</span>
            </div>
          </div>

          {currency === "USD" && (
            <p className="text-[11px] text-slate-500 italic mt-2">
              * Tarifa oficial liquidada en pesos colombianos (COP: {formatCurrency(priceCop)}). El valor en USD es
              puramente referencial a una TRM de {formatCurrency(trm)} y está sujeto a la tasa de cambio del día de pago.
            </p>
          )}
        </div>

        {/* Punto de Encuentro y Recomendaciones */}
        <div className="mb-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Punto de Encuentro Oficial
          </span>
          <p className="text-sm font-semibold text-slate-900">{tour.meetingPoint}</p>
        </div>

        {/* Secuencia del Itinerario (Capa Comercial Pública) */}
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
            Itinerario del Recorrido
          </h2>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
            {tour.itineraryBlocks.map((block, idx) => (
              <div key={idx} className="relative flex items-start gap-4 pl-8">
                {/* Indicador de Línea de Tiempo */}
                <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-sm flex-shrink-0" />

                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-sm">{block.title}</h3>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                      {block.startTime} • {block.durationMinutes} min
                    </span>
                  </div>

                  {block.description && (
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {block.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qué Incluye / Qué No Incluye */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pt-4 border-t border-slate-200 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Qué Incluye la Experiencia
            </h3>
            <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
              <li>Guianza profesional especializada y guión cultural exclusivo.</li>
              <li>Póliza de asistencia médica en viaje durante toda la ruta.</li>
              <li>Entradas y degustaciones según el itinerario detallado.</li>
              <li>Acompañamiento permanente y logística de campo.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-sm">
              <XCircle className="w-4 h-4 text-slate-400" />
              Qué No Incluye
            </h3>
            <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
              <li>Gastos o consumos personales no especificados.</li>
              <li>Transporte de ida y regreso al punto de encuentro.</li>
              <li>Propinas voluntarias a aliados y campesinos locales.</li>
            </ul>
          </div>
        </div>

        {/* Pie de Página Legal y Contacto (Con White-Label en Planes Pagos) */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-800">{tour.organization.commercialName}</p>
            <p>
              Celular de Contacto: <strong className="text-slate-700">{tour.organization.phone}</strong>
            </p>
            {tour.organization.rntNumber && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                Registro Nacional de Turismo: RNT No. {tour.organization.rntNumber} • Cumplimiento Ley 2068 de 2020
              </p>
            )}
            <p className="text-[10px] text-slate-400 mt-1">
              Comprometidos contra la explotación sexual y comercial de niños, niñas y adolescentes (Ley 679 de 2001).
            </p>
          </div>

          {/* Sello de Marca de la Plataforma (Se oculta en Plan Guía White-Label) */}
          <div className="text-right sm:text-right">
            {!isWhiteLabel ? (
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200 block">
                Generado con Plataforma Gestor de Tours
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium italic block">
                Ficha Oficial Verificada
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
