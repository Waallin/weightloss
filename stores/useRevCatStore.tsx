import { create } from "zustand";

interface useRevCatStoreState {
  products: any;
  productsLoaded: boolean;
  setProducts: (products: { weekly: any; annual: any, monthly: any }) => void;
}

const useRevCatStore = create<useRevCatStoreState>((set, get) => ({
  products: null,
  productsLoaded: false,
  setProducts: (products: { weekly: any; annual: any, monthly: any }) =>
    set({ products, productsLoaded: true }),
}));

export default useRevCatStore;
