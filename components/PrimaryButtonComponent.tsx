import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'
import { spacing } from '../constants/spacing'
import { textSizes, textStyles } from '../constants/texts'

const PrimaryButtonComponent = ({ title, onPress }: { title: string, onPress: () => void }  ) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{
        backgroundColor: colors.ui.primary,
        paddingVertical: spacing.md,
        borderRadius: spacing.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    }}>
      <Text style={{
        ...textStyles.primary,
        color: "#F4F4F4",
        fontWeight: 'bold',
        fontSize: textSizes.xl,
        textDecorationLine: "underline",
      }}>{title}</Text>
    </TouchableOpacity>
  )
}

export default PrimaryButtonComponent

const styles = StyleSheet.create({})