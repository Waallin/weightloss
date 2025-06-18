import { create } from "zustand";

interface ChecklistState {
  checklists: any[];
  setChecklists: (checklists: any[]) => void;
}

const useChecklistStore = create<ChecklistState>((set) => ({
  checklists: [],
  setChecklists: (checklists) => set({ checklists }),
}));

export default useChecklistStore;
