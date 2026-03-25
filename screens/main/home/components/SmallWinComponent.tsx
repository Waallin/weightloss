import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../../../constants/colors'
import { spacing } from '../../../../constants/spacing'
import { globalStyles } from '../../../../constants/globalStyles'
import { textSizes, textStyles } from '../../../../constants/texts'

const SmallWinComponent = ({ title, description }: { title: string, description: string }) => {
    return (
        <View style={{
            backgroundColor: colors.ui.componentBackground,
            borderRadius: spacing.borderRadius,
            padding: spacing.md,
            ...globalStyles.shadow,
            width: "45%",
            height: 120,
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
        }}>
            <View>
                <Text style={{ fontSize: textSizes.xxxl }}>
                    👏
                </Text>
            </View>
                <View style={{
                flexDirection: 'column',
                gap: spacing.xs,
            }}>
                <Text style={{ ...textStyles.primary, fontSize: textSizes.md, fontWeight: 'bold', textAlign: 'center' }}>{title}</Text>
                <Text style={{ ...textStyles.secondary, fontSize: textSizes.sm, textAlign: 'center' }}   >{description}</Text>
            </View>
        </View>
    )
}

export default SmallWinComponent

const styles = StyleSheet.create({});