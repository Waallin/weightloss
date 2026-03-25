import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../constants/colors";
import { globalStyles } from "../../constants/globalStyles";
import { spacing } from "../../constants/spacing";
import { useNavigation } from "@react-navigation/native";

const AuthScreen = () => {
  const navigation = useNavigation();
  const contiune = () => {
    navigation.navigate("MainStack");
  };
  return (
    <View>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({});
