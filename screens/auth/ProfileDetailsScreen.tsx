import { Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { globalStyles } from '../../constants/globalStyles'
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent'
import { colors } from '../../constants/colors'
import { textSizes, textStyles } from '../../constants/texts'
import { spacing } from '../../constants/spacing'
import WheelPicker from '../../components/WheelPicker'
import ProfileStepSection from './components/ProfileStepSection'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/types'

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

const ProfileDetailsScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [birthYear, setBirthYear] = useState<number>(currentYear - 25)
    const [weight, setWeight] = useState<number>(70)
    const [goalWeight, setGoalWeight] = useState<number>(70)
    const [height, setHeight] = useState<number>(175)
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male')
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
    const age = useMemo(() => {
        const computed = currentYear - birthYear
        return computed > 0 ? computed : 0
    }, [birthYear, currentYear])


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
                title="What year were you born?"
                description="This helps us adjust your personal plan."
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
                description="This helps us adjust your personal plan."
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
                description="This helps us adjust your personal plan."
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
                description="This helps us adjust your personal plan."
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
                description="This helps us adjust your personal plan."
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



    const handleNext = () => {
        if (step < 5) {
            setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5)
        } else {
            navigation.navigate('MainStack')
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5)
            return
        }
        if (navigation.canGoBack()) navigation.goBack()
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
                paddingBottom: 50
            }}>
                <PrimaryButtonComponent
                    title={"Continue"}
                    onPress={handleNext}
                />
            </View>
        </View>
    )
}

export default ProfileDetailsScreen