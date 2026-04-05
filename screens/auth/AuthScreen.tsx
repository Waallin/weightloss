import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../constants/globalStyles';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { Image, ScrollView } from 'react-native';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import { textSizes, textStyles } from '../../constants/texts';
import { useNavigation } from '@react-navigation/native';

const IMAGE_SIZE = 250;

const AuthScreen = () => {
  const navigation = useNavigation();
  const handleCTAPress = () => {
    navigation.navigate("PermissionScreen");
  };

  const renderImage = () => {
    return (
      <View style={{

        justifyContent: "center"
      }}>
      <View
        style={[
          {
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            borderRadius: IMAGE_SIZE / 2,
            backgroundColor: colors.ui.secondaryBackground,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.xl,
            ...globalStyles.shadow,
            overflow: "hidden",
            alignSelf: "center",
          },
        ]}
      >
        <Image
          source={require("../../assets/mascot/thumbsUp.png")}
          resizeMode="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      </View>
    );
  };

  const renderText = () => {
    return (
      <View style={{

        justifyContent: "center",
        alignItems: "center"
      }}>
        <Text style={{
          ...textStyles.primary,
          fontSize: textSizes.xxxl,
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: spacing.sm,
        }}>You're almost ready</Text>
        <Text style={{
          ...textStyles.secondary,
          fontSize: textSizes.sm,
          textAlign: "center",
          marginBottom: spacing.sm,
        }}>Create your account in seconds</Text>
      </View>
    );
  };
  const renderCTA = () => {
    return (
      <View style={{
     
      }}>
        <PrimaryButtonComponent color={colors.ui.white} backgroundColor={"black"} title="Log in with apple" onPress={handleCTAPress} />
      </View>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
      ...globalStyles.scrollContainer,
      justifyContent: "center",
      
    }} style={globalStyles.container}>
      {renderImage()}
      {renderText()}
      {renderCTA()}
    </ScrollView>
  )
}

export default AuthScreen

const styles = StyleSheet.create({})