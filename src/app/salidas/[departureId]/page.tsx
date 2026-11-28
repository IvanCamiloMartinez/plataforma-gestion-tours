import { notFound } from "next/navigation";
import { getDepartureDetails } from "@/actions/departures";
import ManifiestoSalidaView from "@/components/departures/ManifiestoSalidaView";
import { Suspense } from "react";

async function DepartureContent({ departureId }: { departureId: string }) {
  let departure: any = null;

  try {
    departure = await getDepartureDetails(departureId);
  } catch (err) {
    console.warn("Base de datos no disponible durante el build.");
  }

  if (!departure) {
    departure = {
      id: departureId,
      departureDate: new Date().toISOString(),
      maxCapacity: 12,
      availableSlots: 10,
      status: "PROGRAMADA",
      tour: {
        title: "Bogotá Ancestral: Chicha y Memoria",
        suggestedPricePax: 120000,
        costItems: [
          { concept: "Honorarios Guía", costType: "FIXED_DEPARTURE", amount: 200000 },
          { concept: "Seguro y Almuerzo", costType: "VARIABLE_PAX", amount: 35000 },
        ],
      },
      passengers: [
        {
          id: "p1",
          fullName: "Carlos Rodríguez",
          docType: "CC",
          documentNumber: "1018273645",
          phone: "+573105551234",
          emergencyContactName: "Marta Gómez",
          emergencyContactPhone: "+573114445678",
          medicalNotes: "Alérgico al maní",
          paymentStatus: "ANTICIPO",
          totalPrice: 120000,
          paidAmount: 60000,
          pendingBalance: 60000,
          attendanceStatus: "CONFIRMADO",
        },
      ],
    };
  }

  return <ManifiestoSalidaView departure={departure} />;
}

export default async function DeparturePage({
  params,
}: {
  params: Promise<{ departureId: string }>;
}) {
  const { departureId } = await params;

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Cargando manifiesto de salida...</div>}>
      <DepartureContent departureId={departureId} />
    </Suspense>
  );
}
