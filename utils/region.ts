import { lbToKg } from "./units";

// Device region from the system locale (e.g. "en-US" -> "US"). Unknown region counts as non-US.
export function getDeviceRegion(): string | null {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale.split("-").pop()?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

export const isUsRegion = (): boolean => getDeviceRegion() === "US";

// Testimonial weights are written in lb; show kg outside the US.
export function testimonialWeight(lb: number, usUnit: "lb" | "lbs" = "lb"): string {
  return isUsRegion() ? `${lb} ${usUnit}` : `${Math.round(lbToKg(lb))} kg`;
}
