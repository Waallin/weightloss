import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import Checklist from "./components/Checklist";
import useUserStore from "../../../stores/useUserStore";
import TopBar from "../../../components/TopBar";
import globalApi from "../../../services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useChecklistStore from "../../../stores/useChecklistStore";

const ChecklistScreen = () => {
  const { user, mainBoat } = useUserStore();

  const { checklists, setChecklists } = useChecklistStore();
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchChecklists();
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const fetchChecklists = async () => {
    const boatId = mainBoat()?.id;
    const endpoint = `boats/${boatId}/checklists`;

    if (!boatId) return;
    const response = await globalApi("GET", endpoint, null, user.token);
    setChecklists(response.data.checklists);
  };

  const renderChecklist = () => {
    return (
      <View
        style={{
          marginTop: spacing.md,
          flex: 1,
        }}
      >
        {checklists.length > 0 ? (
          checklists.map((checklist, index) => (
            <Checklist checklist={checklist} key={index} />
          ))
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    translateY: bounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10],
                    }),
                  },
                  {
                    rotate: bounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "10deg"],
                    }),
                  },
                ],
              }}
            >
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={80}
                color={colors.ui.darkBlue}
              />
            </Animated.View>
            <Text
              style={{ ...globalStyles.subTitle, color: colors.ui.darkBlue }}
            >
              No checklists found
            </Text>
            <Text
              style={{
                ...globalStyles.smallText,
                color: colors.ui.darkBlue,
                textAlign: "center",
                maxWidth: "80%",
                opacity: 0.7,
              }}
            >
              Create your first checklist to keep track of your boat's
              maintenance
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        ...globalStyles.container,
        backgroundColor: colors.ui.lightBlueBackground,
      }}
    >
      <SafeAreaView />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: spacing.scrollViewBottomPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TopBar title="Checklists" />
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.ui.white,
            justifyContent: "space-between",
            marginTop: spacing.md,
            padding: spacing.md,
            borderRadius: spacing.borderRadius,
            ...globalStyles.cardShadow,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
            }}
          >
            <Text
              style={{
                ...globalStyles.subTitle,
                color: colors.ui.darkBlue,
                fontWeight: "800",
              }}
            >
              {checklists?.length || 0}
            </Text>
            <Text
              style={{ ...globalStyles.xSmallText, color: colors.ui.darkBlue }}
            >
              total checklists
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
            }}
          >
            <Text
              style={{
                ...globalStyles.subTitle,
                color: colors.ui.green,
                fontWeight: "800",
              }}
            >
              2
            </Text>
            <Text style={{ ...globalStyles.xSmallText }}>Completed</Text>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
            }}
          >
            <Text
              style={{
                ...globalStyles.subTitle,
                color: colors.ui.darkBlue,
                fontWeight: "800",
              }}
            >
              2
            </Text>
            <Text style={{ ...globalStyles.xSmallText }}>In Progress</Text>
          </View>
        </View>
        {renderChecklist()}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 110,
          right: spacing.md,
        }}
      ></View>
    </View>
  );
};

export default ChecklistScreen;

const styles = StyleSheet.create({});
