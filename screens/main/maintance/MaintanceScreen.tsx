import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import TopBar from "../../../components/TopBar";
import { spacing } from "../../../constants/spacing";
import { colors } from "../../../constants/colors";
import MaintanceFilterButton from "./components/MaintanceFilterButton";
import { globalStyles } from "../../../constants/globalStyles";
import MaintanceItem from "../maintance/components/MaintanceItem";
import ServiceProviderItem from "./components/ServiceProviderItem";

const filterOptions = [
  {
    id: 1,
    title: "All",
  },
  {
    id: 2,
    title: "Engine",
  },
  {
    id: 3,
    title: "Propeller",
  },
  {
    id: 4,
    title: "Hull",
  },
  {
    id: 5,
    title: "Electrical",
  },
];

const dummyData = [
  {
    id: 1,
    title: "Engine Service",
    description: "Regular maintenance check",
    status: "Upcoming",
    date: "2021-01-01",
  },
  {
    id: 2,
    title: "Propeller Repair",
    description: "Fix damaged propeller blade",
    status: "In Progress",
    date: "2021-01-01",
  },
  {
    id: 3,
    title: "Hull Cleaning",
    description: "Remove barnacles and algae",
    status: "Completed",
    date: "2021-01-01",
  },
  {
    id: 4,
    title: "Electrical System",
    description: "Check battery and wiring",
    status: "Scheduled",
    date: "2021-01-01",
  },
  {
    id: 5,
    title: "Navigation Lights",
    description: "Replace broken port light",
    status: "Pending",
    date: "2021-01-01",
  },
];

const dummyServiceProvider = [
  {
    id: 1,
    name: "John Doe",
    title: "Marina Boatyard",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Maria Svensson",
    title: "Maritime Workshop",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Anders Nilsson",
    title: "Boat Tech AB",
    rating: 4.2,
  },
];
const MaintanceScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);
  };

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
        <View style={{ paddingHorizontal: spacing.md }}>
          <TopBar title="Maintance" />
        </View>
        <View style={{ ...globalStyles.container, flex: 1 }}>
          <View style={{ marginTop: spacing.md }}>
            <FlatList
              data={filterOptions}
              renderItem={({ item }) => (
                <MaintanceFilterButton
                  item={item}
                  onPress={() => handleFilter(item.title)}
                  selectedFilter={selectedFilter}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: spacing.md,
              }}
            />
          </View>
          <View style={{ flex: 1, marginTop: spacing.md, gap: spacing.md }}>
            {dummyData.map((item) => (
              <MaintanceItem key={item.id} item={item} />
            ))}
            <Text style={{ ...globalStyles.smallTitle }}>
              Service Providers
            </Text>
            {dummyServiceProvider.map((item) => (
              <ServiceProviderItem key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MaintanceScreen;

const styles = StyleSheet.create({});
