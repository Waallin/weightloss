import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const HEIGHT_UNIT_KEY = "height_unit";
export const WEIGHT_UNIT_KEY = "weight_unit";

export type HeightUnit = "ft" | "cm";
export type WeightUnit = "lb" | "kg";

interface UnitsState {
  heightUnit: HeightUnit;
  weightUnit: WeightUnit;
  hydrateUnits: () => Promise<void>;
  setHeightUnit: (unit: HeightUnit) => void;
  setWeightUnit: (unit: WeightUnit) => void;
}

const useUnitsStore = create<UnitsState>((set) => ({
  heightUnit: "ft",
  weightUnit: "lb",
  hydrateUnits: async () => {
    const [storedHeightUnit, storedWeightUnit] = await Promise.all([
      AsyncStorage.getItem(HEIGHT_UNIT_KEY),
      AsyncStorage.getItem(WEIGHT_UNIT_KEY),
    ]);
    const next: Partial<Pick<UnitsState, "heightUnit" | "weightUnit">> = {};
    if (storedHeightUnit === "ft" || storedHeightUnit === "cm") {
      next.heightUnit = storedHeightUnit;
    }
    if (storedWeightUnit === "lb" || storedWeightUnit === "kg") {
      next.weightUnit = storedWeightUnit;
    }
    if (Object.keys(next).length > 0) set(next);
  },
  setHeightUnit: (heightUnit) => {
    set({ heightUnit });
    AsyncStorage.setItem(HEIGHT_UNIT_KEY, heightUnit);
  },
  setWeightUnit: (weightUnit) => {
    set({ weightUnit });
    AsyncStorage.setItem(WEIGHT_UNIT_KEY, weightUnit);
  },
}));

export default useUnitsStore;
