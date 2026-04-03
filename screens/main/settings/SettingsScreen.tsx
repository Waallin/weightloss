import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { textSizes } from "../../../constants/texts";
const SettingsScreen = () => {

  const renderCommingSoonComponent = () => {
    return (
      <View style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: spacing.lg,
        gap: spacing.sm,
        backgroundColor: colors.ui.componentBackground,
        borderRadius: spacing.borderRadius,
        padding: spacing.md,
        ...globalStyles.shadow,
      }}>
        <Text style={{
          fontSize: textSizes.lg,
          fontWeight: "bold",
          color: colors.text.primary,
        }}>Coming soon</Text>
        <Text style={{
          fontSize: textSizes.sm,
          color: colors.text.secondary,
          textAlign: "center",
        }}>We're working on this feature right now. Please check back soon!</Text>
      </View>
    );
  };
  return (
    <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={globalStyles.scrollContainer}
    style={{
      ...globalStyles.container,
    }}
    >
      {renderCommingSoonComponent()}
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
