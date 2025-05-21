import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { colors } from "../../../../constants/colors";
import { AntDesign } from "@expo/vector-icons";
const ChecklistItem = ({ item }: { item: any }) => {
  return (
    <View
      style={{
        marginTop: spacing.sm,
        borderWidth: 1,
        borderColor: colors.ui.lightGrey,
        borderRadius: spacing.borderRadius,
        padding: spacing.sm,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...globalStyles.xSmallText,
              fontWeight: "bold",
              flexShrink: 1,
              maxWidth: "65%",
            }}
          >
            {item.title}
          </Text>
          <View style={{ marginTop: spacing.sm }}>
            <Text style={{ ...globalStyles.xSmallText, fontWeight: "bold" }}>
              Comments
            </Text>
            <Text
              style={{
                ...globalStyles.xSmallText,
                flexShrink: 1,
                maxWidth: "65%",
              }}
            >
              {item.comments ? item.comments : "No comments"}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",

            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: colors.ui.green }}
          >
            <Text
              style={{ ...globalStyles.xSmallText, color: colors.ui.white }}
            >
              Pass
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text
              style={{ ...globalStyles.xSmallText, color: colors.ui.white }}
            >
              Fail
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ margin: spacing.sm }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.ui.lightBlue,
            padding: spacing.sm,
            borderRadius: spacing.borderRadius,
            marginTop: spacing.sm,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.sm,
            ...globalStyles.cardShadow,
          }}
        >
          <AntDesign name="camera" size={24} color={colors.ui.darkBlue} />
          <Text
            style={{ ...globalStyles.xSmallText, color: colors.ui.darkBlue }}
          >
            Add Photo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChecklistItem;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.ui.darkGrey,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignSelf: "flex-start",
    borderRadius: spacing.borderRadius,
    marginHorizontal: spacing.xs,
  },
});
