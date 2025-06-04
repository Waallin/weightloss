import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { spacing } from "../../../constants/spacing";
import TopBar from "../../../components/TopBar";
import { colors } from "../../../constants/colors";
import FuelLevel from "./widgets/FuelLevel";
import { globalStyles } from "../../../constants/globalStyles";
import FuelLogs from "./widgets/FuelLogs";
import LogItem from "./components/LogItem";

const dummmyLogs = [
  {
    date: "May 20, 2025",
    engineHours: 100,
    fuelAmount: 100,
    destination: "Stockholm",
    cost: 100,
    price: 4.0,
  },
  {
    date: "April 15, 2025",
    engineHours: 85,
    fuelAmount: 75,
    destination: "Göteborg",
    cost: 75,
    price: 3.8,
  },
  {
    date: "March 10, 2025",
    engineHours: 65,
    fuelAmount: 60,
    destination: "Malmö",
    cost: 60,
    price: 3.9,
  },
  {
    date: "February 5, 2025",
    engineHours: 45,
    fuelAmount: 50,
    destination: "Uppsala",
    cost: 50,
    price: 3.7,
  },
];

const FuelScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: colors.ui.lightBlueBackground,
      }}
    >
      <SafeAreaView />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: spacing.scrollViewBottomPadding,
        }}
      >
        <TopBar title="Fuel management" />
        <View
          style={{
            ...globalStyles.container,
            flex: 1,
            marginTop: spacing.md,
            gap: spacing.md,
          }}
        >
          <FuelLevel />
          <Text style={{ ...globalStyles.smallTitle }}>Fuel logs</Text>
          {dummmyLogs.map((log) => (
            <LogItem key={log.date} log={log} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default FuelScreen;

const styles = StyleSheet.create({});
