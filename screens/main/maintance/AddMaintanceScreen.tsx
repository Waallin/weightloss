import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import MaintanceOptionItem from "./components/MaintanceOptionItem";
import { MaintanceOptionType } from "./types";
import TextInputComponent from "./components/TextInputComponent";
import TextAreaComponent from "./components/TextAreaComponent";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import PrimaryButton from "../../../components/PrimaryButton";

const serviceType = [
  {
    title: "Maintenance",
    label: "Maintenance",
    icon: "construct-outline",
  },
  {
    title: "Repair",
    label: "Repair",
    icon: "hammer-outline",
  },
  {
    title: "Upgrade",
    label: "Upgrade",
    icon: "trending-up-outline",
  },
  {
    title: "Inspection",
    label: "Inspection",
    icon: "search-outline",
  },
];

const AddMaintanceScreen = () => {
  const [selectedServiceType, setSelectedServiceType] =
    useState<MaintanceOptionType | null>(null);
  const [serviceTitle, setServiceTitle] = useState<string>("");
  const [serviceDescription, setServiceDescription] = useState<string>("");
  const handleServiceType = (item: MaintanceOptionType) => {
    setSelectedServiceType(item);
  };

  const [serviceCost, setServiceCost] = useState<string>("");
  const [serviceProvider, setServiceProvider] = useState<string>("");
  const [serviceCategory, setServiceCategory] = useState<string>("");

  const returnServiceType = () => {
    return (
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          Service Type
        </Text>
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          {serviceType.map((item) => (
            <MaintanceOptionItem
              key={item.title}
              item={item}
              selected={selectedServiceType?.label === item.label}
              onPress={() => handleServiceType(item)}
            />
          ))}
        </View>
      </View>
    );
  };

  const returnPhotoInput = () => {
    return (
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          Receipt Photo
        </Text>
        <View
          style={{
            alignItems: "center",
            gap: spacing.sm,
            marginTop: spacing.sm,
            borderWidth: 1,
            paddingVertical: spacing.xl,
            borderStyle: "dashed",
            borderColor: colors.ui.darkGrey,
            borderRadius: spacing.borderRadius,
            padding: spacing.sm,
          }}
        >
          <Ionicons
            name="camera-outline"
            size={32}
            color={colors.ui.darkBlue}
          />
          <Text>Take photo of receipt</Text>
        </View>
      </View>
    );
  };

  const returnInputs = () => {
    return (
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <TextInputComponent
            title="Title"
            placeholder="Enter service title"
            value={serviceTitle}
            onChangeText={setServiceTitle}
          />
          <TextAreaComponent
            title="Description"
            placeholder="Enter service description"
            value={serviceDescription}
            onChangeText={setServiceDescription}
          />
          <TextInputComponent
            title="Cost (SEK)"
            placeholder="0"
            value={serviceCost}
            onChangeText={setServiceCost}
          />
          <TextInputComponent
            title="Service Provider"
            placeholder="Enter provider name"
            value={serviceProvider}
            onChangeText={setServiceProvider}
          />
          <TextInputComponent
            title="Category"
            placeholder="Enter service category"
            value={serviceCategory}
            onChangeText={setServiceCategory}
          />
        </View>
      </View>
    );
  };

  const handleAddService = () => {
    const payload = {
      serviceType: selectedServiceType?.label,
      serviceTitle: serviceTitle,
      serviceDescription: serviceDescription,
      serviceCost: serviceCost,
      serviceProvider: serviceProvider,
      serviceCategory: serviceCategory,
    };
    console.log(payload);
  };

  return (
    <View
      style={{
        ...globalStyles.container,
        paddingTop: spacing.md,
        gap: spacing.md,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacing.scrollViewBottomPadding,
        }}
      >
        {returnServiceType()}
        {returnInputs()}
        {returnPhotoInput()}
        <View style={{ marginTop: spacing.md }}>
          <PrimaryButton title="Add Service" onPress={handleAddService} />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddMaintanceScreen;

const styles = StyleSheet.create({});
