/**
 * Utilidades cronológicas para el recálculo en cascada de itinerarios (Ley de Tesler).
 * El guía no hace matemáticas mentales: cambiar la duración de un hito propaga
 * reactivamente las horas de inicio y fin de todas las paradas subsecuentes.
 */

export interface CalculatedBlock<T> {
  data: T;
  startTime: string; // Formato "HH:MM" (ej. "08:00")
  endTime: string;   // Formato "HH:MM" (ej. "08:45")
  durationMinutes: number;
}

export function addMinutesToTimeString(timeStr: string, minutesToAdd: number): string {
  const [hoursStr, minsStr] = timeStr.split(":");
  const hours = parseInt(hoursStr, 10);
  const mins = parseInt(minsStr, 10);

  const totalMinutes = hours * 60 + mins + minutesToAdd;
  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440; // 1440 min en un día

  const newHours = Math.floor(normalizedMinutes / 60);
  const newMins = normalizedMinutes % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(newHours)}:${pad(newMins)}`;
}

export function recalculateTimelineCascade<T extends { durationMinutes: number }>(
  blocks: T[],
  tourStartTime: string = "08:00"
): CalculatedBlock<T>[] {
  let currentTime = tourStartTime;

  return blocks.map((block) => {
    const start = currentTime;
    const end = addMinutesToTimeString(start, block.durationMinutes);
    currentTime = end;

    return {
      data: block,
      startTime: start,
      endTime: end,
      durationMinutes: block.durationMinutes,
    };
  });
}
