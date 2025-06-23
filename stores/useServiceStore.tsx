import { create } from "zustand";

interface ServiceState {
  services: any[];
  filteredServices: any[];
  setServices: (services: any[]) => void;
  filterServicesWithCategory: (type: string) => void;
}

const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  filteredServices: [],
  setServices: (services) => set({ services }),

  filterServicesWithCategory: (type: string) => {
    const services = get().services;

    if (type === "All") {
      set({ filteredServices: services });
      return;
    }

    const filteredServices = services.filter(
      (service) => service.category === type
    );

    set({ filteredServices: filteredServices });
  },
}));

export default useServiceStore;
