import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../../../constants/colors";
import { globalStyles } from "../../../../constants/globalStyles";
import { spacing } from "../../../../constants/spacing";
import * as Haptics from "expo-haptics";
const SegmentedControl = ({
  values,
  selectedIndex,
  onChange,
}: {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}) => {
  const handlePress = async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(index);
  };
  return (
    <View style={styles.container}>
      {values.map((value, index) => (
        <TouchableOpacity
          style={[
            styles.button,
            selectedIndex === index ? styles.selected : styles.unselected,
          ]}
          key={index}
          onPress={() => handlePress(index)}
        >
          <Text
            style={{
              ...globalStyles.smallText,
              color: colors.ui.darkBlue,
              fontWeight: "600",
            }}
          >
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SegmentedControl;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.ui.lightGrey,
    ...globalStyles.cardShadow,
    borderRadius: spacing.borderRadius,
  },

  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: spacing.borderRadius,
  },

  selected: {
    backgroundColor: colors.ui.white,
  },
  unselected: {
    backgroundColor: colors.ui.lightGrey,
  },
});
