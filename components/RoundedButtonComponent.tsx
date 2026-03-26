import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { spacing } from '../constants/spacing'
import { colors } from '../constants/colors'
import { fonts } from '../constants/fonts'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const RoundedButtonComponent = ({ handleNext, icon }: { handleNext: () => void, icon: string }) => {
  return (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleNext}
        style={{
          alignSelf: "center",
         
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: spacing.rounded,
            backgroundColor: colors.ui.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              borderRadius: spacing.rounded,
              backgroundColor: colors.ui.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.primary.medium,
                fontSize: 35,
                color: colors.ui.background,
              }}
            >
              <MaterialCommunityIcons name={icon as any} size={32} color="white" />
            </Text>
          </View>
        </View>
      </TouchableOpacity>
  )
}

export default RoundedButtonComponent

const styles = StyleSheet.create({})