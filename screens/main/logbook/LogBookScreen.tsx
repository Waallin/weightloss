import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import TopBar from "../../../components/TopBar";
import { globalStyles } from "../../../constants/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import StatusIcon from "../../../components/StatusIcon";
import RecentTripItem from "./components/RecentTripItem";

const dummyTrips = [
  {
    id: 1,
    start: "2025-01-01",
    distance: 200,
    time: 2,
    from: "West Coast Road",
    to: "Cape Town",
    status: "active",
  },
  {
    id: 2,
    start: "2025-01-02",
    distance: 150,
    time: 1.5,
    from: "Johannesburg",
    to: "Pretoria",
    status: "completed",
  },
  {
    id: 3,
    start: "2025-01-03",
    distance: 300,
    time: 3,
    from: "Durban",
    to: "Port Elizabeth",
    status: "completed",
  },
];

const LogBookScreen = () => {
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [tripTime, setTripTime] = useState(25);

  const startTrip = () => {
    setIsTripStarted(true);
  };

  const endTrip = () => {
    setIsTripStarted(false);
  };

  const returnStartTrip = () => {
    if (isTripStarted) {
      return (
        <View>
          <LinearGradient
            colors={["#2B5580", "#1B416B"]}
            style={{
              padding: spacing.md,
              borderRadius: spacing.borderRadius,

              gap: spacing.sm,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <StatusIcon status="active" />
                <Text style={{ ...globalStyles.smallText, color: "white" }}>
                  Active trip
                </Text>
              </View>
              <TouchableOpacity
                onPress={endTrip}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  padding: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: spacing.borderRadius,
                }}
              >
                <Text style={{ ...globalStyles.smallText, color: "white" }}>
                  End trip
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: "center",
                gap: spacing.sm,
                marginTop: spacing.md,
              }}
            >
              <Text style={{ ...globalStyles.title, color: "white" }}>
                {tripTime}
              </Text>
              <Text style={{ ...globalStyles.smallText, color: "white" }}>
                Trip time
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                marginVertical: spacing.md,
              }}
            />
            <View style={{ gap: spacing.sm }}>
              <Text style={{ ...globalStyles.smallText, color: "white" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <Ionicons name="compass" size={16} color="white" />
                  <Text style={{ ...globalStyles.smallText, color: "white" }}>
                    From: West Coast Road
                  </Text>
                </View>
              </Text>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <Ionicons name="time" size={16} color="white" />
                  <Text style={{ ...globalStyles.smallText, color: "white" }}>
                    Start: 10:00
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={startTrip}>
        <LinearGradient
          colors={["#4CAF50", "#45a049"]}
          style={{
            padding: spacing.xl,
            paddingVertical: spacing.xxl,
            borderRadius: spacing.borderRadius,
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.sm,
          }}
        >
          <Ionicons name="play-circle" size={60} color="white" />
          <Text style={{ ...globalStyles.bodyText, color: "white" }}>
            Start New Trip
          </Text>
          <Text style={{ ...globalStyles.smallText, color: "white" }}>
            GPS tracking will be activated automatically
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const returnThisMonth = () => {
    return (
      <View
        style={{
          backgroundColor: colors.ui.white,
          padding: spacing.md,
          borderRadius: spacing.borderRadius,
        }}
      >
        <Text style={{ ...globalStyles.bodyText }}>This Month</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: spacing.md,
          }}
        >
          <View style={{ alignItems: "center", flex: 1, gap: spacing.xs }}>
            <Text style={{ ...globalStyles.title, color: colors.ui.darkBlue }}>
              12
            </Text>
            <Text style={{ ...globalStyles.smallText }}>Trips</Text>
          </View>
          <View style={{ alignItems: "center", flex: 1, gap: spacing.xs }}>
            <Text style={{ ...globalStyles.title, color: colors.ui.darkBlue }}>
              322
            </Text>
            <Text style={{ ...globalStyles.smallText }}>Miles</Text>
          </View>
          <View style={{ alignItems: "center", flex: 1, gap: spacing.xs }}>
            <Text style={{ ...globalStyles.title, color: colors.ui.darkBlue }}>
              26
            </Text>
            <Text style={{ ...globalStyles.smallText }}>Hours</Text>
          </View>
        </View>
      </View>
    );
  };

  const returnRecentTrips = () => {
    return (
      <View
        style={{
          backgroundColor: colors.ui.white,
          padding: spacing.md,
          borderRadius: spacing.borderRadius,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ ...globalStyles.bodyText }}>Recent Trips</Text>
          <Text
            style={{ ...globalStyles.smallText, color: colors.ui.darkBlue }}
          >
            View All
          </Text>
        </View>
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          {dummyTrips.map((trip, index) => (
            <RecentTripItem key={index} trip={trip} />
          ))}
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
          <TopBar title="Log Book" />
        </View>
        <View
          style={{
            ...globalStyles.container,
            marginTop: spacing.md,
            gap: spacing.md,
          }}
        >
          {returnStartTrip()}
          {returnThisMonth()}
          {returnRecentTrips()}
        </View>
      </ScrollView>
    </View>
  );
};

export default LogBookScreen;

const styles = StyleSheet.create({});
