import type { TextStyle } from "react-native";
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
  /** Large hero numbers (rings, gauges) */
  display: 32,
  /** Splash / wordmark lockup */
  splashWordmark: 28,
  /** Legacy layout hack: wraps vector icon inside Text on round nav button */
  roundedNavIcon: 35,
} as const;

export const lineHeights = {
  caption: 14,
  small: 18,
  body: 22,
  title: 24,
  headline: 28,
  /** Article reading body (more comfortable) */
  article: 26,
} as const;

/**
 * Single place for font size + weight + family. Prefer these over ad-hoc Text styles.
 * Adjust tokens here to change typography app-wide.
 */
export const typography = {
  sectionTitle: {
    fontFamily: fonts.primary.semiBold,
    fontSize: textSizes.lg,
    fontWeight: "600" as const,
  },
  cardTitle: {
    fontFamily: fonts.primary.semiBold,
    fontSize: textSizes.md,
    fontWeight: "600" as const,
  },
  body: {
    fontFamily: fonts.primary.regular,
    fontSize: textSizes.sm,
    fontWeight: "400" as const,
  },
  small: {
    fontFamily: fonts.primary.regular,
    fontSize: textSizes.xs,
    fontWeight: "400" as const,
  },
  caption: {
    fontFamily: fonts.primary.regular,
    fontSize: textSizes.xxs,
    fontWeight: "400" as const,
  },
  captionSemiBold: {
    fontFamily: fonts.primary.semiBold,
    fontSize: textSizes.xxs,
    fontWeight: "600" as const,
  },
  /** 16px medium — default emphasized line (former `textStyles.primary` base) */
  titleMedium: {
    fontFamily: fonts.primary.medium,
    fontSize: textSizes.md,
    fontWeight: "500" as const,
  },
  bodyMedium: {
    fontFamily: fonts.primary.medium,
    fontSize: textSizes.sm,
    fontWeight: "500" as const,
  },
  /** 14px semibold — compact labels, offer rows */
  bodySemiBold: {
    fontFamily: fonts.primary.semiBold,
    fontSize: textSizes.sm,
    fontWeight: "600" as const,
  },
  screenTitle: {
    fontFamily: fonts.primary.bold,
    fontSize: textSizes.xxxl,
    fontWeight: "700" as const,
  },
  headline: {
    fontFamily: fonts.primary.bold,
    fontSize: textSizes.xl,
    fontWeight: "700" as const,
  },
  headlineSemi: {
    fontFamily: fonts.primary.semiBold,
    fontSize: textSizes.xl,
    fontWeight: "600" as const,
  },
  subheadline: {
    fontFamily: fonts.primary.semiBold,
    fontSize: textSizes.lg,
    fontWeight: "600" as const,
  },
  /** Section headings that stay bold (e.g. colored cards, legacy “Small Wins”) */
  titleBold: {
    fontFamily: fonts.primary.bold,
    fontSize: textSizes.lg,
    fontWeight: "700" as const,
  },
  /** Large emoji / icon label in stat rows */
  emojiLarge: {
    fontFamily: fonts.primary.bold,
    fontSize: textSizes.xxxl,
    fontWeight: "700" as const,
  },
  button: {
    fontFamily: fonts.primary.bold,
    fontSize: textSizes.xl,
    fontWeight: "700" as const,
  },
  buttonSecondary: {
    fontFamily: fonts.primary.bold,
    fontSize: textSizes.sm,
    fontWeight: "700" as const,
  },
  displayNumeric: {
    fontFamily: fonts.primary.bold,
    fontSize: textSizes.display,
    fontWeight: "700" as const,
  },
  statLabel: {
    fontFamily: fonts.primary.regular,
    fontSize: textSizes.xs,
    fontWeight: "400" as const,
  },
  statValue: {
    fontFamily: fonts.primary.semiBold,
    fontSize: textSizes.md,
    fontWeight: "600" as const,
  },
  splashWordmark: {
    fontFamily: fonts.primary.regular,
    fontSize: textSizes.splashWordmark,
    fontWeight: "300" as const,
  },
  splashTagline: {
    fontFamily: fonts.primary.regular,
    fontSize: textSizes.md,
    fontWeight: "300" as const,
  },
  socialProofStat: {
    fontFamily: fonts.primary.bold,
    fontSize: textSizes.xxl,
    fontWeight: "700" as const,
  },
  /** Selected row in native-style wheel pickers */
  wheelPickerSelected: {
    fontFamily: fonts.primary.bold,
    fontSize: textSizes.xxl + 6,
    fontWeight: "700" as const,
  },
} as const satisfies Record<string, TextStyle>;

