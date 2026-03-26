import { Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { globalStyles } from '../../constants/globalStyles'
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent'
import { colors } from '../../constants/colors'
import { authCopy, textSizes, textStyles } from '../../constants/texts'
import { spacing } from '../../constants/spacing'
import WheelPicker from '../../components/WheelPicker'
import ProfileStepSection from './components/ProfileStepSection'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/types'
import * as haptics from "expo-haptics";
import { MotiView } from 'moti'
import RoundedButtonComponent from '../../components/RoundedButtonComponent'
import { ReduceMotion } from 'react-native-reanimated'

const currentYear = new Date().getFullYear()
const BIRTH_YEARS = (() => {
    const list: number[] = []
    for (let y = currentYear; y >= currentYear - 110; y -= 1) list.push(y)
    return list
})()

const WEIGHT_IN_KG = (() => {
    const list: number[] = []
    for (let w = 40; w <= 120; w += 1) list.push(w)
    return list
})()

const HEIGHT_IN_CM = (() => {
    const list: number[] = []
    for (let h = 120; h <= 220; h += 1) list.push(h)
    return list
})()

const PaginationDot = React.memo(({ isActive }: { isActive: boolean }) => {
    return (
        <MotiView
            animate={{
                width: isActive ? 20 : 8,
                opacity: isActive ? 1 : 0.6,
                backgroundColor: isActive ? colors.ui.primary : colors.ui.dotInactive,
            }}
            transition={{ type: 'timing', duration: 220, reduceMotion: ReduceMotion.Never }}
            style={{
                height: 8,
                borderRadius: spacing.rounded,
            }}
        />
    )
})

PaginationDot.displayName = 'PaginationDot'

const ProfileDetailsScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [birthYear, setBirthYear] = useState<number>(currentYear - 25)
    const [weight, setWeight] = useState<number>(70)
    const [goalWeight, setGoalWeight] = useState<number>(70)
    const [height, setHeight] = useState<number>(175)
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male')
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
    const [createdPlan, setCreatedPlan] = useState<boolean>(false)
    const totalSteps = 5
    const activeIndex = step - 1
    const age = useMemo(() => {
        const computed = currentYear - birthYear
        return computed > 0 ? computed : 0
    }, [birthYear, currentYear])

    const goalDeltaKg = useMemo(() => Math.abs(weight - goalWeight), [goalWeight, weight])
    const goalDirection = useMemo<'lose' | 'gain' | 'maintain'>(() => {
        if (goalWeight < weight) return 'lose'
        if (goalWeight > weight) return 'gain'
        return 'maintain'
    }, [goalWeight, weight])


    const renderHeader = () => {
        return (
            <View style={{
                marginBottom: spacing.xl,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {step > 1 && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleBack}
                        style={{
                            position: 'absolute',
                            left: 0,
                            paddingVertical: spacing.sm,
                            paddingHorizontal: spacing.sm,
                            borderRadius: spacing.borderRadius,
                            backgroundColor: colors.ui.secondaryBackground,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{
                            ...textStyles.primary,
                            fontSize: textSizes.xl,
                            fontWeight: '700',
                            textDecorationLine: 'underline',
                        }}>
                            ←
                        </Text>
                    </TouchableOpacity>
                )}
                <Text style={{
                    ...textStyles.primary,
                    fontSize: textSizes.xxl,
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}>Profile Details</Text>
            </View>
        )
    }


    const renderBirthdayStep = () => {
        return (
            <ProfileStepSection
                title="How old are you?"
                description="Helps us keep things realistic."
                summaryIconName="person"
                summaryLabel="Selected age:"
                summaryValue={`${age}`}
            >
                <WheelPicker<number>
                    data={BIRTH_YEARS}
                    value={birthYear}
                    onChange={setBirthYear}
                    getLabel={(y) => String(y)}
                />
            </ProfileStepSection>
        )
    }

    const renderGenderStep = () => {
        return (
            <ProfileStepSection
                title="What is your gender?"
                description="Used to tailor your plan."
                summaryIconName="person"
                summaryLabel="Selected gender:"
                summaryValue={gender}
            >
                <WheelPicker<string>
                    data={['Male', 'Female', 'Other']}
                    value={gender}
                    onChange={(g) => setGender(g as 'Male' | 'Female' | 'Other')}
                    getLabel={(g) => g}
                />
            </ProfileStepSection>
        )
    }

    const renderHeightStep = () => {
        return (
            <ProfileStepSection
                title="What is your height?"
                description="Just to personalize things for you."
                summaryIconName="person"
                summaryLabel="Selected height:"
                summaryValue={`${height} cm`}
            >
                <WheelPicker<number>
                    data={HEIGHT_IN_CM}
                    value={height}
                    onChange={setHeight}
                    getLabel={(h) => String(h)}
                />
            </ProfileStepSection>
        )
    }

    const renderWeightStep = () => {
        return (
            <ProfileStepSection
                title="How much do you weigh?"
                description="No pressure — just a starting point."
                summaryIconName="person"
                summaryLabel="Selected weight:"
                summaryValue={`${weight} kg`}
            >
                <WheelPicker<number>
                    data={WEIGHT_IN_KG}
                    value={weight}
                    onChange={setWeight}
                    getLabel={(y) => String(y)}
                />
            </ProfileStepSection>
        )
    }

    const renderGoalWeightStep = () => {
        return (
            <ProfileStepSection
                title="What is your goal weight?"
                description="You can always adjust this later."
                summaryIconName="person"
                summaryLabel="Selected goal weight:"
                summaryValue={`${goalWeight} kg`}
            >
                <WheelPicker<number>
                    data={WEIGHT_IN_KG}
                    value={goalWeight}
                    onChange={setGoalWeight}
                    getLabel={(y) => String(y)}
                />
            </ProfileStepSection>
        )
    }

    const renderPlanCreated = () => {
        return (
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 350, reduceMotion: ReduceMotion.Never }}
                style={{
                    flex: 1,
                    backgroundColor: colors.ui.background,
                    paddingHorizontal: spacing.md,
                    paddingTop: spacing.xl,
                    paddingBottom: spacing.xl,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <MotiView
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 600, delay: 160, reduceMotion: ReduceMotion.Never }}
                    style={{ width: '100%', alignItems: 'center' }}
                >
                    <MotiView
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'timing', duration: 480, delay: 60, reduceMotion: ReduceMotion.Never }}
                        style={{
                            width: 220,
                            height: 220,
                            borderRadius: 110,
                            backgroundColor: colors.ui.secondaryBackground,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: spacing.xl,
                            ...globalStyles.shadow,
                            overflow: 'hidden',
                        }}
                    >
                        <Image
                            source={require('../../assets/mascot/thumbsUp.png')}
                            resizeMode="cover"
                            style={{ width: '100%', height: '100%' }}
                        />
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, translateY: 24 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 380, delay: 100, reduceMotion: ReduceMotion.Never }}
                        style={{ width: '100%' }}
                    >
                        <Text style={{
                            ...textStyles.primary,
                            fontSize: textSizes.xxxl,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: spacing.sm,
                        }}>
                            You’re all set
                        </Text>
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 340, delay: 160, reduceMotion: ReduceMotion.Never }}
                        style={{ width: '100%' }}
                    >
                        <Text style={{
                            ...textStyles.secondary,
                            textAlign: 'center',
                            paddingHorizontal: spacing.sm,
                            lineHeight: 20,
                            marginBottom: spacing.lg,
                        }}>
                           Just follow this. We’ll handle the rest.
                        </Text>
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'timing', duration: 420, delay: 210, reduceMotion: ReduceMotion.Never }}
                        style={{
                            width: '100%',
                            backgroundColor: colors.ui.componentBackground,
                            borderRadius: spacing.borderRadius,
                            padding: spacing.lg,
                            borderWidth: 1,
                            borderColor: colors.ui.cardBorder,
                            ...globalStyles.shadow,
                        }}
                    >
                        <View style={{ marginBottom: spacing.md }}>
                            <Text style={{
                                ...textStyles.primary,
                                fontSize: textSizes.md,
                                fontWeight: '700',
                                marginBottom: spacing.xs,
                            }}>
                                You’re just 4 kg away
                            </Text>
                            <Text style={{
                                ...textStyles.secondary,
                                lineHeight: 20,
                            }}>
                              That’s closer than you think.
                            </Text>
                        </View>

                        <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
                            {authCopy.planReadyBullets.map((bullet) => (
                                <View
                                    key={bullet}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        gap: spacing.sm,
                                    }}
                                >
                                    <View style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 11,
                                        backgroundColor: colors.ui.iconContainer,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: 1,
                                    }}>
                                        <Text style={{
                                            ...textStyles.primary,
                                            fontSize: textSizes.sm,
                                            fontWeight: '800',
                                            color: colors.ui.primary,
                                        }}>
                                            ✓
                                        </Text>
                                    </View>
                                    <Text style={{
                                        ...textStyles.secondary,
                                        flex: 1,
                                        lineHeight: 20,
                                    }}>
                                        {bullet}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <View
                            style={{
                                backgroundColor: colors.ui.accentSoft,
                                borderRadius: 999,
                                paddingVertical: spacing.sm,
                                paddingHorizontal: spacing.md,
                                alignSelf: 'flex-start',
                            }}
                        >
                            <Text style={{
                                ...textStyles.primary,
                                fontSize: textSizes.sm,
                                fontWeight: '700',
                            }}>
                                {authCopy.planReadySocialProof}
                            </Text>
                        </View>
                    </MotiView>
                </MotiView>

                <MotiView
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 420, delay: 380, reduceMotion: ReduceMotion.Never }}
                    style={{ width: '100%', paddingBottom: spacing.sm }}
                >
                    <PrimaryButtonComponent
                        title="Start my plan"
                        onPress={() => {
                            haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
                            navigation.navigate('MainNavigator')
                        }}
                    />
                </MotiView>
            </MotiView>
        )
    }



    const handleNext = () => {
        haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
        if (step < 5) {
            setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5)
        } else {

            setCreatedPlan(true)
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5)
            return
        }
        if (navigation.canGoBack()) navigation.goBack()
    }


    if (createdPlan) {
        return renderPlanCreated()
    }

    return (
        <View style={globalStyles.container}>
            <View style={{
                flex: 1,
                alignItems: 'center',
            }}>
                {renderHeader()}
                {step === 1 && renderBirthdayStep()}
                {step === 2 && renderGenderStep()}
                {step === 3 && renderHeightStep()}
                {step === 4 && renderWeightStep()}
                {step === 5 && renderGoalWeightStep()}
            </View>
            <View style={{
                paddingBottom: spacing.scrollViewBottomPadding
            }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: spacing.lg,
                        gap: spacing.xs,
                    }}
                >
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        <PaginationDot key={String(index)} isActive={index === activeIndex} />
                    ))}
                </View>
                <PrimaryButtonComponent
                    title={"Continue"}
                    onPress={handleNext}
                />
            </View>
        </View>
    )
}

export default ProfileDetailsScreen