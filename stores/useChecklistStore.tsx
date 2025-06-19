import { create } from "zustand";

interface ChecklistState {
  checklists: any[];
  setChecklists: (checklists: any[]) => void;
  updateChecklistItem: (itemId: string, response: any) => void;
  toggleChecklistCompletion: (checklistId: string) => void;
}

const useChecklistStore = create<ChecklistState>((set, get) => ({
  checklists: [],
  setChecklists: (checklists) => set({ checklists }),

  // Action för att uppdatera ett checklist item
  updateChecklistItem: (itemId: string, response: any) => {
    const { checklists } = get();
    const updatedChecklists = checklists.map((checklist) => ({
      ...checklist,
      sections: checklist.sections.map((section: any) => ({
        ...section,
        items: section.items.map((item: any) =>
          item.id === itemId ? { ...item, responses: [response] } : item
        ),
      })),
    }));
    set({ checklists: updatedChecklists });
  },

  toggleChecklistCompletion: (checklistId: string) => {
    const { checklists } = get();
    const updatedChecklists = checklists.map((checklist: any) =>
      checklist.id === checklistId
        ? { ...checklist, is_completed: 1 }
        : checklist
    );
    set({ checklists: updatedChecklists });
  },
}));

export default useChecklistStore;
