import { Suspense } from "react";
import { getProvidersWithTariffs } from "@/actions/providers";
import ProveedoresView, { ProviderItem, ProviderCategory, CostType } from "@/components/providers/ProveedoresView";

async function ProveedoresContent() {
  let providers: Awaited<ReturnType<typeof getProvidersWithTariffs>> = [];

  try {
    providers = await getProvidersWithTariffs();
  } catch (error) {
    // Si la base de datos aún no está levantada en build, mostramos lista vacía
    console.warn("Base de datos no disponible durante el build estático. Mostrando estado base.");
  }

  const formattedProviders: ProviderItem[] = providers.map((p) => {
    const latestTariff = p.tariffs[0];
    return {
      id: p.id,
      commercialName: p.commercialName,
      contactPerson: p.contactPerson,
      phone: p.phone,
      category: p.category as ProviderCategory,
      costType: (latestTariff?.costType as CostType) || "FIXED_DEPARTURE",
      baseRate: latestTariff ? Number(latestTariff.amount) : 0,
      notesPrivate: p.notesPrivate,
    };
  });

  return <ProveedoresView initialProviders={formattedProviders} />;
}

export default function ProveedoresPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 animate-pulse text-sm">
          Cargando directorio de aliados...
        </div>
      }
    >
      <ProveedoresContent />
    </Suspense>
  );
}
