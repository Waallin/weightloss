import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import SwitchInputRow from "../../../auth/components/SwitchInputRow";
import DropdownRow from "../../../auth/components/DropdownRow";
import { colors } from "../../../../constants/colors";
import { globalStyles } from "../../../../constants/globalStyles";
import { spacing } from "../../../../constants/spacing";
import { AntDesign } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { ModalItem } from "../types";
import globalApi from "../../../../services/api";
import useUserStore from "../../../../stores/useUserStore";
const languages = [
  { id: 1, title: "English" },
  { id: 2, title: "Spanish" },
  { id: 3, title: "French" },
];
const measurementUnits = [
  { id: 1, title: "Metric" },
  { id: 2, title: "Imperial" },
];

const PreferenceView = () => {
  const { user, setUser } = useUserStore();

  const [notification, setNotification] = useState(
    Boolean(user?.preferences?.notification)
  );
  const [location, setLocation] = useState(
    Boolean(user?.preferences?.location)
  );
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<ModalItem[]>([]);
  const [currentDropdownType, setCurrentDropdownType] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedMeasurementUnit, setSelectedMeasurementUnit] = useState(
    measurementUnits[0]
  );

  const handleChangeSwitch = async (key: string, value: any) => {
    const payload = {
      [key]: !value ? 1 : 0,
    };
    const endpoint = "user/update";
    const response = await globalApi("POST", endpoint, payload, user.token);

    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        [key]: !value,
      },
    });
  };

  const handleChangeDropdown = async (key: string, value: any) => {
    const payload = {
      [key]: value,
    };
    const endpoint = "user/update";
    const response = await globalApi("POST", endpoint, payload, user.token);
  };

  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: colors.ui.white,
              borderTopLeftRadius: spacing.xl,
              borderTopRightRadius: spacing.xl,
              padding: spacing.xl,
              maxHeight: "60%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: -4,
              },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: spacing.lg,
              }}
            >
              <Text
                style={{
                  ...globalStyles.title,
                  fontSize: 24,
                }}
              >
                {modalTitle}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign
                  name="close"
                  size={24}
                  color={colors.text.tertiary}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={modalData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: spacing.md,
                    borderRadius: spacing.borderRadius,
                    borderBottomWidth: 1,
                    borderColor: colors.ui.lightGrey,
                    marginBottom: spacing.xs,
                  }}
                  onPress={() => {
                    handleChangeDropdown(currentDropdownType, item.title);
                    if (currentDropdownType === "language") {
                      setSelectedLanguage(item);
                    } else if (currentDropdownType === "measurement") {
                      setSelectedMeasurementUnit(item);
                    }
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.smallGreyText,
                      color: colors.text.primary,
                    }}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderPreferences = () => {
    return (
      <View>
        <SwitchInputRow
          title="Notifications"
          value={notification}
          onChange={() => {
            setNotification(!notification);
            handleChangeSwitch("notification", notification);
          }}
        />

        <SwitchInputRow
          title="Location"
          value={location}
          onChange={() => {
            setLocation(!location);
            handleChangeSwitch("location", location);
          }}
        />
        <DropdownRow
          title="Language"
          value={selectedLanguage}
          onPress={() => {
            setModalTitle("Language");
            setModalData(languages);
            setCurrentDropdownType("language");
            setModalVisible(true);
          }}
        />
        <DropdownRow
          title="Measurement Units"
          value={selectedMeasurementUnit}
          onPress={() => {
            setModalTitle("Measurement Units");
            setModalData(measurementUnits);
            setCurrentDropdownType("measurement");
            setModalVisible(true);
          }}
        />
        <View
          style={{
            marginTop: spacing.xl,
            gap: spacing.md,
          }}
        ></View>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      {renderPreferences()}
      {renderModal()}
    </View>
  );
};

export default PreferenceView;

const styles = StyleSheet.create({});
