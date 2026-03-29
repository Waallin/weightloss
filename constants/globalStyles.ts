import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { fonts } from "./fonts";
import { spacing } from "./spacing";
import { RFValue } from "react-native-responsive-fontsize";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: spacing.md,
    backgroundColor: colors.ui.background,
  },

  contentContainer: {
    gap: spacing.componentGap,
    paddingBottom: spacing.scrollViewBottomPadding,
  },
  


  shadow: {
    shadowColor: colors.ui.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 8,
  },
});
