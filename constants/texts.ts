import { colors } from "./colors";
import { fonts } from "./fonts";

export const textSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 22,
    xxxl: 26,
};


export const textStyles = {
    primary: {
        fontFamily: fonts.primary.medium,
        fontSize: textSizes.md,
        color: colors.text.primary,
    },

    secondary: {
        fontFamily: fonts.primary.regular,
        fontSize: textSizes.sm,
        color: colors.text.secondary,
    },

    listItemTitle: {
        fontFamily: fonts.primary.semiBold,
        fontSize: textSizes.lg,
        color: colors.text.primary,
    },

    listItemMeta: {
        fontFamily: fonts.primary.regular,
        fontSize: textSizes.sm,
        color: colors.text.secondary,
    },

    listItemEmphasis: {
        fontFamily: fonts.primary.medium,
        fontSize: textSizes.sm,
        color: colors.ui.primary,
    },

    screenSectionTitle: {
        fontFamily: fonts.primary.bold,
        fontSize: textSizes.lg,
        color: colors.text.primary,
    },
};

export const dietLabels = {
    gramsUnit: "g",
    kudos: "Points",
} as const;
