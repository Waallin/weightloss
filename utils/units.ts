export const KG_TO_LB = 2.2046226218;
export const CM_PER_IN = 2.54;

export const HEIGHT_MIN_CM = 120;
export const HEIGHT_MAX_CM = 220;

export function clampHeightCm(cm: number): number {
  return Math.min(Math.max(Math.round(cm), HEIGHT_MIN_CM), HEIGHT_MAX_CM);
}

export function kgToLb(kg: number): number {
  return Math.round(kg * KG_TO_LB);
}

export function lbToKg(lb: number): number {
  return Math.round((lb / KG_TO_LB) * 10) / 10;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = Math.round(cm / CM_PER_IN);
  return {
    feet: Math.floor(totalInches / 12),
    inches: totalInches % 12,
  };
}

export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return clampHeightCm(totalInches * CM_PER_IN);
}

export function formatFeetInches(feet: number, inches: number): string {
  return `${feet}' ${inches}"`;
}

export function formatLb(lb: number): string {
  const n = Number(lb);
  if (!Number.isFinite(n)) return "0";
  return String(n);
}

export function formatWeightFromKg(
  kg: number | null | undefined,
  unit: "lb" | "kg" = "lb",
  notSet = "—",
): string {
  if (kg == null || Number.isNaN(Number(kg))) return notSet;
  if (unit === "kg") return `${Math.round(Number(kg))} kg`;
  return `${formatLb(kgToLb(Number(kg)))} lb`;
}

export function formatHeightFromCm(
  cm: number | null | undefined,
  unit: "ft" | "cm" = "ft",
  notSet = "—",
): string {
  if (cm == null || Number.isNaN(Number(cm))) return notSet;
  if (unit === "cm") return `${Math.round(Number(cm))} cm`;
  const { feet, inches } = cmToFeetInches(Number(cm));
  return formatFeetInches(feet, inches);
}
