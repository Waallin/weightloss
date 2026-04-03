import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import { colors } from "../../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { textStyles } from "../../../constants/texts";
import RoundedButtonComponent from "../../../components/RoundedButtonComponent";

const AddDietScreen = () => {
    const [portion, setPortion] = useState("1");
    const navigation = useNavigation();
    const renderHeader = () => {
        return (
            <View
                style={{
                    padding: spacing.md,
                    borderRadius: spacing.borderRadius,
                }}
            >
                <View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.goBack()}
                        style={{
                            backgroundColor: colors.ui.componentBackground,
                            borderRadius: spacing.borderRadius,
                            ...globalStyles.shadow,
                            justifyContent: "center",
                            alignItems: "center",
                            // alignItems: "flex-start",
                            // padding: spacing.md,
                            width: 40,
                            height: 40,
                        }}
                    >
                        <MaterialCommunityIcons
                            name="chevron-left"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const renderContent = () => {
        return (
            <View style={{
                padding: spacing.md,
                backgroundColor: colors.ui.componentBackground,
                justifyContent: "center",
                alignItems: "center",
                gap: spacing.md,
            }}>
                <Text style={textStyles.primary}>
                    Enter Size
                </Text>
                <TextInput
                    placeholder="Enter portion"
                    keyboardType="numeric"
                    value={portion}
                    onChangeText={(text) => setPortion(text)}
                    style={{
                        borderWidth: 0.5,
                        borderColor: colors.ui.cardBorder,
                        borderRadius: spacing.borderRadius,
                        padding: spacing.md,
                        backgroundColor: colors.ui.white,
                        width: "100%",
                    }}
                />
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,
                }}>
                    <MaterialCommunityIcons name="food-apple" size={24} color={colors.ui.primary} />
                    <Text style={textStyles.primary}>2.6 points</Text>
                </View>
            </View>
        );
    };

    return (
        <View
        style={globalStyles.container}
        >
            <ScrollView
                contentContainerStyle={globalStyles.scrollContainer}
                style={{
                    marginTop: spacing.screenMarginTop,
                }}
            >
                {renderHeader()}
                {renderContent()}
            </ScrollView>
            <View style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: spacing.md,
            }}>
                <RoundedButtonComponent handleNext={() => {}} icon="plus" />
            </View>
        </View>
    );
};

export default AddDietScreen;

const styles = StyleSheet.create({});
