import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { spacing } from '../../../../constants/spacing';
import { colors } from '../../../../constants/colors';
import { fonts } from '../../../../constants/fonts';
import { globalStyles } from '../../../../constants/globalStyles';
const FoodItem = (
  {
    name,
    portion,
    kudos,
    grams,
    onPress,
    image,
    icon,
  }: {
    name: string;
    portion: string;
    kudos: string;
    grams: number;
    onPress: () => void;
    image: string;
    icon?: string | null;
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
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
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
        <Text
          numberOfLines={1}
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            color: colors.text.primary,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            marginTop: spacing.xs,
            fontFamily: fonts.primary.regular,
            fontSize: 14,
            color: colors.text.secondary,
          }}
        >
           {grams} g · {portion}
        </Text>
        <Text style={{ marginTop: spacing.sm }}>
          <Text
            style={{
              fontFamily: fonts.primary.medium,
              fontWeight: 'bold',
              fontSize: 14,
              color: colors.text.primary,
            }}
          >
            {kudos}
          </Text>
          <Text
            style={{
              fontFamily: fonts.primary.regular,
              fontWeight: 'bold',
              fontSize: 14,
              color: colors.text.primary,
            }}
          >
            {' pts'}
          </Text>
        </Text>
      </View>
      {icon && (
      <View style={{
          backgroundColor: colors.ui.primary,
        borderRadius: spacing.rounded,
        padding: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.ui.white} />
      </View>
      )}
    </TouchableOpacity>
  )
}

export default FoodItem