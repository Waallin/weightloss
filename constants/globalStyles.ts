import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { fonts } from "./fonts";
import { spacing } from "./spacing";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "react-native-svg";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: spacing.md,
    backgroundColor: colors.ui.primaryBackground,
  },

  authContainer: {
    flex: 1,
    width: "100%",
    padding: spacing.md,
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: RFValue(26),
    fontFamily: fonts.primary.bold,
    fontWeight: "800",
    color: colors.text.primary,
  },

  smallTitle: {
    fontSize: RFValue(20),
    fontFamily: fonts.primary.bold,
    fontWeight: "700",
    color: colors.text.primary,
  },

  bodyText: {
    fontSize: RFValue(16),
    fontFamily: fonts.primary.regular,
    fontWeight: "600",
    color: colors.text.primary,
  },

  subTitle: {
    fontSize: RFValue(14),
    fontFamily: fonts.primary.regular,
    fontWeight: "400",
    color: colors.text.secondary,
  },
  smallText: {
    fontSize: RFValue(12),
    fontFamily: fonts.primary.regular,
    fontWeight: "400",
    color: colors.text.secondary,
  },

  xSmallText: {
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
  smallGreyText: {
    fontSize: RFValue(12),
    fontFamily: fonts.primary.medium,
    fontWeight: "400",
    color: colors.text.light,
  },

  tabBarLabel: {
    fontSize: RFValue(8),
    fontFamily: fonts.primary.regular,
    fontWeight: "400",
    color: colors.text.light,
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
