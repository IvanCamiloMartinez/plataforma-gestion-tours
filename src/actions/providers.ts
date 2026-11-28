"use server";

import prisma from "@/lib/prisma";
import { ProviderSchema, ProviderFormData } from "@/lib/validations/provider";
import { revalidatePath } from "next/cache";

const DEFAULT_ORG_ID = "org_demo_bogota_nativa";

async function ensureDefaultOrganization() {
  const org = await prisma.organization.findUnique({
    where: { id: DEFAULT_ORG_ID },
  });

  if (!org) {
    return await prisma.organization.create({
      data: {
        id: DEFAULT_ORG_ID,
        legalName: "Bogotá Nativa Ecoturismo S.A.S.",
        commercialName: "Bogotá Nativa",
        phone: "+573001234567",
        email: "operaciones@bogotanativa.com",
        city: "Bogotá",
        planType: "RASTRILLO",
      },
    });
  }
  return org;
}

export async function getProvidersWithTariffs() {
  await ensureDefaultOrganization();

  const providers = await prisma.provider.findMany({
    where: {
      organizationId: DEFAULT_ORG_ID,
      deletedAt: null,
    },
    include: {
      tariffs: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return providers;
}

export async function createProvider(data: ProviderFormData) {
  const validated = ProviderSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  await ensureDefaultOrganization();

  const org = await prisma.organization.findUnique({
    where: { id: DEFAULT_ORG_ID },
  });

  if (org?.planType === "RASTRILLO") {
    const count = await prisma.provider.count({
      where: {
        organizationId: DEFAULT_ORG_ID,
        category: validated.data.category,
        deletedAt: null,
      },
    });

    if (count >= 5) {
      return {
        success: false,
        error: `Has alcanzado el límite de 5 proveedores para la categoría ${validated.data.category} en el Plan Rastrillo. Actualiza al Plan Guía para registrar hasta 15 aliados.`,
        isQuotaExceeded: true,
      };
    }
  }

  try {
    const provider = await prisma.$transaction(async (tx) => {
      const p = await tx.provider.create({
        data: {
          organizationId: DEFAULT_ORG_ID,
          commercialName: validated.data.commercialName,
          contactPerson: validated.data.contactPerson,
          phone: validated.data.phone,
          category: validated.data.category,
          notesPrivate: validated.data.notesPrivate,
        },
      });

      await tx.tariff.create({
        data: {
          providerId: p.id,
          concept: validated.data.concept || "Tarifa estándar",
          costType: validated.data.costType,
          amount: validated.data.baseRate,
          currency: "COP",
        },
      });

      return p;
    });

    revalidatePath("/proveedores");
    return { success: true, data: provider };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error desconocido al crear proveedor";
    return { success: false, error: errorMsg };
  }
}
