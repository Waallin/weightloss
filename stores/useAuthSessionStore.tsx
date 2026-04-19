import { create } from "zustand";

interface AuthSessionState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

const useAuthSessionStore = create<AuthSessionState>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
}));

export default useAuthSessionStore;
