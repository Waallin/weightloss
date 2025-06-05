import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import WeatherCondition from "./widgets/WeatherCondition";
import { spacing } from "../../../constants/spacing";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import WeatherFocast from "./widgets/WeatherFocast";
import SmartAlert from "./widgets/SmartAlert";
import EmergencyContact from "./widgets/EmergencyContact";

const darkblue = "#0D395F";
const lightblue = "#3977B0";

const DashboardScreen = () => {
  const profileImage = require("../../../assets/profile.png");
  const { height } = useWindowDimensions();

  const headerHeight = height * 0.27;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNotifications = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleProfile = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Profile");
  };

  const handleBoat = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Boat");
  };

  const renderHeader = () => {
    return (
      <LinearGradient
        colors={[darkblue, lightblue]}
        style={{
          alignItems: "center",
          height: headerHeight,
          zIndex: -1,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView />

        <View
          style={{
            flex: 1,
            paddingTop: 20,
            width: "100%",
            paddingHorizontal: spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <TouchableOpacity onPress={handleProfile}>
                <Image
                  source={profileImage}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: colors.ui.white,
                  }}
                />
              </TouchableOpacity>
              <View>
                <Text
                  style={[globalStyles.smallText, { color: colors.ui.white }]}
                >
                  Welcome back,
                </Text>
                <Text
                  style={[
                    globalStyles.bodyText,
                    { color: colors.ui.white, fontWeight: "bold" },
                  ]}
                >
                  John Doe
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleNotifications}
              activeOpacity={0.8}
              style={{
                padding: 10,
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
            >
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",

              paddingTop: spacing.md,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.xs,
                }}
              >
                <Text
                  style={{
                    ...globalStyles.bodyText,
                    fontWeight: "bold",
                    color: colors.ui.white,
                  }}
                >
                  Sea Breeze
                </Text>
                <Entypo name="chevron-down" size={20} color={colors.ui.white} />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.xs,
                  marginTop: spacing.xs,
                }}
              >
                <FontAwesome5
                  name="location-arrow"
                  size={10}
                  color={colors.ui.lightGrey}
                />
                <Text
                  style={{
                    ...globalStyles.smallText,
                    color: colors.ui.lightGrey,
                  }}
                >
                  Marina Bay
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleBoat}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <Text
                style={[globalStyles.smallText, { color: colors.ui.white }]}
              >
                Details
              </Text>
              <Entypo name="chevron-right" size={20} color={colors.ui.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderContent = () => {
    return (
      <View
        style={{
          backgroundColor: colors.ui.lightBlueBackground,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: "100%",
          marginTop: -20,
        }}
      >
        <View
          style={{
            paddingTop: 30,
            paddingHorizontal: spacing.md,
            flex: 1,
            gap: spacing.md,
          }}
        >
          <EmergencyContact />
          <WeatherCondition />
          <SmartAlert />
          <WeatherFocast />
        </View>
      </View>
    );
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: spacing.scrollViewBottomPadding,
      }}
      bounces={false}
    >
      <View>
        {renderHeader()}
        {renderContent()}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({});
