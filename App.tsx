import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { AuthNavigator } from "./screens/navigation/AuthNavigator";
import { globalStyles } from "./constants/globalStyles";
export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <AuthNavigator />
    </View>
  );
}
