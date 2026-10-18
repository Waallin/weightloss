import { getDateKey, parseUserCreatedAt } from "./dateUtils";

export const STEP_GOAL = 5000;
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type DayDoc = {
  dateKey?: string;
  points?: { total?: number; used?: number };
  progress?: { steps?: number };
};

export const eatWin = (day?: DayDoc | null) => {
  const used = day?.points?.used ?? 0;
  const total = day?.points?.total ?? 0;
  return used > 0 && used <= total;
};

export const moveWin = (day?: DayDoc | null) =>
  (day?.progress?.steps ?? 0) >= STEP_GOAL;

export const formatNumber = (n: number) =>
  Math.round(n).toLocaleString("en-US");

export const ptsWord = (n: number) => (Math.abs(n) === 1 ? "pt" : "pts");

export type MealSlot = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export const slotForNow = (date = new Date()): MealSlot => {
  const h = date.getHours();
  if (h >= 5 && h < 11) return "Breakfast";
  if (h >= 11 && h < 15) return "Lunch";
  if (h >= 17 && h < 22) return "Dinner";
  return "Snack";
};

export const stepsStatusFor = (steps: number) => {
  if (steps >= STEP_GOAL) return "Goal reached";
  const rem = STEP_GOAL - steps;
  if (rem <= 1000) return "Almost there";
  if (steps >= STEP_GOAL / 2) return "Over halfway";
  if (steps > 0) return "Good start";
  return "Not started yet";
};

const startOfLocalDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Matches `getDateKey()` (UTC date) for a local calendar day. */
const dateKeyForLocalDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12).toISOString().split("T")[0];

export type JourneyPosition = {
  /** 1–7 within the current block */
  dayInWeek: number;
  /** 1-based */
  weekNumber: number;
  blockStart: Date;
};

export const getJourneyPosition = (createdAt: unknown): JourneyPosition => {
  const start = startOfLocalDay(parseUserCreatedAt(createdAt));
  const today = startOfLocalDay(new Date());
  const dayIndex = Math.max(0, Math.round((today.getTime() - start.getTime()) / DAY_MS));
  const weekIndex = Math.floor(dayIndex / 7);
  const blockStart = new Date(start);
  blockStart.setDate(start.getDate() + weekIndex * 7);
  return {
    dayInWeek: (dayIndex % 7) + 1,
    weekNumber: weekIndex + 1,
    blockStart,
  };
};

export type WeekDay = {
  n: number;
  label: string;
  dateKey: string;
  isToday: boolean;
  isFuture: boolean;
  isCheckIn: boolean;
  eat: boolean;
  move: boolean;
  both: boolean;
  hasData: boolean;
};

export const buildWeek = (
  createdAt: unknown,
  days: DayDoc[],
  today?: DayDoc | null,
): WeekDay[] => {
  const { dayInWeek, blockStart } = getJourneyPosition(createdAt);
  const todayKey = getDateKey();
  const byKey: Record<string, DayDoc> = {};
  for (const d of days) {
    if (d?.dateKey) byKey[d.dateKey] = d;
  }
  if (today) byKey[todayKey] = today;

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(blockStart);
    date.setDate(blockStart.getDate() + i);
    const n = i + 1;
    const isToday = n === dayInWeek;
    const dateKey = isToday ? todayKey : dateKeyForLocalDay(date);
    const doc = byKey[dateKey];
    const eat = eatWin(doc);
    const move = moveWin(doc);
    return {
      n,
      label: n === 7 ? "Check" : WEEKDAYS[date.getDay()],
      dateKey,
      isToday,
      isFuture: n > dayInWeek,
      isCheckIn: n === 7,
      eat,
      move,
      both: eat && move,
      hasData: !!doc && n < dayInWeek,
    };
  });
};
