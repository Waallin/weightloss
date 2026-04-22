import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DefaultPaywall from './components/DefaultPaywall'
import { useNavigation } from '@react-navigation/native'
const PaywallScreen = () => {
  const navigation = useNavigation();
  const handleCTAPress = () => {
    navigation.navigate("MainStack");
  }   
  return (
    <DefaultPaywall onCTAPress={handleCTAPress} />
  )
}

export default PaywallScreen

const styles = StyleSheet.create({})