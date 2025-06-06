import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import TextInputComponent from "../../../components/TextInputComponent";
import TextAreaComponent from "../../../components/TextAreaComponent";
import { colors } from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../../components/PrimaryButton";

const AddFuelScreen = () => {
  const [amount, setAmount] = useState<string>("");
  const [totalCost, setTotalCost] = useState<string>("");
  const [pricePerGallon, setPricePerGallon] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [engineHours, setEngineHours] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const returnInputs = () => {
    return (
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <TextInputComponent
          title="Fuel type"
          placeholder="Enter fuel type"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInputComponent
          title="Total cost"
          placeholder="Enter total cost"
          value={totalCost}
          onChangeText={setTotalCost}
        />
        <TextInputComponent
          title="Price per gallon"
          placeholder="Enter price per gallon"
          value={pricePerGallon}
          onChangeText={setPricePerGallon}
        />
        <TextInputComponent
          title="Location"
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
        />
        <TextInputComponent
          title="Engine hours"
          placeholder="Enter engine hours"
          value={engineHours}
          onChangeText={setEngineHours}
        />
        <TextAreaComponent
          title="Notes"
          placeholder="Enter notes"
          value={notes}
          onChangeText={setNotes}
        />
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

  const handleAddFuel = () => {
    const payload = {
      amount: amount,
      totalCost: totalCost,
      pricePerGallon: pricePerGallon,
      location: location,
      engineHours: engineHours,
      notes: notes,
    };
    console.log(payload);
  };

  return (
    <View style={{ ...globalStyles.container }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: spacing.md,
          paddingBottom: spacing.scrollViewBottomPadding,
        }}
      >
        <Text style={{ ...globalStyles.smallTitle }}>Details</Text>
        {returnInputs()}
        {returnPhotoInput()}
        <View style={{ marginTop: spacing.md }}>
          <PrimaryButton title="Add Fuel" onPress={handleAddFuel} />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddFuelScreen;

const styles = StyleSheet.create({});
