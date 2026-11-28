import prisma from "@/lib/prisma";
import DisenadorTourView from "@/components/tours/DisenadorTourView";
import { getTourWithFullItinerary } from "@/actions/tours";
import { Suspense } from "react";

const DEFAULT_ORG_ID = "org_demo_bogota_nativa";

async function NuevoTourContent() {
  let providers: any[] = [];

  try {
    providers = await prisma.provider.findMany({
      where: { organizationId: DEFAULT_ORG_ID, deletedAt: null },
      select: { id: true, commercialName: true, category: true },
      orderBy: { commercialName: "asc" },
    });
  } catch (err) {
    console.warn("Base de datos no disponible durante el build.");
  }

  return <DisenadorTourView providers={providers} />;
}

export default function NuevoTourPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Cargando diseñador de itinerarios...</div>}>
      <NuevoTourContent />
    </Suspense>
  );
}
