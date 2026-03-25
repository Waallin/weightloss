import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { spacing } from '../../../../constants/spacing'
import { colors } from '../../../../constants/colors'
import { globalStyles } from '../../../../constants/globalStyles'
import { textSizes } from '../../../../constants/texts'
import { textStyles } from '../../../../constants/texts'

const DailyTipsComponent = ({ title, description, emoji, color, image }: { title: string, description: string, emoji: string, color: string, image: string }) => {
  const imageSource = image ? { uri: image } : require('../../../../assets/walking.png');
  return (
    <View style={{
      backgroundColor: color,
      width: 300,
      height: 160,
      borderRadius: spacing.borderRadius,
      padding: spacing.md,
      gap: spacing.sm,
      flexDirection: 'row',
    }}>
      <View
        style={{

          width: "50%",
          flexDirection: 'column',
          gap: spacing.md,
        }}>
        <Text style={{ ...textStyles.primary, fontSize: textSizes.lg, fontWeight: 'bold', color: colors.ui.white }}>{title}</Text>
        <Text style={{ ...textStyles.secondary, fontSize: textSizes.sm, color: colors.ui.white }}>{description}</Text>
      </View>
      <View style={{
        width: "50%",
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image source={imageSource} style={{ width: 150, height: 150, borderRadius: spacing.borderRadius }} />
      </View>
    </View>
  )
}

export default DailyTipsComponent

const styles = StyleSheet.create({})