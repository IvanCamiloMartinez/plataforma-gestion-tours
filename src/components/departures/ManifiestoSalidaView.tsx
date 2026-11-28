"use client";

import { useState, useTransition } from "react";
import { Users, UserPlus, ShieldAlert, CheckCircle2, Phone, Calendar, ArrowLeft, DollarSign, CloudRain, AlertTriangle, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { addPassengerToDeparture, closeDepartureCheckout, rescheduleDeparture } from "@/actions/departures";

export default function ManifiestoSalidaView({ departure }: { departure: any }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Formulario Fast-Entry de Pasajero
  const [fullName, setFullName] = useState("");
  const [docType, setDocType] = useState<"CC" | "CE" | "PAS" | "PPT" | "TI">("CC");
  const [documentNumber, setDocumentNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"PENDIENTE" | "ANTICIPO" | "PAGADO_TOTAL">("ANTICIPO");
  const [habeasData, setHabeasData] = useState(true);

  // Modal de Reprogramación
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState("");

  const unitPrice = departure.tour?.suggestedPricePax ? Number(departure.tour.suggestedPricePax) : 120000;
  const initialPaid = paymentStatus === "PAGADO_TOTAL" ? unitPrice : paymentStatus === "ANTICIPO" ? unitPrice * 0.5 : 0;

  const passengers = departure.passengers || [];
  const occupiedSlots = passengers.length;
  const totalCapacity = departure.maxCapacity;

  // Cálculos reactivos de caja menor en punto de encuentro
  const totalRevenueProjected = passengers.reduce((acc: number, p: any) => acc + Number(p.totalPrice), 0);
  const totalPaidSoFar = passengers.reduce((acc: number, p: any) => acc + Number(p.paidAmount), 0);
  const pendingToCollectAtMeeting = passengers.reduce((acc: number, p: any) => acc + Number(p.pendingBalance), 0);

  const isCompleted = departure.status === "COMPLETADA";

  const handleAddPassenger = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!habeasData) {
      setErrorMsg("Es obligatorio certificar el consentimiento de Habeas Data (Ley 1581 de 2012).");
      return;
    }

    startTransition(async () => {
      const res = await addPassengerToDeparture(departure.id, {
        fullName,
        docType,
        documentNumber,
        phone,
        emergencyContactName,
        emergencyContactPhone,
        medicalNotes: medicalNotes || undefined,
        paymentStatus,
        totalPrice: unitPrice,
        paidAmount: initialPaid,
      });

      if (res.success) {
        setSuccessMsg("¡Pasajero registrado en el manifiesto exitosamente!");
        setFullName("");
        setDocumentNumber("");
        setPhone("");
        setEmergencyContactName("");
        setEmergencyContactPhone("");
        setMedicalNotes("");
      } else {
        setErrorMsg(res.error || "Error al agregar pasajero");
      }
    });
  };

  const handleCloseCheckout = () => {
    if (!confirm("¿Confirmas que la salida ha finalizado y deseas generar el Cierre de Caja definitivo?")) return;

    startTransition(async () => {
      const res = await closeDepartureCheckout(departure.id);
      if (res.success && res.netProfit !== undefined) {
        setSuccessMsg(`¡Cierre de caja generado! Utilidad neta real: ${formatCurrency(res.netProfit)}`);
      } else {
        setErrorMsg(res.error || "Error al cerrar caja");
      }
    });
  };

  const handleReschedule = () => {
    if (!newDate) return;

    startTransition(async () => {
      const res = await rescheduleDeparture(departure.id, newDate);
      if (res.success) {
        setIsRescheduleOpen(false);
        setSuccessMsg("Salida reprogramada con éxito. Ya puedes notificar a los pasajeros.");
      } else {
        setErrorMsg(res.error || "Error al reprogramar");
      }
    });
  };

  const handleNotifyRescheduleWhatsApp = () => {
    const formattedDate = new Date(departure.departureDate).toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const msg = encodeURIComponent(
      `Estimado(a) viajero(a) del tour "${departure.tour?.title}". Por motivos de fuerza mayor/clima hemos reprogramado nuestra salida oficial para el ${formattedDate}. Tu cupo y anticipo se conservan intactos. Si tienes alguna duda, escríbenos directamente por aquí.`
    );

    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/salidas"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold block">PASO 5: OPERACIÓN DE CAMPO</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  departure.status === "COMPLETADA"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : departure.status === "REPROGRAMADA"
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                }`}
              >
                {departure.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-0.5">{departure.tour?.title}</h1>
            <p className="text-xs text-slate-400">
              Fecha: {new Date(departure.departureDate).toLocaleDateString("es-CO")} • Aforo: {occupiedSlots}/{totalCapacity} pasajeros
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón de Reprogramación por Clima / Fuerza Mayor */}
          <button
            onClick={() => setIsRescheduleOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30"
          >
            <CloudRain className="w-4 h-4" />
            Reprogramar Salida
          </button>

          {/* Botón Cierre de Caja */}
          {!isCompleted ? (
            <button
              onClick={handleCloseCheckout}
              disabled={isPending || occupiedSlots === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              <DollarSign className="w-4 h-4" />
              Cierre de Caja
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              Utilidad: {formatCurrency(Number(departure.netProfit))}
            </div>
          )}
        </div>
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

      {/* BALANCE EN TIEMPO REAL / CAJA MENOR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">RECAUDADO HASTA HOY</span>
          <span className="text-2xl font-black font-mono text-white">
            {formatCurrency(totalPaidSoFar)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">De {formatCurrency(totalRevenueProjected)} proyectado</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30">
          <span className="text-[11px] font-semibold text-amber-400 block mb-1">POR COBRAR EN PUNTO DE ENCUENTRO</span>
          <span className="text-2xl font-black font-mono text-amber-300">
            {formatCurrency(pendingToCollectAtMeeting)}
          </span>
          <span className="text-[10px] text-amber-500 block mt-1">En efectivo o Nequi al llegar</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30">
          <span className="text-[11px] font-semibold text-emerald-400 block mb-1">CUPOS DISPONIBLES</span>
          <span className="text-2xl font-black font-mono text-emerald-400">
            {totalCapacity - occupiedSlots} cupos
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Aforo máximo: {totalCapacity}</span>
        </div>
      </div>

      {/* MODAL / POPUP DE REPROGRAMACIÓN */}
      {isRescheduleOpen && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Reprogramar Salida por Clima / Fuerza Mayor
            </h4>
            <button onClick={() => setIsRescheduleOpen(false)} className="text-slate-400 text-xs hover:text-white">
              Cerrar
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Mover la fecha conservará intactos los pasajeros y el manifiesto. Podrás notificar a todos vía WhatsApp oficial.
          </p>
          <div className="flex gap-2 items-center">
            <input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleReschedule}
              disabled={isPending || !newDate}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
            >
              Confirmar Nueva Fecha
            </button>
            <button
              onClick={handleNotifyRescheduleWhatsApp}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              Avisar por WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* TABLA DEL MANIFIESTO DE PASAJEROS (ESTÁNDAR DE SEGUROS) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Manifiesto Oficial de Pasajeros
            <span className="text-xs font-normal text-slate-400 font-mono">({passengers.length} viajeros)</span>
          </h3>

          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            Válido para emisión de póliza de asistencia médica
          </span>
        </div>

        {passengers.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No hay pasajeros registrados aún. Utiliza el formulario rápido de abajo para ingresar los cupos confirmados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Nombre Completo</th>
                  <th className="py-2 px-3">Documento</th>
                  <th className="py-2 px-3">Teléfono</th>
                  <th className="py-2 px-3">Contacto Emergencia</th>
                  <th className="py-2 px-3">Alertas Médicas</th>
                  <th className="py-2 px-3">Estado Pago</th>
                  <th className="py-2 px-3 text-right">Saldo Pendiente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {passengers.map((p: any, idx: number) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{p.fullName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      {p.docType} {p.documentNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{p.phone}</td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {p.emergencyContactName} ({p.emergencyContactPhone})
                    </td>
                    <td className="py-2.5 px-3 text-rose-300 font-medium">
                      {p.medicalNotes || "Ninguna"}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.paymentStatus === "PAGADO_TOTAL"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : p.paymentStatus === "ANTICIPO"
                            ? "bg-amber-500/10 text-amber-300"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                      {formatCurrency(Number(p.pendingBalance))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FORMULARIO FAST-ENTRY (Carga en Lote en 1 Minuto) */}
        {!isCompleted && occupiedSlots < totalCapacity && (
          <form onSubmit={handleAddPassenger} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 mt-4">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              Ingreso Rápido de Pasajero (Fast-Entry)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Nombre y Apellidos del Viajero *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="CC">Cédula (CC)</option>
                  <option value="CE">Cédula Extranjería (CE)</option>
                  <option value="PAS">Pasaporte (PAS)</option>
                  <option value="PPT">Permiso Temporal (PPT)</option>
                  <option value="TI">Tarjeta Identidad (TI)</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder="No. Documento *"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Celular del Viajero *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Contacto Emergencia (Nombre) *"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Teléfono Emergencia *"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="ANTICIPO">Anticipo 50% ({formatCurrency(unitPrice * 0.5)})</option>
                  <option value="PAGADO_TOTAL">Pagado Total ({formatCurrency(unitPrice)})</option>
                  <option value="PENDIENTE">Pago Pendiente</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="habeasData"
                  checked={habeasData}
                  onChange={(e) => setHabeasData(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="habeasData" className="text-[11px] text-slate-400">
                  Certifico autorización de datos personales para la póliza de asistencia médica (Ley 1581 de 2012).
                </label>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                {isPending ? "Añadiendo..." : "Registrar Pasajero"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
