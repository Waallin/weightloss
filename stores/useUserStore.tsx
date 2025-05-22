import { create } from "zustand";

const dummyUser = {
  id: "1",
  name: "Morgana",
  token: "1|fxRaW14xHkA7hvbdNG6dsC3pjzWHWgxRDkqvF5oxfdb514f9",
};
interface UserState {
  user: any;
  setUser: (user: any) => void;
}

const useUserStore = create<UserState>((set, get) => ({
  user: dummyUser,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
