import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const baseWidth = 375; // Baserad på iPhone 8 som referensenhet

const scale = width / baseWidth;

export const spacing = {
  xs: Math.round(4 * scale),
  sm: Math.round(8 * scale),
  md: Math.round(16 * scale),
  lg: Math.round(24 * scale),
  xl: Math.round(32 * scale),
  xxl: Math.round(48 * scale),
  scrollViewBottomPadding: Math.round(100 * scale),
  borderRadius: 14,
  rounded: Math.round(100 * scale),
};
