import { getToursList } from "@/actions/tours";
import NuevaSalidaView from "@/components/departures/NuevaSalidaView";
import { Suspense } from "react";

async function NuevaSalidaContent() {
  let tours: any[] = [];

  try {
    tours = await getToursList();
  } catch (err) {
    console.warn("Base de datos no disponible durante el build.");
  }

  const formattedTours = tours.map((t) => ({
    id: t.id,
    title: t.title,
    maxPax: t.maxPax || 12,
  }));

  return <NuevaSalidaView tours={formattedTours} />;
}

export default function NuevaSalidaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Cargando tours...</div>}>
      <NuevaSalidaContent />
    </Suspense>
  );
}
