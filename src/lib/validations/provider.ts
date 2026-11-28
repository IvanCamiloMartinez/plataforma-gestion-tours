import { z } from "zod";

export const ProviderCategoryEnum = z.enum([
  "TRANSPORTE",
  "ALIMENTACION",
  "ACTIVIDAD_EXPERIENCIA",
  "SEGUROS",
]);

export const CostTypeEnum = z.enum([
  "FIXED_DEPARTURE", // Fijo por salida (ej. van completa)
  "VARIABLE_PAX",    // Variable por persona (ej. almuerzo, entrada)
]);

export const ProviderSchema = z.object({
  commercialName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  contactPerson: z.string().optional(),
  phone: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .regex(/^[0-9+ ]+$/, "Formato de teléfono no válido"),
  category: ProviderCategoryEnum,
  concept: z.string().default("Tarifa estándar"),
  costType: CostTypeEnum,
  baseRate: z.number().positive("La tarifa debe ser mayor a 0"),
  currency: z.string().default("COP"),
  notesPrivate: z.string().optional(),
});

export type ProviderFormData = z.infer<typeof ProviderSchema>;
