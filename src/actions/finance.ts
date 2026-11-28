"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_ORG_ID = "org_demo_bogota_nativa";

export async function getTourWithCosts(tourId: string) {
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    include: {
      costItems: {
        include: {
          provider: true,
        },
      },
      itineraryBlocks: {
        include: {
          provider: {
            include: {
              tariffs: {
                take: 1,
                orderBy: { createdAt: "desc" },
              },
            },
          },
        },
      },
    },
  });

  return tour;
}

export async function saveTourCosts(
  tourId: string,
  costs: { concept: string; costType: "FIXED_DEPARTURE" | "VARIABLE_PAX"; amount: number; providerId?: string }[],
  targetMarginPercent: number,
  suggestedPricePax: number
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Eliminar costos anteriores para reemplazar con la nueva simulación
      await tx.costItem.deleteMany({ where: { tourId } });

      // 2. Insertar elementos de costo
      for (const cost of costs) {
        await tx.costItem.create({
          data: {
            tourId,
            concept: cost.concept,
            costType: cost.costType,
            amount: cost.amount,
            currency: "COP",
            providerId: cost.providerId || null,
          },
        });
      }

      // 3. Actualizar parámetros en el Tour
      await tx.tour.update({
        where: { id: tourId },
        data: {
          targetMarginPercent,
          suggestedPricePax,
        },
      });
    });

    revalidatePath(`/finanzas/${tourId}`);
    revalidatePath("/tours");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al guardar costos";
    return { success: false, error: errorMsg };
  }
}
