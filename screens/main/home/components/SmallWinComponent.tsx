import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../../../constants/colors'
import { spacing } from '../../../../constants/spacing'
import { globalStyles } from '../../../../constants/globalStyles'
import { typography } from '../../../../constants/texts'

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
                <Text style={{ ...typography.emojiLarge }}>
                    👏
                </Text>
            </View>
                <View style={{
                flexDirection: 'column',
                gap: spacing.xs,
            }}>
                <Text style={{ ...typography.cardTitle, color: colors.text.primary, textAlign: 'center' }}>{title}</Text>
                <Text style={{ ...typography.body, color: colors.text.secondary, textAlign: 'center' }}>{description}</Text>
            </View>
        </View>
    )
}

export default SmallWinComponent

const styles = StyleSheet.create({});