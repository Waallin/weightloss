import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import React from "react";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { spacing } from "../../../constants/spacing";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FoodItem from "./components/FoodItem";
import {
    dietFoodSearchPlaceholder,
    dietLabels,
    textSizes,
    textStyles,
} from "../../../constants/texts";
import { fonts } from "../../../constants/fonts";

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
    const insets = useSafeAreaInsets();

    const renderHeader = () => {
        return (
            <View
                style={{
                    backgroundColor: colors.ui.background,
                    paddingTop: insets.top + spacing.sm,
                    paddingBottom: spacing.md,
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.goBack()}
                    style={{
                        backgroundColor: colors.ui.componentBackground,
                        borderRadius: spacing.borderRadius,
                        ...globalStyles.shadow,
                        justifyContent: "center",
                        alignItems: "center",
                        width: 44,
                        height: 44,
                    }}
                >
                    <MaterialCommunityIcons
                        name="chevron-left"
                        size={26}
                        color={colors.text.primary}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: spacing.md,
                        minHeight: 56,
                        paddingHorizontal: spacing.md,
                        borderWidth: 1,
                        borderColor: colors.ui.cardBorder,
                        borderRadius: spacing.borderRadius,
                        backgroundColor: colors.ui.white,
                    }}
                >
                    <MaterialCommunityIcons
                        name="magnify"
                        size={24}
                        color={colors.text.secondary}
                    />
                    <TextInput
                        placeholder={dietFoodSearchPlaceholder}
                        placeholderTextColor={colors.text.secondary}
                        style={{
                            flex: 1,
                            marginLeft: spacing.sm,
                            paddingVertical: spacing.md,
                            fontFamily: fonts.primary.regular,
                            fontSize: textSizes.md,
                            color: colors.text.primary,
                        }}
                    />
                </View>
            </View>
        );
    };

    const renderRecentFoodItems = () => {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        ...textStyles.screenSectionTitle,
                        marginBottom: spacing.md,
                    }}
                >
                    {dietLabels.recent}
                </Text>
                <FlatList
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        gap: spacing.sm,
                        paddingBottom: spacing.scrollViewBottomPadding,
                    }}
                    data={dummyFoodItems}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <FoodItem
                            image={item.image}
                            onPress={() => handleNavigateToAddDietScreen(item.name)}
                            name={item.name}
                            portion={item.portion}
                            kudos={item.kudos}
                            grams={item.grams}
                            icon="plus"
                        />
                    )}
                />
            </View>
        );
    };

    const handleNavigateToAddDietScreen = (_foodName?: string) => {
        Alert.alert("Add Diet", _foodName);
    };
    return (
        <View
            style={{
                ...globalStyles.container,
                flex: 1,
            }}
        >
            {renderHeader()}
            {renderRecentFoodItems()}
        </View>
    );
};

export default DietListScreen;
