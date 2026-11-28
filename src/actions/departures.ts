"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_ORG_ID = "org_demo_bogota_nativa";
const DEFAULT_USER_ID = "user_demo_guia_principal";

async function ensureDefaultUser() {
  const user = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID },
  });

  if (!user) {
    return await prisma.user.create({
      data: {
        id: DEFAULT_USER_ID,
        organizationId: DEFAULT_ORG_ID,
        email: "guia@bogotanativa.com",
        passwordHash: "demo_hash",
        fullName: "Iván Camilo Martínez",
        phone: "+573101234567",
        professionalCard: "28491",
        role: "ADMIN",
      },
    });
  }
  return user;
}

export async function getDeparturesList() {
  const departures = await prisma.departure.findMany({
    where: {
      organizationId: DEFAULT_ORG_ID,
      deletedAt: null,
    },
    include: {
      tour: true,
      passengers: true,
    },
    orderBy: { departureDate: "desc" },
  });

  return departures;
}

export async function getDepartureDetails(departureId: string) {
  const departure = await prisma.departure.findUnique({
    where: { id: departureId },
    include: {
      tour: {
        include: {
          costItems: true,
        },
      },
      passengers: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return departure;
}

export async function createDeparture(tourId: string, departureDate: string, maxPax: number) {
  await ensureDefaultUser();

  const org = await prisma.organization.findUnique({
    where: { id: DEFAULT_ORG_ID },
  });

  if (org?.planType === "RASTRILLO") {
    const departuresCount = await prisma.departure.count({
      where: {
        organizationId: DEFAULT_ORG_ID,
        deletedAt: null,
      },
    });

    if (departuresCount >= 4) {
      return {
        success: false,
        error: "Has alcanzado el límite de 4 salidas al mes en el Plan Rastrillo. Pasa al Plan Guía para programar hasta 12 salidas mensuales.",
        isQuotaExceeded: true,
      };
    }
  }

  try {
    const departure = await prisma.departure.create({
      data: {
        organizationId: DEFAULT_ORG_ID,
        tourId,
        leadGuideId: DEFAULT_USER_ID,
        departureDate: new Date(departureDate),
        maxCapacity: maxPax,
        status: "PROGRAMADA",
      },
    });

    revalidatePath("/salidas");
    return { success: true, departureId: departure.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al programar salida";
    return { success: false, error: errorMsg };
  }
}

export async function addPassengerToDeparture(
  departureId: string,
  passenger: {
    fullName: string;
    docType: "CC" | "CE" | "PAS" | "PPT" | "TI";
    documentNumber: string;
    phone: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    medicalNotes?: string;
    paymentStatus: "PENDIENTE" | "ANTICIPO" | "PAGADO_TOTAL";
    totalPrice: number;
    paidAmount: number;
  }
) {
  try {
    const res = await prisma.$transaction(async (tx) => {
      const dep = await tx.departure.findUnique({
        where: { id: departureId },
        include: { passengers: true },
      });

      if (!dep) throw new Error("Salida no encontrada");
      if (dep.passengers.length >= dep.maxCapacity) {
        throw new Error("Aforo completo: no quedan cupos disponibles para esta salida.");
      }

      const pendingBalance = passenger.totalPrice - passenger.paidAmount;

      const p = await tx.passenger.create({
        data: {
          departureId,
          fullName: passenger.fullName,
          docType: passenger.docType,
          docNumber: passenger.documentNumber,
          phone: passenger.phone,
          emergencyContactName: passenger.emergencyContactName,
          emergencyContactPhone: passenger.emergencyContactPhone,
          medicalAlerts: passenger.medicalNotes || null,
          habeasDataConsent: true,
          habeasDataAcceptedAt: new Date(),
          paymentStatus: passenger.paymentStatus,
          paidAmount: passenger.paidAmount,
          pendingBalance,
          attendanceStatus: "CONFIRMADO",
        },
      });

      return p;
    });

    revalidatePath(`/salidas/${departureId}`);
    return { success: true, data: res };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al agregar pasajero";
    return { success: false, error: errorMsg };
  }
}

export async function closeDepartureCheckout(departureId: string) {
  try {
    const dep = await prisma.departure.findUnique({
      where: { id: departureId },
      include: {
        passengers: true,
        tour: {
          include: { costItems: true },
        },
      },
    });

    if (!dep) throw new Error("Salida no encontrada");

    const actualRevenue = dep.passengers.reduce((acc, p) => acc + Number(p.paidAmount), 0);
    const confirmedCount = dep.passengers.filter((p) => p.attendanceStatus !== "CANCELADO").length;

    const fixedCosts = dep.tour.costItems
      .filter((c) => c.costType === "FIXED_DEPARTURE")
      .reduce((acc, c) => acc + Number(c.amount), 0);

    const variableCosts = dep.tour.costItems
      .filter((c) => c.costType === "VARIABLE_PAX")
      .reduce((acc, c) => acc + Number(c.amount) * confirmedCount, 0);

    const actualCosts = fixedCosts + variableCosts;
    const netProfit = actualRevenue - actualCosts;

    await prisma.departure.update({
      where: { id: departureId },
      data: {
        status: "COMPLETADA",
        actualRevenue,
        actualCosts,
        netProfit,
      },
    });

    revalidatePath(`/salidas/${departureId}`);
    revalidatePath("/salidas");
    return { success: true, netProfit, actualRevenue, actualCosts };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al cerrar caja";
    return { success: false, error: errorMsg };
  }
}

export async function rescheduleDeparture(departureId: string, newDateStr: string) {
  try {
    await prisma.departure.update({
      where: { id: departureId },
      data: {
        departureDate: new Date(newDateStr),
        status: "REPROGRAMADA",
      },
    });

    revalidatePath(`/salidas/${departureId}`);
    revalidatePath("/salidas");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al reprogramar";
    return { success: false, error: errorMsg };
  }
}
