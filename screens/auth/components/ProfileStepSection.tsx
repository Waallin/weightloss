import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';
import { spacing } from '../../../constants/spacing';
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
    <View
      style={{
        width: '100%',
        flex: 1,
      }}
    >
      <View>
        <View
          style={{
            alignItems: 'center',
            gap: spacing.md,
          }}
        >
          <Text
            style={{
              ...textStyles.primary,
              fontSize: textSizes.xxl,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {title}
          </Text>
          <View
            style={{
              backgroundColor: colors.ui.secondaryBackground,
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
            <Text
              style={{
                ...textStyles.secondary,
                fontSize: textSizes.md,
                color: colors.text.primary,
                textAlign: 'center',
              }}
            >
              {description}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
         
          width: '100%',
          gap: spacing.md,
          flex: 1,

          justifyContent: 'center',
        }}
      >
        {children}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          marginBottom: spacing.xl,
        }}
      >
        <MaterialIcons name={summaryIconName} size={18} color={colors.text.secondary} />
        <Text
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
        </Text>
      </View>
    </View>
  );
};

export default ProfileStepSection;

