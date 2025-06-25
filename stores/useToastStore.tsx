import { create } from "zustand";

interface ToastState {
  isVisible: boolean;
  message: string;
  showToast: (message: string) => void;
  hideToast: () => void;
}

const useToastStore = create<ToastState>((set) => ({
  isVisible: false,
  message: "",
  showToast: (message: string) => {
    set({ isVisible: true, message });

    setTimeout(() => {
      set({ isVisible: false });
    }, 3300);
  },
  hideToast: () => set({ isVisible: false }),
}));

export default useToastStore;