export const textStyles = {
  primary: {
    ...typography.titleMedium,
    color: colors.text.primary,
  },

  secondary: {
    ...typography.body,
    color: colors.text.secondary,
  },

  onboardingTitle: {
    ...typography.screenTitle,
    color: colors.text.primary,
  },

  onboardingBody: {
    ...typography.body,
    color: colors.text.secondary,
  },

  listItemTitle: {
    ...typography.sectionTitle,
    color: colors.text.primary,
  },

  listItemMeta: {
    ...typography.body,
    color: colors.text.secondary,
  },

  listItemEmphasis: {
    ...typography.bodyMedium,
    color: colors.ui.primary,
  },

  screenSectionTitle: {
    ...typography.sectionTitle,
    color: colors.text.primary,
  },
};

export const progressCardCopy = {
  goalComplete: "Goal reached",
  claim: "Claim",
  claimHint: "Tap to claim your reward",
} as const;

/** Progress screen — calendar card */
export const progressCalendarCopy = {
  sectionTitle: "Your journey",
  startedPrefix: "Started",
  legendJourneyDays: "Journey",
} as const;

/** Progress screen — circular goal gauge (center label under %) */
export const progressGaugeCopy = {
  toGoalLabel: "to goal",
} as const;

/** Progress screen — start / current / goal weights under the gauge */
export const progressWeightsCopy = {
  startLabel: "Start weight",
  currentLabel: "Current weight",
  goalLabel: "Goal weight",
  notSet: "—",
} as const;

/** Home screen — Points progress card microcopy */
export function getHomePointsMicroCopy(total: number, used: number): string {
  const remaining = total - used;
  if (total > 0 && remaining > 0) {
    return `${remaining} left today`;
  }
  if (total > 0) {
    return "You've eaten over your limit today";
  }
  return "Your daily points will show here";
}

/**
 * Diet calorie hero — encouraging line under the big remaining number.
 * Avoids repeating the remaining count (shown large above).
 */
export function getDietCalorieHeroMicroCopy(
  total: number,
  used: number,
): string {
  const remaining = total - used;
  if (total <= 0) {
    return "Your daily points will show here";
  }
  if (remaining < 0) {
    return "Over budget today. Fresh start tomorrow.";
  }
  if (remaining === 0) {
    return "Right on target. Nice work";
  }
  const ratio = remaining / total;
  if (ratio >= 0.6) {
    return "Plenty of room today. Enjoy your meals";
  }
  if (ratio >= 0.35) {
    return "Solid pace. Keep choosing well";
  }
  if (ratio >= 0.15) {
    return "Getting close. Eat mindfully";
  }
  return "Almost there. Make it count";
}

export const dietLabels = {
  /** Diet home — empty list below "Today's diet" */
  emptyDietTitle: "Nothing logged yet",
  emptyDietSubtitle: "Tap + to add food and track your day.",
  gramsUnit: "g",
  kudos: "Points",
  /** Compact suffix next to the numeric points value on food rows */
  pointsSuffix: "pts",
  /** Unit shown after calorie values on diet list rows */
  caloriesUnit: "kcal",
  recent: "Recent",
  /** Label under the hero ring number (remaining points) */
  heroPointsLeftLabel: "pts left",
  /** When remaining points are negative */
  heroPointsOverLabel: "over budget",
  /** If parent omits microcopy on the diet hero */
  heroMicrocopyFallback: "Keep it up!",
} as const;

export const dietFoodSearchPlaceholder = 'Search food, e.g. "banana"' as const;

export const recipeDetailCopy = {
  ingredientsSection: "Ingredients",
  instructionsSection: "Instructions",
  addToDietCta: "Add to diet",
} as const;

