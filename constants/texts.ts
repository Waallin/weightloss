import { colors } from "./colors";
import { fonts } from "./fonts";

export const textSizes = {
    xxs: 10,
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

    onboardingTitle: {
        fontFamily: fonts.primary.bold,
        fontSize: textSizes.xxxl,
        color: colors.text.primary,
    },

    onboardingBody: {
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

export const authCopy = {
    planReadyTitle: "Your plan is ready",
    planReadySubtitle: "We tailored your routine to fit your body and goal—so you can focus on showing up.",
    planReadyStatPrefix: "Progress outlook:",
    planReadySocialProof: "People start noticing changes within the first week",
    planReadyCta: "Continue",
    planReadyBullets: [
        "3 simple habits",
        "No calorie counting",
        "No gym required"
    ],
    howItWorkSections: [
        {
            id: 1,
            title: "Todays plan",
            description: [
                "• Walk: 10k steps",
                "• Drink: 10 glasses of water",
                "• Eat: Stay within your points" 
            ].join('\n'),
            imageKey: "threeFingers",
        },
        {
            id: 2,
            title: "Points explained",
            description: "Foods that keep you full = fewer points\nFoods that don’t = more points",
            imageKey: "standing",
        },
        {
            id: 3,
            title: "You're ready",
            description: "That’s it. Just follow today.\nWe’ll handle the rest.",
            imageKey: "thumbsUp",
        },
    ],
} as const;
