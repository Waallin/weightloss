import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView, MotiText } from 'moti';
import { colors } from '../../../constants/colors';
import { spacing } from '../../../constants/spacing';
import { ReduceMotion } from 'react-native-reanimated';
import { textSizes, textStyles } from '../../../constants/texts';

interface ProfileStepSectionProps {
  title: string;
  description: string;
  summaryIconName: React.ComponentProps<typeof MaterialIcons>['name'];
  summaryLabel: string;
  summaryValue: string;
  children: React.ReactNode;
}

const ProfileStepSection: React.FC<ProfileStepSectionProps> = ({
  title,
  description,
  summaryIconName,
  summaryLabel,
  summaryValue,
  children,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 18 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 380, reduceMotion: ReduceMotion.Never }}
      style={{
        width: '100%',
        flex: 1,
      }}
    >
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 420, delay: 60, reduceMotion: ReduceMotion.Never }}
      >
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 410, delay: 80, reduceMotion: ReduceMotion.Never }}
          style={{
            alignItems: 'center',
            gap: spacing.md,
          }}
        >
          <MotiText
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 450, delay: 120, reduceMotion: ReduceMotion.Never }}
            style={{
              ...textStyles.primary,
              fontSize: textSizes.xxl,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {title}
          </MotiText>
          <MotiView
            from={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 440, delay: 200, reduceMotion: ReduceMotion.Never }}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,
              borderRadius: spacing.borderRadius,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.xs,
              width: '80%',
            }}
          >
            <MotiText
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 440, delay: 230, reduceMotion: ReduceMotion.Never }}
              style={{
                ...textStyles.secondary,
                fontSize: textSizes.md,
                color: colors.text.primary,
                textAlign: 'center',
              }}
            >
              {description}
            </MotiText>
          </MotiView>
        </MotiView>
      </MotiView>

      <MotiView
        from={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 430, delay: 200, reduceMotion: ReduceMotion.Never }}
        style={{
          width: '100%',
          gap: spacing.md,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {children}
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 14 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 450, delay: 250, reduceMotion: ReduceMotion.Never }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          marginBottom: spacing.xl,
        }}
      >
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'timing', duration: 360, delay: 320, reduceMotion: ReduceMotion.Never }}
        >
          <MaterialIcons name={summaryIconName} size={18} color={colors.text.secondary} />
        </MotiView>
        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 420, delay: 350, reduceMotion: ReduceMotion.Never }}
          style={{
            ...textStyles.secondary,
            fontSize: textSizes.md,
            color: colors.text.secondary,
          }}
        >
          {summaryLabel}{' '}
          <Text
            style={{
              ...textStyles.primary,
              fontSize: textSizes.md,
              fontWeight: 'bold',
            }}
          >
            {summaryValue}
          </Text>
        </MotiText>
      </MotiView>
    </MotiView>
  );
};

export default ProfileStepSection;
