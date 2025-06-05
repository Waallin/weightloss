import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
} from "react-native";
import React, { useState, useRef } from "react";
import { spacing } from "../../../constants/spacing";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import MapView from "react-native-maps";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import SegmentedControl from "../../../components/SegmentedControl";
import HistoryItem from "./components/HistoryItem";
import NearbyItem from "./components/NearbyItem";
import TopBar from "../../../components/TopBar";
const dummyHistory = [
  {
    id: 1,
    location: "Marina Bay",
    coordinates: "1.17°N 103.51°E",
    status: "docked",
    time: "5m ago",
    date: "2025-01-01",
  },
  {
    id: 2,
    location: "Sentosa Cove",
    coordinates: "1.24°N 103.82°E",
    status: "sailing",
    time: "2h ago",
    date: "2025-01-01",
  },
  {
    id: 3,
    location: "Keppel Bay",
    coordinates: "1.26°N 103.81°E",
    status: "anchor",
    time: "1d ago",
    date: "2024-12-31",
  },
  {
    id: 4,
    location: "Pulau Ubin",
    coordinates: "1.41°N 103.96°E",
    status: "docked",
    time: "3d ago",
    date: "2024-12-29",
  },
];

const dummyNearby = [
  {
    id: 1,
    name: "Marina Bay Fuel Station",
    coordinates: "1.17°N 103.51°E",
    type: "fuel",
    distance: "1.2km",
  },
  {
    id: 2,
    name: "Sentosa Cove Marina",
    coordinates: "1.24°N 103.82°E",
    type: "restaurant",
    distance: "2.5km",
  },
  {
    id: 3,
    name: "Keppel Bay Marina",
    coordinates: "1.26°N 103.81°E",
    type: "marina",
    distance: "3.1km",
  },
  {
    id: 4,
    name: "Pulau Ubin Harbor",
    coordinates: "1.41°N 103.96°E",
    type: "marina",
    distance: "4.8km",
  },
  {
    id: 5,
    name: "Raffles Marina",
    coordinates: "1.32°N 103.63°E",
    type: "marina",
    distance: "5.2km",
  },
];

const LocationScreen = () => {
  const [mapExpanded, setMapExpanded] = useState(true);
  const animatedHeight = useRef(new Animated.Value(500)).current;
  const [selectedSegment, setSelectedSegment] = useState(0);

  const handleExpandMap = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const toValue = mapExpanded ? 300 : 500;

    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setMapExpanded(!mapExpanded);
  };
  const renderMap = () => {
    return (
      <View>
        <Animated.View
          style={{
            height: animatedHeight,
            marginTop: spacing.md,
            width: "100%",
            backgroundColor: colors.ui.lightBlueBackground,
          }}
        >
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 36.48813,
              longitude: -4.94883,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          />
        </Animated.View>
        <TouchableOpacity
          onPress={handleExpandMap}
          activeOpacity={0.8}
          style={{
            backgroundColor: colors.ui.white,
            flexDirection: "row",
            justifyContent: "center",
            gap: spacing.xs,
            alignItems: "center",
            padding: spacing.sm,
            borderRadius: spacing.borderRadius,
            ...globalStyles.cardShadow,
          }}
        >
          <Text style={{ ...globalStyles.xSmallText }}>
            {mapExpanded ? "Collapse map" : "Expand map"}
          </Text>
          <Entypo
            name={mapExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={colors.ui.border}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCurrentLocation = () => {
    return (
      <View style={{ marginTop: spacing.md }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
              Current location
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.ui.lightBlue,
              padding: spacing.sm,
              borderRadius: spacing.borderRadius,

              alignItems: "center",
              gap: spacing.xs,
            }}
          >
            <AntDesign
              name="clockcircleo"
              size={16}
              color={colors.ui.darkBlue}
            />
            <Text style={{ ...globalStyles.xSmallText }}>5m ago</Text>
          </View>
        </View>
        <View style={{ marginTop: spacing.md }}>
          <Text
            style={{
              ...globalStyles.smallText,
              fontWeight: "bold",
              color: "black",
            }}
          >
            Playa de Puerto Banus
          </Text>
          <Text style={{ ...globalStyles.xSmallText, marginTop: spacing.xs }}>
            1.17°N 103.51°E
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,
            marginTop: spacing.md,
          }}
        >
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: colors.boatStatus.docked,
              borderRadius: 10,
            }}
          />
          <Text style={{ ...globalStyles.xSmallText, fontWeight: "bold" }}>
            Docked
          </Text>
        </View>
      </View>
    );
  };

  const renderSegmentedControl = () => {
    return (
      <View style={{ marginTop: spacing.md }}>
        <SegmentedControl
          values={["History", "Nearby"]}
          selectedIndex={selectedSegment}
          onChange={setSelectedSegment}
        />
        <View style={{ marginTop: spacing.md }}>
          {selectedSegment === 0 && (
            <View style={{ gap: spacing.sm }}>
              {dummyHistory.map((item) => (
                <HistoryItem key={item.id} item={item} />
              ))}
            </View>
          )}
          {selectedSegment === 1 && (
            <View style={{ gap: spacing.sm }}>
              {dummyNearby.map((item) => (
                <NearbyItem key={item.id} item={item} />
              ))}
            </View>
          )}
        </View>
      </View>
    );
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
          <TopBar title="Location" />
        </View>
        {renderMap()}
        <View
          style={{
            ...globalStyles.container,
            backgroundColor: colors.ui.lightBlueBackground,
          }}
        >
          {renderCurrentLocation()}
          {renderSegmentedControl()}
        </View>
      </ScrollView>
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({});
