import { create } from "zustand";

interface UserState {
  user: any;
  setUser: (user: any) => void;
}

const useUserStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
