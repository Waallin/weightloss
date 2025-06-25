import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import TopBar from "../../../components/TopBar";
import { spacing } from "../../../constants/spacing";
import { colors } from "../../../constants/colors";
import ServiceFilterButton from "./components/ServiceFilterButton";
import { globalStyles } from "../../../constants/globalStyles";
import ServiceItem from "./components/ServiceItem";
import ServiceProviderItem from "./components/ServiceProviderItem";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import globalApi from "../../../services/api";
import useUserStore from "../../../stores/useUserStore";
import useServiceStore from "../../../stores/useServiceStore";

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
const ServiceScreen = () => {
  const { user, mainBoat } = useUserStore();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const {
    services,
    setServices,
    filterServicesWithCategory,
    filteredServices,
  } = useServiceStore();
  const navigation = useNavigation();

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);
    filterServicesWithCategory(filter);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const endpoint = `boats/${mainBoat()?.id}/services`;
    const response = await globalApi("GET", endpoint, null, user.token);
    setServices(response.data.services);
    filterServicesWithCategory("All");
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
          <TopBar title="Services" />
        </View>
        <View style={{ ...globalStyles.container, flex: 1 }}>
          <View style={{ marginTop: spacing.md }}>
            <FlatList
              data={filterOptions}
              renderItem={({ item }) => (
                <ServiceFilterButton
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
            {filteredServices?.map((item: any, index: number) => (
              <ServiceItem key={index} item={item} />
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
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 120,
          right: 40,
          backgroundColor: colors.ui.darkBlue,
          padding: spacing.md,
          borderRadius: spacing.borderRadius,
        }}
        onPress={() => navigation.navigate("AddService")}
      >
        <Ionicons name="add" size={24} color={colors.ui.white} />
      </TouchableOpacity>
    </View>
  );
};

export default ServiceScreen;

const styles = StyleSheet.create({});
