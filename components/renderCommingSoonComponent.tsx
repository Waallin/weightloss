import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { globalStyles } from '../constants/globalStyles';
import { typography } from '../constants/texts';

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
          ...typography.titleBold,
          color: colors.text.primary,
        }}>Coming soon</Text>
        <Text style={{
          ...typography.body,
          color: colors.text.secondary,
          textAlign: "center",
        }}>We're working on this feature right now. Please check back soon!</Text>
      </View>
    );
  };
export default renderCommingSoonComponent

const styles = StyleSheet.create({})