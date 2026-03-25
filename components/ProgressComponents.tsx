import { Text, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'
import { fonts } from '../constants/fonts'
import { globalStyles } from '../constants/globalStyles'
import { spacing } from '../constants/spacing'
import { textSizes, textStyles } from '../constants/texts'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const ICON_CONTAINER_SIZE = 40

const ProgressComponents = (
  {
    title,
    description,
    icon,
    number,
  }: {
    title: string
    description: string
    icon: string
    number: string
  }
) => {
  return (
    <View style={{
      backgroundColor: colors.ui.componentBackground,
      borderWidth: 0,
      ...globalStyles.shadow,
      borderRadius: spacing.borderRadius * 1.5,
      width: '47%',
      padding: spacing.md,
      gap: spacing.sm,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
      }}>
        <View
          style={{
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            borderRadius: ICON_CONTAINER_SIZE / 2,
            backgroundColor: colors.ui.iconContainer,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialCommunityIcons name={icon as any} size={24} color={colors.ui.primary} />
        </View>
        <Text style={{
          ...textStyles.primary,
          fontWeight: 'bold',
          fontSize: textSizes.md,
        }}>
          {title}
        </Text>
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing.xs,
      }}>
        <Text style={{
          ...textStyles.primary,
          fontFamily: fonts.primary.bold,
          fontSize: textSizes.xxxl,
        }}>
          {number}
        </Text>
        <Text style={{
          ...textStyles.secondary,
          fontSize: textSizes.xs,
        }}>
          {description}
        </Text>
      </View>
    </View>
  )
}

export default ProgressComponents