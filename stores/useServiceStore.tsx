import { create } from "zustand";

interface ServiceState {
  services: any[];
  setServices: (services: any[]) => void;
}

const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  setServices: (services) => set({ services }),
}));

export default useServiceStore;
