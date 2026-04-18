import { create } from "zustand";

export interface TodayProgressState {
  todayProgress: any;
  setTodayProgress: (todayProgress: any) => void;
}

const useTodayProgressStore = create<TodayProgressState>((set, get) => ({
  todayProgress: null,
  setTodayProgress: (todayProgress) => set({ todayProgress }),
}));

export default useTodayProgressStore;
