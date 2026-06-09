import { create } from "zustand";

interface useRevCatStoreState {
  products: any;
  setProducts: (products: { weekly: any; annual: any, monthly: any }) => void;
}

const useRevCatStore = create<useRevCatStoreState>((set, get) => ({
  products: null,
    setProducts: (products: { weekly: any; annual: any, monthly: any }) => set({ products }),
}));

export default useRevCatStore;
