import { Timestamp } from "firebase/firestore";

/** Parse YYYY-MM-DD as a local calendar date (no UTC shift). */
export const parseLocalYmdToDate = (ymd: string): Date => {
  const [y, m, d] = ymd.split("-").map((v) => parseInt(v, 10));
  return new Date(y, m - 1, d);
};

/** Local calendar day as YYYY-MM-DD (for react-native-calendars). */
export const formatLocalYmd = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/**
 * Parses Firestore/user `createdAt` (Timestamp, Date, seconds object, ISO string) to a valid Date.
 * Falls back to now if missing or invalid.
 */
export const parseUserCreatedAt = (createdAt: unknown): Date => {
  const fallback = new Date();
  if (createdAt == null) return fallback;

  if (createdAt instanceof Timestamp) {
    const d = createdAt.toDate();
    return isNaN(d.getTime()) ? fallback : d;
  }

  if (createdAt instanceof Date && !isNaN(createdAt.getTime())) {
    return createdAt;
  }

  if (
    typeof createdAt === "object" &&
    createdAt !== null &&
    "seconds" in createdAt &&
    typeof (createdAt as { seconds: unknown }).seconds === "number"
  ) {
    const ms = (createdAt as { seconds: number }).seconds * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? fallback : d;
  }

  if (typeof createdAt === "string" || typeof createdAt === "number") {
    const d = new Date(createdAt);
    return isNaN(d.getTime()) ? fallback : d;
  }

  return fallback;
};

/** Inclusive range of local calendar days from start through end (empty if start > end). */
export const iterateLocalYmdRange = (start: Date, end: Date): string[] => {
  const result: string[] = [];
  const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endNorm = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  if (cur.getTime() > endNorm.getTime()) return [];

  while (cur.getTime() <= endNorm.getTime()) {
    result.push(formatLocalYmd(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return result;
};

/** e.g. "Mon, Apr 19, 2026" for progress calendar subtitle. */
export const formatJourneyStartedDate = (d: Date): string =>
  d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getFormattedDate = (date: Date): string => {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  const dayString = isToday ? "idag" : date.toLocaleDateString("sv-SE", { weekday: "long" });
  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString("sv-SE", { month: "long" });
  return `${dayString}, ${dayNumber} ${monthName}`;
};

export const getDateKey = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};