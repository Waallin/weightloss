import { create } from "zustand";

interface UserState {
  user: any;
  setUser: (user: any) => void;
  mainBoat: () => any | null;
}

const useUserStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  mainBoat: () => {
    const user = get().user;
    return user?.boats?.length > 0 ? user.boats[0] : null;
  },
}));

export default useUserStore;
