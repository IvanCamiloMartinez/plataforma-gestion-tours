"use server";

import prisma from "@/lib/prisma";
import { TourSchema, TourFormData } from "@/lib/validations/tour";
import { recalculateTimelineCascade } from "@/lib/math/timeline";
import { revalidatePath } from "next/cache";

const DEFAULT_ORG_ID = "org_demo_bogota_nativa";

export async function getToursList() {
  const tours = await prisma.tour.findMany({
    where: {
      organizationId: DEFAULT_ORG_ID,
      deletedAt: null,
    },
    include: {
      itineraryBlocks: {
        orderBy: { orderIndex: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return tours;
}

export async function getTourWithFullItinerary(tourId: string) {
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    include: {
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
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  return tour;
}

export async function createOrUpdateTour(data: TourFormData, tourId?: string) {
  const validated = TourSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  // Verificar cuota Plan Rastrillo (Máximo 2 tours activos)
  if (!tourId) {
    const activeCount = await prisma.tour.count({
      where: {
        organizationId: DEFAULT_ORG_ID,
        status: { in: ["BORRADOR", "PUBLICADO"] },
        deletedAt: null,
      },
    });

    if (activeCount >= 2) {
      return {
        success: false,
        error: "Has alcanzado el límite de 2 tours activos en el Plan Rastrillo. Actualiza al Plan Guía para diseñar hasta 6 tours simultáneos.",
        isQuotaExceeded: true,
      };
    }
  }

  const slug =
    data.slug ||
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  // Cálculo en cascada de horarios (Ley de Tesler)
  const calculatedBlocks = recalculateTimelineCascade(
    data.blocks.map((b, idx) => ({ ...b, orderIndex: idx })),
    data.startTimeDefault || "08:00"
  );

  const totalMinutes = calculatedBlocks.reduce((acc, b) => acc + b.durationMinutes, 0);
  const durationHours = parseFloat((totalMinutes / 60).toFixed(2));

  try {
    const savedTour = await prisma.$transaction(async (tx) => {
      let tour;

      if (tourId) {
        tour = await tx.tour.update({
          where: { id: tourId },
          data: {
            title: validated.data.title,
            slug,
            destination: validated.data.city,
            difficulty: validated.data.difficulty,
            durationHours,
            commercialSummary: validated.data.summary,
            recommendations: `Punto de encuentro: ${validated.data.meetingPoint}`,
          },
        });

        // Reemplazar bloques de itinerario
        await tx.itineraryBlock.deleteMany({ where: { tourId: tour.id } });
      } else {
        tour = await tx.tour.create({
          data: {
            organizationId: DEFAULT_ORG_ID,
            title: validated.data.title,
            slug: `${slug}-${Date.now().toString().slice(-4)}`,
            destination: validated.data.city,
            difficulty: validated.data.difficulty,
            durationHours,
            commercialSummary: validated.data.summary,
            recommendations: `Punto de encuentro: ${validated.data.meetingPoint}`,
            status: "BORRADOR",
          },
        });
      }

      // Insertar bloques con sus 3 capas
      for (const [index, block] of calculatedBlocks.entries()) {
        await tx.itineraryBlock.create({
          data: {
            tourId: tour.id,
            orderIndex: index,
            startTimeEstimated: block.startTime,
            durationMinutes: block.durationMinutes,
            commercialTitle: block.data.title,
            commercialDesc: block.data.descriptionPublic,
            customStorytelling: block.data.narrativeScript,
            icebreakerPrompt: block.data.icebreakers,
            privateLogisticsNotes: block.data.operationalNotes,
            providerId: block.data.providerId || null,
          },
        });
      }

      return tour;
    });

    revalidatePath("/tours");
    return { success: true, tourId: savedTour.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al guardar tour";
    return { success: false, error: errorMsg };
  }
}
