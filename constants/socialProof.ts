import { colors } from "./colors";
import { testimonialWeight } from "../utils/region";
import type { SocialProofTestimonial } from "../screens/auth/components/SocialProofItem";

// Visas medan kontot skapas efter åldersfrågan
export const loadingTestimonial: SocialProofTestimonial = {
  name: "Sara L.",
  role: "Kudoo user",
  rating: 4.9,
  ratingMax: 5,
  headline: "Feeling lighter in the first week",
  highlights: ["Feeling lighter"],
  quote: `“I only planned to try the free trial. Three months later I’m down ${testimonialWeight(34, "lbs")}.”`,
  avatarColor: colors.ui.listRowIconBackground,
  avatarImage: require("../assets/users/sara.jpg"),
};
