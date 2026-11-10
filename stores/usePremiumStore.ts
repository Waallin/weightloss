import { create } from "zustand";

interface PremiumState {
  isPremium: boolean;
  // true när vi har fått ett svar från RevenueCat (även om svaret är "inte premium")
  loaded: boolean;
  setPremium: (isPremium: boolean) => void;
}

const usePremiumStore = create<PremiumState>((set) => ({
  isPremium: false,
  loaded: false,
  setPremium: (isPremium) => set({ isPremium, loaded: true }),
}));

export default usePremiumStore;
