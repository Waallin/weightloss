import { Text, TouchableOpacity, View } from "react-native";
import * as haptics from "expo-haptics";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/texts";
import { globalStyles } from "../constants/globalStyles";

function UnitToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignSelf: "center",
        padding: spacing.xs,
        backgroundColor: colors.ui.secondaryBackground,
        borderRadius: spacing.borderRadius,
      }}
    >
      {options.map((option) => {
        const active = value === option;
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.85}
            onPress={() => {
              if (value === option) return;
              haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
              onChange(option);
            }}
            style={{
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.lg,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: spacing.borderRadius,
              backgroundColor: active ? colors.ui.white : "#E3E3E9",
              borderWidth: active ? 1 : 0,
              borderColor: colors.ui.cardBorder,
              ...(active ? globalStyles.shadow : {}),
            }}
          >
            <Text
              style={{
                ...(active ? typography.bodySemiBold : typography.body),
                color: active ? colors.text.primary : colors.text.secondary,
              }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default UnitToggle;
