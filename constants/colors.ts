export const colors = {
  ui: {
    white: "#FFFFFF",
    background: "#F6F6F5",
    componentBackground: "white",
    primary: "#16B97B",
    /** Paywall yearly plan — very subtle diagonal gradient when selected */
    paywallYearlySelectedGradientStart: "#1FC593",
    paywallYearlySelectedGradientEnd: "#119E6E",
    /** Paywall “Try it free…” strip — selected: brighter / more filled gradient */
    paywallTrialStripGradientStart: "rgba(255,255,255,0.58)",
    paywallTrialStripGradientMid: "rgba(255,255,255,0.38)",
    paywallTrialStripGradientEnd: "rgba(255,255,255,0.26)",
    paywallTrialStripBorderSelected: "rgba(255,255,255,0.55)",
    /** Unselected yearly card: subtle mint fill + border */
    paywallTrialStripUnselectedFill: "rgba(22, 185, 123, 0.14)",
    paywallTrialStripBorderUnselected: "rgba(22, 185, 123, 0.32)",
    /** Diet hero summary (gradient card) */
    dietHeroGradientStart: "#3DD68C",
    dietHeroGradientEnd: "#0A8F5E",
    secondaryBackground: "#F0F4F6",
    accentSoft: "#FFEFF4",
    dotInactive: "#E0DEFF",
    iconContainer: "#F5F3FF",
    cardBorder: "#EDECF5",
    /** Settings / profile list rows: icon circle + default icon tint (MaterialCommunityIcons) */
    listRowIconBackground: "#ECFDF5",
    listRowIconTint: "#22C55E",
    /** Diet food row — soft fill behind points chip */
    foodPointsChipBackground: "rgba(22, 185, 123, 0.12)",
    delete: "#EF4444",
    grey: "#F3F4F6",
    /** Diet hero + Progress gauge — neutral ring track */
    circularGaugeTrack: "#F3F1EC",

    primarySoft: "#D7E3FC",  // new soft blue
    /** Progress calendar — subtle fill for each day in journey range (start → today) */
    calendarDayInRangeBackground: "#EEF0F3",
    /** Calendar: weight-logged dot — saturated blue for contrast on white + goal (green) cells */
    weightDot: "#64748B",
    success: "#B7EFC5",      // new soft green
    info: "#A0CED9",         // new soft cyan
    warning: "#FFE5B4",      // new soft mint/yellow

    shadow: "#212121",

    gradientStart: "#FFE8F2",
    gradientEnd: "#E5F0FF",

    /** Progress card — claim overlay dim */
    progressClaimOverlay: "rgba(59, 53, 81, 0.52)",
    /** Progress card — goal reached (text / bar on mint gradient) */
    progressCompleteTextMuted: "rgba(255,255,255,0.9)",
    progressCompleteIconTint: "#FFFFFF",
    progressCompleteIconBackground: "rgba(255,255,255,0.28)",
    progressCompleteBarTrack: "rgba(255,255,255,0.38)",
    progressCompleteBarFill: "#FFFFFF",

    /** Paywall — dark “Snapchat-like” theme tokens */
    paywallBackgroundDark: "#0B0C0E",
    paywallSurfaceDark: "#14161A",
    paywallSurfaceBorderDark: "rgba(255,255,255,0.10)",
    paywallDividerDark: "rgba(255,255,255,0.08)",
    paywallTextPrimaryOnDark: "rgba(255,255,255,0.92)",
    paywallTextSecondaryOnDark: "rgba(255,255,255,0.64)",
    /** Snapchat-inspired CTA yellow (adjusted slightly for readability) */
    paywallCtaYellow: "#FFFC00",
    paywallCtaTextOnYellow: "#0B0C0E",
    paywallSelectedOutline: "rgba(255,255,255,0.22)",
    paywallBadgeFill: "rgba(255,255,255,0.10)",
  },
  text: {
    primary: "#3B3551",
    secondary: "#969598",
  },
  /** Celebration confetti — vivid, readable on light UI */
  confetti: {
    coral: "#FF6B6B",
    sunshine: "#FFD93D",
    mint: "#3DD68C",
    sky: "#4D96FF",
    violet: "#9B59B6",
    rose: "#FF8CC8",
  },
};

export const confettiPalette: string[] = [
  colors.confetti.coral,
  colors.confetti.sunshine,
  colors.confetti.mint,
  colors.confetti.sky,
  colors.confetti.violet,
  colors.confetti.rose,
];
