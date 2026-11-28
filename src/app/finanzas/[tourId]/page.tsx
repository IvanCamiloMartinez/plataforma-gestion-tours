import { notFound } from "next/navigation";
import { getTourWithCosts } from "@/actions/finance";
import CalculadoraFinancieraView from "@/components/finance/CalculadoraFinancieraView";
import { Suspense } from "react";

async function FinanzasContent({ tourId }: { tourId: string }) {
  let tour: any = null;

  try {
    tour = await getTourWithCosts(tourId);
  } catch (err) {
    console.warn("Base de datos no disponible durante el build.");
  }

  if (!tour) {
    // Si no encuentra el tour o la DB no está arriba, creamos un mock seguro
    tour = {
      id: tourId,
      title: "Tour Demostración",
      maxPax: 8,
      targetMarginPercent: 35,
      costItems: [],
      itineraryBlocks: [],
    };
  }

  // Extraer proveedores que tengan tarifas para sugerir importación
  const suggestedProviders: any[] = [];
  for (const block of tour.itineraryBlocks || []) {
    if (block.provider && block.provider.tariffs?.length > 0) {
      const tariff = block.provider.tariffs[0];
      suggestedProviders.push({
        id: block.provider.id,
        commercialName: block.provider.commercialName,
        concept: tariff.concept,
        costType: tariff.costType,
        amount: Number(tariff.amount),
      });
    }
  }

  return <CalculadoraFinancieraView tour={tour} suggestedProviders={suggestedProviders} />;
}

export default async function FinanzasTourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Cargando motor financiero...</div>}>
      <FinanzasContent tourId={tourId} />
    </Suspense>
  );
}