export const logWeightCopy = {
  screenTitle: "Log weight",
  question: "What's your weight today?",
  hint: "Use your usual morning weight.",
  placeholder: "e.g. 72.5",
  unitKg: "kg",
  save: "Save",
} as const;

export const planBuildingCopy = {
  title: "Building your plan",
  subtitle: "This takes a moment. We’re tailoring it to you.",
  steps: [
    "Analyzing your goal…",
    "Building your habits…",
    "Finalizing your plan…",
  ],
  cta: "Continue",
} as const;

export const authCopy = {
  planReadyTitle: "Your plan is ready",
  planReadySubtitle:
    "We tailored your routine to fit your body and goal—so you can focus on showing up.",
  planReadyStatPrefix: "Progress outlook:",
  planReadySocialProof: "People start noticing changes within the first week",
  planReadyCta: "Continue",
  planReadyBullets: [
    "3 simple habits",
    "No calorie counting",
    "No gym required",
  ],
  howItWorkSections: [
    {
      id: 1,
      title: "Todays plan",
      description: [
        "• Walk: 10k steps",
        "• Drink: 10 glasses of water",
        "• Eat: Stay within your points",
      ].join("\n"),
      imageKey: "threeFingers",
    },
    {
      id: 2,
      title: "Points explained",
      description:
        "Foods that keep you full = fewer points\nFoods that don’t = more points",
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

/** Paywall: static SEK display until Store prices are wired */
export const paywallCopy = {
  title: "See real progress in 7 days",
  subtitle:
    "Build simple habits and finally stay consistent—without overthinking it.",

  benefits: [
    "Track your daily progress",
    "Stay within your points",
    "See your weight trend over time",
  ],

  socialProofRating: "4.9",
  socialProofRatingMax: "5",
  socialProofHeadline: "Trusted by people like you",
  socialProofMembers: "Thousands are already seeing results",

  testimonialQuote:
    "For the first time ever, I actually stuck with it. Seeing my progress each day kept me going.",
  testimonialAttribution: "— Anna, 23",

  yearlyBadge: "Most popular",
  yearlyLabel: "Yearly",
  yearlyPrice: "349 kr",
  yearlyPeriod: "/ year",

  // 🔥 viktig ändring
  yearlyPerWeekEquivalent: "Less than 1 kr/day",
  yearlyPerWeekSubline: "Save 89% vs weekly",

  // 🔥 bättre framing
  yearlyTrialBadge: "Try it free for 3 days",

  weeklyLabel: "Weekly",
  weeklyPrice: "59 kr",
  weeklyPeriod: "/ week",

  // 🔥 mer neutral (inte för säljig)
  weeklySubline: "Billed weekly",
  weeklyAnnualizedHint: "", // ← ta bort denna helt (den skrämmer bort)

  // 🔥 viktig CTA förbättring
  ctaYearlyTrial: "Start free trial",
  ctaWeekly: "Continue with weekly",

  // 🔥 mycket viktig trust-text
  trialFootnote: "No payment today · Cancel anytime",

  weeklyFootnote: "Cancel anytime",

  restorePurchases: "Restore purchases",

  // 🔥 mer emotion
  choosePlanTitle: "Start seeing results today",
} as const;

export const reminderPaywallCopy = {
  screen1: {
    headline: "Finally stay consistent with your weight loss",
    subheadline: "Try Kudoo for free and see if it works for you.",
  },
  screen2: {
    headline: "We'll send you a reminder before your free trial ends",
    body: "You'll receive a notification 2 days before your trial ends.",
  },
  screen3: {
    headline: "Unlock Kudoo to reach your goals",
    benefits: [
      "Know if you're on track every single day",
      "Stop overeating without thinking about it",
      "See your progress clearly week by week",
    ],
  },
  socialProof: {
    headline: "★★★★★ Loved by 5,000+ users",
    testimonial:
      "“It made staying consistent feel simple. I finally saw progress.”",
  },
  urgencyLine: "Start your free trial today",
  cta: "Start losing weight today",
  pricingLine: "Free for 7 days, then 129 kr/month",
  trialFootnote: "No commitment. Cancel anytime.",
  restoreCta: "Restore purchase",
  autoRenewLine: "Plan auto-renews unless you cancel.",
  cancelLine: "Cancel anytime in the App Store.",
} as const;
