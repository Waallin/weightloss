import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import InputRow from "./components/InputRow";
import PrimaryButton from "../../../components/PrimaryButton";
import SegmentedControl from "../../../components/SegmentedControl";
import * as Haptics from "expo-haptics";
import { useRef } from "react";
import useUserStore from "../../../stores/useUserStore";
import globalApi from "../../../services/api";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const BoatRegistration = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigation = useNavigation();
  const { user } = useUserStore();

  const [boatName, setBoatName] = useState("");
  const [boatModel, setBoatModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [yearOfManufacture, setYearOfManufacture] = useState("");
  const [boatLength, setBoatLength] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [engineType, setEngineType] = useState("");
  const [hullMaterial, setHullMaterial] = useState("");

  const handleRegisterBoat = async () => {
    const payload = {
      name: boatName,
      model: boatModel,
      registration_number: registrationNumber,
      year: yearOfManufacture,
      length: boatLength,
      manufacturer: manufacturer,
      engine_type: engineType,
      hull_material: hullMaterial,
    };

    const endpoint = "boats";
    const response = await globalApi("POST", endpoint, payload, user?.token);
    if (response.success) {
      Alert.alert("Boat registered successfully");
      navigation.goBack();
    }
  };

  const handleToAdditionalInfo = () => {
    setSelectedIndex(1);
  };

  const handleScanQR = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log("Scan QR");
  };

  const renderBasicInfo = () => {
    return (
      <View>
        <InputRow
          label="Boat Name"
          placeholder="Enter boat name"
          icon="directions-boat-filled"
          value={boatName}
          onChangeText={setBoatName}
        />
        <InputRow
          label="Boat Model"
          placeholder="Enter boat model"
          icon="anchor"
          value={boatModel}
          onChangeText={setBoatModel}
        />
        <InputRow
          label="Registration Number"
          placeholder="Enter registration number"
          icon="badge"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
        />
        <InputRow
          label="Year of Manufacture"
          placeholder="Enter year of manufacture"
          icon="calendar-month"
          value={yearOfManufacture}
          keyboardType="numeric"
          onChangeText={setYearOfManufacture}
        />
        <InputRow
          label="Boat Length"
          placeholder="Enter boat length"
          icon="height"
          value={boatLength}
          keyboardType="numeric"
          onChangeText={setBoatLength}
        />

        <TouchableOpacity
          onPress={handleScanQR}
          activeOpacity={0.8}
          style={{
            marginTop: spacing.md,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.ui.white,
            padding: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: spacing.borderRadius,
            ...globalStyles.cardShadow,
          }}
        >
          <View
            style={{
              backgroundColor: colors.ui.lightBlueBackground,
              padding: spacing.sm,
              borderRadius: spacing.borderRadius,
            }}
          >
            <MaterialIcons
              name="qr-code"
              size={24}
              color={colors.brand.primary}
            />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
              Scan QR Code
            </Text>
            <Text
              style={{ ...globalStyles.smallGreyText, marginTop: spacing.sm }}
            >
              Quickly scan the QR code to register your boat
            </Text>
          </View>
          <View>
            <Entypo name="chevron-right" size={20} color={colors.ui.darkBlue} />
          </View>
        </TouchableOpacity>
        <View style={{ marginTop: spacing.xl }}>
          <PrimaryButton
            title="Continue to Additional"
            onPress={handleToAdditionalInfo}
            arrow={true}
          />
        </View>
      </View>
    );
  };

  const isRegisterButtonDisabled = () => {
    return (
      boatName === "" ||
      boatModel === "" ||
      registrationNumber === "" ||
      yearOfManufacture === "" ||
      boatLength === "" ||
      manufacturer === "" ||
      engineType === "" ||
      hullMaterial === ""
    );
  };

  const renderAdditionalInfo = () => {
    return (
      <View>
        <InputRow
          label="Manufacturer"
          placeholder="Boat manufacturer"
          icon="directions-boat-filled"
          value={manufacturer}
          onChangeText={setManufacturer}
        />
        <InputRow
          label="Engine Type"
          placeholder="e-g Outboard, Inboard, etc."
          icon="speed"
          value={engineType}
          onChangeText={setEngineType}
        />
        <InputRow
          label="Hull Material"
          placeholder="e-g Fiberglass, Aluminum, etc."
          icon="construction"
          value={hullMaterial}
          onChangeText={setHullMaterial}
        />
        <View style={{ marginTop: spacing.xl }}>
          <PrimaryButton
            disabled={isRegisterButtonDisabled()}
            title="Register Boat"
            onPress={handleRegisterBoat}
            arrow={true}
          />
        </View>
      </View>
    );
  };

  const renderForm = () => {
    if (selectedIndex === 0) {
      return renderBasicInfo();
    } else {
      return renderAdditionalInfo();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{ flex: 1 }}
    >
      <View style={globalStyles.container}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: spacing.scrollViewBottomPadding,
          }}
        >
          <View
            style={{
              marginTop: spacing.xl,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name="directions-boat-filled"
              size={52}
              color={colors.brand.primary}
            />
          </View>
          <View>
            <Text
              style={{
                ...globalStyles.subTitle,
                fontWeight: "bold",
                marginTop: spacing.xl,
              }}
            >
              Vessel Information
            </Text>
            <Text
              style={{
                ...globalStyles.smallText,
                width: "90%",
                marginTop: spacing.md,
              }}
            >
              Please fill in the following details to register your vessel.
            </Text>
          </View>
          <View style={{ marginTop: spacing.lg }}>
            <SegmentedControl
              values={["Basic Info", "Additional"]}
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
            />
          </View>
          {renderForm()}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BoatRegistration;

const styles = StyleSheet.create({});
