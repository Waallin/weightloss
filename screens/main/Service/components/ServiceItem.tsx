import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ServiceItemType } from "../types";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { Entypo } from "@expo/vector-icons";
import { formatDate } from "../../../../utils/dateUtils";

const ServiceItem = ({ item }: { item: ServiceItemType }) => {
  const serviceTypeConfig = {
    maintenance: {
      icon: "tools" as const,
      backgroundColor: colors.serviceType.maintenance,
      textColor: colors.ui.white,
    },
    inspection: {
      icon: "magnifying-glass" as const,
      backgroundColor: colors.serviceType.inspection,
      textColor: colors.ui.white,
    },
    repair: {
      icon: "cog" as const,
      backgroundColor: colors.serviceType.repair,
      textColor: colors.ui.white,
    },
    default: {
      icon: "info" as const,
      backgroundColor: colors.serviceType.default,
      textColor: colors.text.primary,
    },
  };

  const returnType = () => {
    const config =
      serviceTypeConfig[item.type as keyof typeof serviceTypeConfig] ||
      serviceTypeConfig.default;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
          backgroundColor: config.backgroundColor,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          borderRadius: spacing.borderRadius,
        }}
      >
        <Entypo name={config.icon} size={16} color={config.textColor} />
        <Text
          style={{
            ...globalStyles.xSmallText,
            fontWeight: "bold",
            color: config.textColor,
            textTransform: "capitalize",
          }}
        >
          {item.type}
        </Text>
      </View>
    );
  };
  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        ...globalStyles.cardShadow,
        flex: 1,
      }}
    >
      <View
        style={{
          position: "absolute",
          right: 10,
          top: 10,
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <Text style={{ ...globalStyles.xSmallText, fontWeight: "bold" }}>
          {item.cost}
        </Text>
        <Text style={{ ...globalStyles.xSmallText }}>SEK</Text>
      </View>
      <View>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              onPress={() => console.log("test", item)}
              style={{ ...globalStyles.smallText, fontWeight: "bold" }}
            >
              {item.title}
            </Text>
          </View>

          <View style={{ marginTop: spacing.sm }}>
            <Text style={{ ...globalStyles.xSmallText, color: colors.ui.grey }}>
              {item.description}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            marginTop: spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <Entypo name="calendar" size={18} color={colors.ui.grey} />
            <Text
              style={{
                ...globalStyles.xSmallText,
                color: colors.ui.grey,
              }}
            >
              {formatDate(item.created_at)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
              marginLeft: spacing.md,
            }}
          >
            <Entypo name="user" size={18} color={colors.ui.grey} />
            <Text
              style={{
                ...globalStyles.xSmallText,
                color: colors.ui.grey,
              }}
            >
              {item.registered_by}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            marginTop: spacing.xs,
          }}
        >
          <Entypo name="briefcase" size={18} color={colors.ui.grey} />
          <Text
            style={{
              ...globalStyles.xSmallText,
              color: colors.ui.grey,
            }}
          >
            {item.service_provider}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: spacing.sm,
          alignItems: "flex-start",
        }}
      >
        {returnType()}
      </View>
    </View>
  );
};

export default ServiceItem;

const styles = StyleSheet.create({});
