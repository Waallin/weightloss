import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
const DashboardScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View
      style={{
        ...globalStyles.container,
        backgroundColor: colors.ui.lightBlueBackground,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Text style={{ color: colors.text.primary }}>go to profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;
const styles = StyleSheet.create({});
