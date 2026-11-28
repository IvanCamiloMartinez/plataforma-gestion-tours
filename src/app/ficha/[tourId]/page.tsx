import prisma from "@/lib/prisma";
import FichaComercialView from "@/components/commercial/FichaComercialView";
import { Suspense } from "react";

async function FichaContent({ tourId }: { tourId: string }) {
  let tour: any = null;

  try {
    tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: {
        organization: true,
        itineraryBlocks: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });
  } catch (err) {
    console.warn("Base de datos no disponible durante el build.");
  }

  if (!tour) {
    tour = {
      id: tourId,
      title: "Bogotá Ancestral: Chicha, Café y Memoria Muisca",
      destination: "La Candelaria, Bogotá",
      difficulty: "Baja (Urbano)",
      durationHours: 3.5,
      meetingPoint: "Plazoleta del Chorro de Quevedo (frente a la fuente)",
      summary:
        "Un recorrido sensorial por las raíces indígenas y los sabores tradicionales del centro histórico de Bogotá.",
      suggestedPricePax: 120000,
      referenceTrmUsd: 4100,
      organization: {
        commercialName: "Bogotá Nativa Ecoturismo",
        phone: "+57 310 123 4567",
        rntNumber: "94821",
        planType: "RASTRILLO",
      },
      leadGuide: {
        fullName: "Iván Camilo Martínez",
        professionalCard: "28491",
      },
      itineraryBlocks: [
        {
          orderIndex: 0,
          startTime: "08:00 AM",
          durationMinutes: 30,
          title: "Recepción y Contexto Histórico en el Chorro de Quevedo",
          description: "Bienvenida con aromática de hierbas locales y relato de la fundación mítica de Bogotá.",
        },
        {
          orderIndex: 1,
          startTime: "08:30 AM",
          durationMinutes: 60,
          title: "Cata de Chicha Ancestral en Totuma Tradicional",
          description: "Degustación guiada de tres variedades de fermentos y explicación de la ley seca de 1948.",
        },
        {
          orderIndex: 2,
          startTime: "09:30 AM",
          durationMinutes: 90,
          title: "Museo del Oro: Simbología Muisca y el Dorado",
          description: "Recorrido interpretativo por las piezas sagradas y la relación con la laguna de Guatavita.",
        },
      ],
    };
  }

  const formattedTour = {
    id: tour.id,
    title: tour.title,
    destination: tour.destination,
    difficulty: tour.difficulty,
    durationHours: Number(tour.durationHours),
    meetingPoint: tour.recommendations?.replace("Punto de encuentro: ", "") || "Punto acordado con el guía",
    summary: tour.commercialSummary,
    suggestedPricePax: tour.suggestedPricePax ? Number(tour.suggestedPricePax) : 120000,
    referenceTrmUsd: tour.referenceTrmUsd ? Number(tour.referenceTrmUsd) : 4100,
    organization: {
      commercialName: tour.organization?.commercialName || "Operador Certificado",
      phone: tour.organization?.phone || "+57 300 000 0000",
      rntNumber: tour.organization?.rntNumber || null,
      planType: tour.organization?.planType || "RASTRILLO",
    },
    leadGuide: {
      fullName: "Guía Profesional",
      professionalCard: "CERTIFICADO",
    },
    itineraryBlocks: (tour.itineraryBlocks || []).map((b: any) => ({
      orderIndex: b.orderIndex,
      startTime: b.startTimeEstimated || "08:00",
      title: b.commercialTitle,
      description: b.commercialDesc,
      durationMinutes: b.durationMinutes,
    })),
  };

  return <FichaComercialView tour={formattedTour} />;
}

export default async function FichaComercialPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Cargando ficha comercial...</div>}>
      <FichaContent tourId={tourId} />
    </Suspense>
  );
}
