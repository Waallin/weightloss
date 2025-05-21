import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import Checklist from "./components/Checklist";
const dummyChecklist = [
  {
    id: 1,
    title: "weekend trip pre-departure check",
    sections: [
      {
        id: 1,
        title: "safety equipment",
        items: [
          {
            id: 1,
            title: "life jackets present and in good condition",
            comments: "all 8 life jackets are in good condition",
          },
        ],
      },
      {
        id: 2,
        title: "Documentation",
        items: [
          {
            id: 1,
            title: "Boat registration",
          },
          {
            id: 2,
            title: "Boat insurance",
          },
        ],
      },
    ],
  },

  {
    id: 2,
    title: "monthly check",
    sections: [
      {
        id: 1,
        title: "safety equipment",
        items: [
          {
            id: 1,
            title: "life jackets",
          },
          {
            id: 2,
            title: "fire extinguisher",
          },
        ],
      },
      {
        id: 2,
        title: "Documentation",
        items: [
          {
            id: 1,
            title: "Boat registration",
          },
          {
            id: 2,
            title: "Boat insurance",
          },
        ],
      },
    ],
  },
];

const renderChecklist = () => {
  return (
    <View
      style={{
        marginTop: spacing.md,
      }}
    >
      {dummyChecklist.map((checklist) => (
        <Checklist checklist={checklist} />
      ))}
    </View>
  );
};

const ChecklistScreen = () => {
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: spacing.md,

            alignItems: "center",
          }}
        >
          <Text style={{ ...globalStyles.smallTitle }}>Checklists</Text>
        </View>
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
              4
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
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",

            backgroundColor: colors.ui.darkBlue,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: spacing.borderRadius,
          }}
        >
          <Ionicons name="add" size={24} color={colors.ui.white} />
          <Text style={{ ...globalStyles.smallText, color: colors.ui.white }}>
            New
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChecklistScreen;

const styles = StyleSheet.create({});
