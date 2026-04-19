import { create } from "zustand";

export interface TodayDietState {
  todayDiet: any;
  setTodayDiet: (todayDiet: any) => void;
}

const useTodayDietStore = create<TodayDietState>((set, get) => ({
  todayDiet: [],
  setTodayDiet: (todayDiet) => set({ todayDiet }),
}));

export default useTodayDietStore;
