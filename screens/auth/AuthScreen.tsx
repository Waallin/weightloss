import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { globalStyles } from "../../constants/globalStyles";
import { colors } from "../../constants/colors";
import WavesBackground from "../../components/WavesBackground";
import { spacing } from "../../constants/spacing";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import PrimaryButton from "../../components/PrimaryButton";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import { Keyboard } from "react-native";
import RoleSelector from "./components/RoleSelector";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
const roles = [
  {
    id: 1,
    title: "Owner",
    Icon: "star",
  },
  {
    id: 2,
    title: "Captain",
    Icon: "anchor",
  },
  {
    id: 3,
    title: "Crew",
    Icon: "users",
  },
];

type RootStackParamList = {
  CreateProfile: undefined;
};

const AuthScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    flag: "🇺🇸",
    name: "United States",
  });
  // Country code type
  const COUNTRY_CODES = [
    { code: "+1", flag: "🇺🇸", name: "United States" },
    { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+46", flag: "🇸🇪", name: "Sweden" },
    { code: "+47", flag: "🇳🇴", name: "Norway" },
    { code: "+45", flag: "🇩🇰", name: "Denmark" },
    { code: "+49", flag: "🇩🇪", name: "Germany" },
    { code: "+33", flag: "🇫🇷", name: "France" },
  ];

  const screenWidth = Dimensions.get("window").width;
  const iconSize = screenWidth * 0.18;
  const gradientSize = iconSize * 1.5;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  function handleContinue() {
    // Animera ut nuvarande formulär
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(step + 1);
      // Återställ animationsvärden
      slideAnim.setValue(50);
      // Animera in nästa formulär
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  function handleScanQR() {
    console.log("Scan QR");
  }

  function handleChangePhoneNumber() {
    setStep(1);
    setVerificationCode("");
  }

  function handleCompleteSetup() {
    console.log("Complete Setup");
    navigation.navigate("CreateProfile");
  }

  function renderPhoneInput() {
    return (
      <View
        style={{
          flex: 1,
          marginTop: spacing.xl,
          borderTopRightRadius: spacing.xl,
          borderTopLeftRadius: spacing.xl,
          backgroundColor: "#F5F6F7",
          paddingHorizontal: spacing.md,
          minHeight: "100%",
          paddingBottom: spacing.xl,
        }}
      >
        <View
          style={{
            marginTop: spacing.md,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LinearGradient
            colors={["#E6EEF5", "#C7D8E8"]}
            style={{
              width: gradientSize,
              height: gradientSize,
              borderRadius: gradientSize / 2,
              justifyContent: "center",
              alignItems: "center",
              padding: spacing.md,
            }}
          >
            <Feather
              name="anchor"
              size={iconSize}
              color={colors.brand.primary}
            />
          </LinearGradient>
        </View>
        <View style={{ marginTop: spacing.sm }}>
          <Text
            style={{
              ...globalStyles.title,
            }}
          >
            Let's get started
          </Text>
          <Text
            style={{
              ...globalStyles.subTitle,

              marginTop: spacing.sm,
            }}
          >
            Enter your phone number to continue
          </Text>
          <View
            style={{
              ...styles.inputContainer,
              marginTop: spacing.md,
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs,
              }}
            >
              <Feather name="phone" size={20} color={colors.brand.primary} />
              <Text
                style={{
                  ...globalStyles.input,
                  color: colors.text.tertiary,
                }}
              >
                {selectedCountry.flag}
              </Text>
              <Text
                style={{
                  ...globalStyles.input,
                  color: colors.text.tertiary,
                }}
              >
                {selectedCountry.code}
              </Text>
              <Entypo name="chevron-down" size={24} color={colors.ui.border} />
              <View
                style={{
                  width: 1,
                  height: 24,
                  backgroundColor: "#E1E3E8",
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                marginLeft: spacing.md,
                justifyContent: "center",
              }}
            >
              <TextInput
                style={{
                  ...globalStyles.input,
                  color: colors.text.primary,
                  padding: 0,
                }}
                placeholder="XXX XXX XXXX"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="phone-pad"
                maxLength={9}
                onChangeText={(text) => {
                  console.log(text.length);
                  setPhoneNumber(text);
                }}
                value={phoneNumber}
              />
            </View>
          </View>
          <Text
            style={{
              ...globalStyles.smallText,

              marginTop: spacing.md,
            }}
          >
            We will send you a verification code to this number. Standard
            message rates may apply.
          </Text>
          <View style={{ marginTop: spacing.md }}>
            <PrimaryButton
              onPress={handleContinue}
              loading={loading}
              disabled={phoneNumber.length < 3}
              title="Continue"
              arrow={true}
            />
          </View>
          <View
            style={{
              marginTop: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.md,
            }}
          >
            <View style={styles.divider} />
            <Text
              style={{
                ...globalStyles.smallText,
                color: colors.ui.accent,
                fontWeight: "bold",
              }}
            >
              or
            </Text>
            <View style={styles.divider} />
          </View>
          <TouchableOpacity
            onPress={() => {
              handleScanQR();
            }}
            style={{
              marginTop: spacing.md,
              backgroundColor: colors.ui.background,
              padding: spacing.md,
              borderRadius: spacing.borderRadius,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                backgroundColor: colors.ui.white,
                padding: spacing.md,
                borderRadius: spacing.borderRadius,
              }}
            >
              <AntDesign name="qrcode" size={24} color={colors.brand.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text
                style={{
                  ...globalStyles.smallText,
                  color: colors.text.tertiary,

                  fontWeight: "bold",
                }}
              >
                Scan QR Code
              </Text>
              <Text
                style={{
                  ...globalStyles.smallText,
                  color: colors.text.tertiary,

                  marginTop: spacing.sm,
                }}
              >
                Quick login by scanning your vessel's QR code
              </Text>
            </View>
            <View>
              <Entypo
                name="chevron-right"
                size={20}
                color={colors.brand.primary}
              />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              ...globalStyles.smallText,
              color: colors.text.tertiary,
              marginTop: spacing.md,
              textAlign: "center",
            }}
          >
            Learn more about VST Boat
          </Text>
        </View>
      </View>
    );
  }

  function renderVerificationInput() {
    return (
      <View
        style={{
          flex: 1,
          marginTop: spacing.xl,
          borderTopRightRadius: spacing.xl,
          borderTopLeftRadius: spacing.xl,
          backgroundColor: "#F5F6F7",
          paddingHorizontal: spacing.md,
          minHeight: "100%",
          paddingBottom: spacing.xl,
          paddingTop: spacing.xl,
        }}
      >
        <View>
          <Text
            style={{
              ...globalStyles.title,
            }}
          >
            Verification
          </Text>
          <Text
            style={{
              ...globalStyles.subTitle,
              color: colors.text.tertiary,
              marginTop: spacing.md,
            }}
          >
            Enter the 6-digit verification code sent to your phone number
          </Text>
          <View
            style={{
              ...styles.inputContainer,
              marginTop: spacing.md,
            }}
          >
            <Feather name="lock" size={24} color={colors.brand.primary} />
            <TextInput
              style={{
                ...globalStyles.input,
                flex: 1,
                color: colors.text.primary,
                marginLeft: spacing.sm,
              }}
              placeholder="Enter the 6-digit verification code"
              onChangeText={(text) => {
                setVerificationCode(text);
              }}
              value={verificationCode}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
          <View style={{ marginTop: spacing.md }}>
            <PrimaryButton
              title="Verify"
              arrow={true}
              onPress={handleContinue}
              loading={loading}
              disabled={verificationCode.length !== 6}
            />
          </View>
          <View
            style={{
              marginTop: spacing.lg,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={handleChangePhoneNumber}>
              <Text
                style={{
                  ...globalStyles.subTitle,
                  fontWeight: "bold",
                  color: colors.text.tertiary,
                }}
              >
                Change phone number
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function renderProfileInput() {
    return (
      <View
        style={{
          flex: 1,
          marginTop: spacing.xl,
          borderTopRightRadius: spacing.xl,
          borderTopLeftRadius: spacing.xl,
          backgroundColor: "#F5F6F7",
          paddingHorizontal: spacing.md,
          minHeight: "100%",
          paddingBottom: spacing.xl,
          paddingTop: spacing.xl,
        }}
      >
        <View>
          <Text
            style={{
              ...globalStyles.title,
            }}
          >
            Create Profile
          </Text>
          <Text
            style={{
              ...globalStyles.subTitle,
              color: colors.text.tertiary,
              marginTop: spacing.md,
            }}
          >
            Looks like you're new here. Let's set up your profile.
          </Text>
          <View
            style={{
              ...styles.inputContainer,
              marginTop: spacing.md,
            }}
          >
            <Feather name="user" size={24} color={colors.brand.primary} />
            <TextInput
              style={{
                ...globalStyles.input,
                flex: 1,
                color: colors.text.primary,
                marginLeft: spacing.sm,
              }}
              placeholder="Enter your name"
              onChangeText={(text) => {
                setName(text);
              }}
              value={name}
              maxLength={20}
              autoCorrect={false}
            />
          </View>
          <View style={{ marginTop: spacing.md }}>
            <Text style={{ ...globalStyles.subTitle, fontWeight: "bold" }}>
              Select Your Role
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: spacing.md,
                marginTop: spacing.md,
              }}
            >
              {roles.map((role) => (
                <RoleSelector
                  key={role.id}
                  title={role.title}
                  icon={role.Icon}
                  selected={selectedRole.id === role.id}
                  onPress={() => setSelectedRole(role)}
                />
              ))}
            </View>
          </View>
          <View style={{ marginTop: spacing.lg }}>
            <PrimaryButton
              title="Complete Setup"
              arrow={true}
              onPress={handleCompleteSetup}
              loading={loading}
            />
          </View>
        </View>
      </View>
    );
  }

  const renderForm = () => {
    const form = (() => {
      switch (step) {
        case 1:
          return renderPhoneInput();
        case 2:
          return renderVerificationInput();
        case 3:
          return renderProfileInput();
        default:
          return renderPhoneInput();
      }
    })();

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {form}
      </Animated.View>
    );
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
        <WavesBackground />
        <SafeAreaView />
        <ScrollView
          onScrollBeginDrag={() => Keyboard.dismiss()}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={[globalStyles.authContainer, { marginTop: spacing.xl }]}>
            <Text
              style={{
                ...globalStyles.title,
                color: colors.ui.white,
                textAlign: "center",
              }}
            >
              VST Boat
            </Text>
            <Text
              style={{
                ...globalStyles.subTitle,
                color: "#E5F2FF",
                textAlign: "center",
              }}
            >
              Your complete Marine Experience
            </Text>
            {renderForm()}
          </View>
        </ScrollView>
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
                  Select country
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
                data={COUNTRY_CODES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: spacing.md,
                      borderRadius: spacing.borderRadius,
                      backgroundColor:
                        selectedCountry.code === item.code
                          ? colors.ui.background
                          : "transparent",
                      marginBottom: spacing.xs,
                    }}
                    onPress={() => handleCountrySelect(item)}
                  >
                    <Text style={{ fontSize: 24, marginRight: spacing.md }}>
                      {item.flag}
                    </Text>
                    <View>
                      <Text
                        style={{
                          ...globalStyles.input,
                          color: colors.text.primary,
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          ...globalStyles.smallText,
                          color: colors.text.tertiary,
                        }}
                      >
                        {item.code}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  boatIllustrationGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.ui.accent,
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: spacing.borderRadius,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
