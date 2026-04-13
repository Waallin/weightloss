import { create } from "zustand";

export interface ConfettiState {
  visibleConfetti: boolean;
  /** Increments on every `setVisibleConfetti(true)` so a new burst runs even if already visible. */
  confettiNonce: number;
  setVisibleConfetti: (visible: boolean) => void;
}

const useConfettiStore = create<ConfettiState>((set) => ({
  visibleConfetti: false,
  confettiNonce: 0,
  setVisibleConfetti: (visible) =>
    set((s) =>
      visible
        ? { visibleConfetti: true, confettiNonce: s.confettiNonce + 1 }
        : { visibleConfetti: false },
    ),
}));
export default useConfettiStore;
