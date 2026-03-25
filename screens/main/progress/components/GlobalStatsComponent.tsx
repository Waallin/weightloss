import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { spacing } from '../../../../constants/spacing'
import { colors } from '../../../../constants/colors'
import { globalStyles } from '../../../../constants/globalStyles'
import { textSizes } from '../../../../constants/texts'

const GlobalStatsComponent = ({ title, description, icon }: { title: string, description: string, icon: string }) => {

    return (
        <View style={{
            flexDirection: 'row',
            gap: spacing.md,
            backgroundColor: colors.ui.white,
            borderRadius: spacing.borderRadius,
            padding: spacing.md,
            ...globalStyles.shadow,
            width: '100%',
            height: 100,
            alignItems: 'center',
        }}>
            <View style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                backgroundColor: colors.ui.iconContainer,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{ fontSize: textSizes.xxxl, fontWeight: 'bold' }}>{icon}</Text>
            </View>
            <View style={{
                flexDirection: 'column',
                gap: spacing.sm,
            }}>
                <Text style={{ fontSize: textSizes.lg, fontWeight: 'bold' }}>{title}</Text>
                <Text style={{ fontSize: textSizes.sm, color: colors.text.secondary }}>{description}</Text>

            </View>
        </View>
    )
}

export default GlobalStatsComponent

const styles = StyleSheet.create({})