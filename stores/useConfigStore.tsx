import { create } from "zustand";

export interface ConfigState {
  config: any;
  setConfig: (config: any) => void;
}

const useConfigStore = create<ConfigState>((set, get) => ({
  config: null,
  setConfig: (config) => set({ config }),
}));

export default useConfigStore;
