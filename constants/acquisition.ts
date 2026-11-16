// Var användaren hörde om Kudoo. Id:t skickas till Mixpanel och sparas på kontot.
export const ACQUISITION_SOURCES = [
  { id: "tiktok", label: "TikTok" },
  { id: "app_store", label: "App Store search" },
  { id: "instagram", label: "Instagram" },
  { id: "friend", label: "A friend" },
  { id: "other", label: "Other" },
] as const;
export type AcquisitionSource = (typeof ACQUISITION_SOURCES)[number]["id"] | "skipped";
