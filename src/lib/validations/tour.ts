import { z } from "zod";

export const TourDifficultyEnum = z.enum(["BAJA", "MEDIA", "ALTA", "EXPERTO"]);
export const TourStatusEnum = z.enum(["BORRADOR", "PUBLICADO", "ARCHIVADO"]);

export const ItineraryBlockSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "El título de la parada es obligatorio"),
  durationMinutes: z.number().min(5, "La duración mínima es de 5 minutos"),
  
  // Capa 1: Comercial (Pública)
  descriptionPublic: z.string().optional(),
  includes: z.string().optional(),
  
  // Capa 2: Interpretativa (Storytelling del guía)
  narrativeScript: z.string().optional(),
  curiosities: z.string().optional(),
  icebreakers: z.string().optional(),
  
  // Capa 3: Operativa (Privada)
  providerId: z.string().optional(),
  operationalNotes: z.string().optional(),
  cashNotes: z.string().optional(),
});

export const TourSchema = z.object({
  title: z.string().min(3, "El título del tour debe tener al menos 3 caracteres"),
  slug: z.string().optional(),
  summary: z.string().optional(),
  startTimeDefault: z.string().default("08:00"),
  difficulty: TourDifficultyEnum.default("BAJA"),
  city: z.string().default("Bogotá"),
  meetingPoint: z.string().min(3, "Indica el punto de encuentro"),
  blocks: z.array(ItineraryBlockSchema).default([]),
});

export type ItineraryBlockFormData = z.infer<typeof ItineraryBlockSchema>;
export type TourFormData = z.infer<typeof TourSchema>;
