import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { fonts } from "./fonts";
import { spacing } from "./spacing";
import { RFValue } from "react-native-responsive-fontsize";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: spacing.lg,
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: RFValue(26),
    fontFamily: fonts.primary.bold,
    fontWeight: "800",
    color: colors.text.primary,
  },

  subTitle: {
    fontSize: RFValue(12),
    fontFamily: fonts.primary.regular,
    fontWeight: "400",
    color: colors.text.secondary,
  },
  smallText: {
    fontSize: RFValue(10),
    fontFamily: fonts.primary.regular,
    fontWeight: "400",
    color: colors.text.secondary,
  },

  buttonText: {
    fontSize: RFValue(14),
    fontFamily: fonts.primary.regular,
    fontWeight: "600",
    color: colors.ui.white,
  },
  input: {
    fontSize: RFValue(12),
    fontFamily: fonts.primary.regular,
    fontWeight: "400",
    color: colors.text.tertiary,
  },

  cardShadow: {
    // iOS shadow
    shadowColor: colors.text.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 4,
  },
});
