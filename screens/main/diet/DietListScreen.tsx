import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    FlatList,
} from "react-native";
import React from "react";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { spacing } from "../../../constants/spacing";
import { useNavigation } from "@react-navigation/native";
import FoodItem from "./components/FoodItem";
import { textStyles } from "../../../constants/texts";

const dummyFoodItems = [
    {
        id: 1,
        name: "Potato",
        portion: "1 portion",
        grams: 100,
        kudos: "5",
        image: require("../../../assets/potato.png"),
    },
    {
        id: 2,
        name: "Banana",
        portion: "1 portion",
        grams: 100,
        kudos: "2",
        image: require("../../../assets/banana.png"),
    },
    {
        id: 3,
        name: "Egg",
        portion: "1 portion",
        grams: 100,
        kudos: "0.5",
        image: require("../../../assets/egg.png"),
    },

    {
        id: 6,
        name: "Milk",
        portion: "1 portion",
        grams: 100,
        kudos: "0.5",
        image: require("../../../assets/milk.png"),
    },
];
const DietListScreen = () => {
    const navigation = useNavigation();

    const renderHeader = () => {
        return (
            <View
                style={{
                    backgroundColor: colors.ui.componentBackground,
                    height: 140,
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
                <View>
                    <View
                        style={{
                            marginTop: spacing.md,
                        }}
                    >
                        <TextInput
                            placeholder="Search"
                            style={{
                                borderWidth: 0.5,
                                borderColor: colors.ui.cardBorder,
                                borderRadius: spacing.borderRadius,
                                padding: spacing.md,
                                backgroundColor: colors.ui.white,
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    };

    const renderFoodItems = () => {
        return (
            <View style={{
                gap: spacing.componentGap,
            }}>
                <Text style={textStyles.screenSectionTitle}>
                    List
                </Text>
                <FlatList
                    contentContainerStyle={{
                        gap: spacing.xs,
                    }}
                    data={dummyFoodItems}
                    renderItem={({ item }) => (
                        <FoodItem
                            image={item.image}
                            onPress={() => handleNavigateToAddDietScreen(item.name)}
                            name={item.name}
                            portion={item.portion}
                            kudos={item.kudos}
                            grams={item.grams}
                        />
                    )}
                />
            </View>
        );
    };

    const handleNavigateToAddDietScreen = () => {
        navigation.navigate("AddDietScreen");
    }
    return (
        <View
            style={{
                ...globalStyles.container,
                gap: spacing.componentGap,
            }}
        >
            {renderHeader()}

            {renderFoodItems()}
        </View>
    );
};

export default DietListScreen;

const styles = StyleSheet.create({});
