import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { spacing } from '../../../../constants/spacing';
import { colors } from '../../../../constants/colors';
import { dietLabels, textStyles } from '../../../../constants/texts';
import { globalStyles } from '../../../../constants/globalStyles';
const FoodItem = (
  {
    name,
    portion,
    kudos,
    grams,
    onPress,
    image,
  }: {
    name: string;
    portion: string;
    kudos: string;
    grams: number;
    onPress: () => void;
    image: string;
  }
) => {
  const thumbSize = spacing.lg * 2 + spacing.sm;

  return (
    <TouchableOpacity
    
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        gap: spacing.md,
        borderRadius: spacing.borderRadius,
        backgroundColor: colors.ui.componentBackground,
        ...globalStyles.shadow,
      }}
    >
      <View
        style={{
          width: thumbSize,
          height: thumbSize,
          borderRadius: spacing.borderRadius,
          overflow: 'hidden',
          backgroundColor: colors.ui.white,
          borderWidth: 1,
          borderColor: colors.ui.cardBorder,
        }}
      >
        <Image
          source={image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <Text style={textStyles.listItemTitle} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[textStyles.listItemMeta, { marginTop: spacing.xs }]}>
          {portion} · {grams} {dietLabels.gramsUnit}
        </Text>
        <Text style={{ marginTop: spacing.sm }}>
          <Text style={textStyles.listItemEmphasis}>{kudos}</Text>
          <Text style={textStyles.listItemMeta}> {dietLabels.kudos}</Text>
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text.primary} />
    </TouchableOpacity>
  )
}

export default FoodItem