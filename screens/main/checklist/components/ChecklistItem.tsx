import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import React, { useState } from "react";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { colors } from "../../../../constants/colors";
import { AntDesign } from "@expo/vector-icons";
import globalApi from "../../../../services/api";
import useUserStore from "../../../../stores/useUserStore";
import TextAreaComponent from "../../../../components/TextAreaComponent";
import useChecklistStore from "../../../../stores/useChecklistStore";
import { Ionicons } from "@expo/vector-icons";
const ChecklistItem = ({ item: itemProp }: { item: any }) => {
  const { user } = useUserStore();
  const { updateChecklistItem } = useChecklistStore();

  const [showInfo, setShowInfo] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [photo, setPhoto] = useState<any>({});

  const alreadyReported = itemProp.responses.length > 0;
  const [comments, setComments] = useState(
    alreadyReported ? itemProp.responses[0].comment : ""
  );

  const handleReport = async (id: string, status: number) => {
    const endpoint = `checklists/items/${id}/response`;
    const payload = {
      status: status,
      comments: comments,
    };
    const response = await globalApi("POST", endpoint, payload, user.token);
    if (response.success) {
      updateChecklistItem(id, response.data.status);
    }
    setDisabled(true);
  };

  const renderCommentInput = () => {
    return (
      <View style={{ marginTop: spacing.sm }}>
        <TextAreaComponent
          disabled={alreadyReported}
          title="Comments"
          placeholder={alreadyReported ? "No comments" : "Add a comment"}
          value={comments}
          onChangeText={(text) => setComments(text)}
        />
      </View>
    );
  };

  const handleAddPhoto = () => {
    console.log(alreadyReported, itemProp.responses);
    return;
    setPhoto({
      uri: "https://via.placeholder.com/150",
      type: "image/jpeg",
    });
  };

  const returnButtonColor = (status: number, buttonType: "pass" | "fail") => {
    if (alreadyReported) {
      const reportedStatus = itemProp.responses[0].status;

      if (reportedStatus === status) {
        console.log("test");
        if (buttonType === "pass") {
          return colors.status.success;
        } else {
          return colors.status.error;
        }
      }
      return colors.ui.lightGrey;
    }
    const result =
      buttonType === "pass" ? colors.status.success : colors.status.error;
    return result;
  };

  const renderInfo = () => {
    return (
      <Modal
        // animationType="slide"
        transparent={true}
        visible={showInfo}
        onRequestClose={() => setShowInfo(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          ]}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={globalStyles.smallText}>Information</Text>
              <TouchableOpacity onPress={() => setShowInfo(false)}>
                <AntDesign name="close" size={24} color={colors.ui.darkBlue} />
              </TouchableOpacity>
            </View>
            <Text style={globalStyles.smallText}>
              {itemProp.description}
              {"\n\n"}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  const renderButtons = () => {
    if (!photo) {
      return (
        <TouchableOpacity
          onPress={handleAddPhoto}
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
      );
    }
    return (
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <TouchableOpacity
          disabled={alreadyReported}
          onPress={() => handleReport(itemProp.id, 2)}
          style={{
            backgroundColor: returnButtonColor(2, "fail"),
            padding: spacing.sm,
            borderRadius: spacing.borderRadius,
            flex: 1,
            alignItems: "center",
          }}
        >
          <Text style={{ ...globalStyles.xSmallText, color: "white" }}>
            Fail
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={alreadyReported}
          onPress={() => handleReport(itemProp.id, 1)}
          style={{
            backgroundColor: returnButtonColor(1, "pass"),
            padding: spacing.sm,
            borderRadius: spacing.borderRadius,
            flex: 1,
            alignItems: "center",
          }}
        >
          <Text style={{ ...globalStyles.xSmallText, color: "white" }}>
            Pass
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
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
      {renderInfo()}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...globalStyles.smallText,
              fontWeight: "bold",
              flexShrink: 1,
              maxWidth: "70%",
            }}
          >
            {itemProp.title}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <TouchableOpacity onPress={() => setShowInfo(true)}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.ui.darkBlue}
            />
          </TouchableOpacity>
        </View>
      </View>
      {renderCommentInput()}
      <View style={{ margin: spacing.md }}>{renderButtons()}</View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.ui.white,
    padding: spacing.md,
    borderRadius: spacing.borderRadius,
    width: "80%",
    ...globalStyles.cardShadow,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
});
