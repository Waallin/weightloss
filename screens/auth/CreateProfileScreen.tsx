import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Linking,
  Alert,
  Image,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { globalStyles } from "../../constants/globalStyles";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { AntDesign, Feather } from "@expo/vector-icons";
import ProfileInputRowTitle from "../../components/ProfileInputRowTitle";
import ProfileInputRow from "../../components/ProfileInputRow";
import PrimaryButton from "../../components/PrimaryButton";
import SwitchInputRow from "./components/SwitchInputRow";
import DropdownRow from "./components/DropdownRow";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import globalApi from "../../services/api";
import useUserStore from "../../stores/useUserStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useToastStore from "../../stores/useToastStore";
import * as ImagePicker from "expo-image-picker";
import {
  pickImageFromCamera,
  pickImageFromGallery,
} from "../../services/permissions";

const sections = [
  {
    id: 1,
    title: "Personal",
  },
  {
    id: 2,
    title: "Boating",
  },
  {
    id: 3,
    title: "Preferences",
  },
];

const measurementUnits = [
  {
    id: 1,
    title: "Metric",
  },
  {
    id: 2,
    title: "Imperial",
  },
];

const languages = [
  {
    id: 1,
    title: "English",
    value: "en",
  },
  {
    id: 2,
    title: "Svenska",
    value: "sv",
  },
];

const CreateProfileScreen = ({
  route,
}: {
  route: { params: { token: string } };
}) => {
  const { token } = route.params;
  const { setUser } = useUserStore();
  const [procent, setProcent] = useState(0);
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedProcent = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [photo, setPhoto] = useState<any>(null);
  const { showToast } = useToastStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [boatingLicense, setBoatingLicense] = useState("");
  const [certifications, setCertifications] = useState("");
  const [preferredWater, setPreferredWater] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState("");

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedMeasurementUnit, setSelectedMeasurementUnit] = useState(
    measurementUnits[0]
  );

  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<any[]>([]);
  const [currentDropdownType, setCurrentDropdownType] = useState<
    "language" | "measurement" | null
  >(null);

  useEffect(() => {
    animatedWidth.setValue(0);
    animateUnderline();
  }, [selectedSection]);

  const animateUnderline = () => {
    Animated.spring(animatedWidth, {
      toValue: 1,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  };

  const renderSection = () => {
    return (
      <View
        style={{
          marginTop: spacing.md,
          flexDirection: "row",
          gap: spacing.md,
        }}
      >
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedSection(section);
              setStep(section.id);
              setProcent((section.id - 1) * 33);
              Animated.spring(animatedProcent, {
                toValue: (section.id - 1) * 33,
                useNativeDriver: false,
                tension: 40,
                friction: 8,
              }).start();
            }}
          >
            <View style={{ marginTop: spacing.md }}>
              <Text
                style={{
                  ...globalStyles.subTitle,
                  color: colors.text.secondary,
                  fontWeight: "bold",
                }}
              >
                {section.title}
              </Text>
              <Animated.View
                style={{
                  height: 3,
                  backgroundColor:
                    selectedSection.id === section.id
                      ? colors.ui.darkBlue
                      : "transparent",
                  marginTop: spacing.sm,
                  borderRadius: spacing.borderRadius,
                  transform: [
                    {
                      scaleX:
                        selectedSection.id === section.id ? animatedWidth : 0,
                    },
                  ],
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleChangePhoto = async () => {
    try {
      Alert.alert(
        "Choose Image Source",
        "How would you like to add your profile picture?",
        [
          {
            text: "Camera",
            onPress: async () => {
              const imageUri = await pickImageFromCamera();
              if (imageUri) {
                setPhoto(imageUri);
              }
            },
          },
          {
            text: "Gallery",
            onPress: async () => {
              const imageUri = await pickImageFromGallery();
              if (imageUri) {
                setPhoto(imageUri);
              }
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to select image. Please try again.");
      console.error(error);
    }
  };

  // step 1
  const renderPersonalInfo = () => {
    return (
      <View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: spacing.lg,
          }}
        >
          {!photo ? (
            <TouchableOpacity
              onPress={handleChangePhoto}
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.ui.lightGrey,
                borderRadius: spacing.rounded,
                justifyContent: "center",
                alignItems: "center",
                padding: spacing.xl,
              }}
            >
              <Feather name="user" size={42} color={colors.ui.grey} />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  borderRadius: spacing.rounded,
                  backgroundColor: colors.ui.darkBlue,
                  padding: spacing.sm,
                }}
              >
                <Feather name="camera" size={18} color={colors.ui.white} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleChangePhoto}
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.ui.lightGrey,
                borderRadius: spacing.rounded,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: photo }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: spacing.rounded,
                }}
                resizeMode="cover"
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  borderRadius: spacing.rounded,
                  backgroundColor: colors.ui.darkBlue,
                  padding: spacing.sm,
                }}
              >
                <Feather name="camera" size={18} color={colors.ui.white} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View>
          <ProfileInputRowTitle title="Personal Information" icon="user" />
          <ProfileInputRow
            title="Full name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
          />
          <ProfileInputRow
            title="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />

          <ProfileInputRow
            title="Address"
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
          />
          <ProfileInputRowTitle title="Emergency Contact" icon="phone" />
          <ProfileInputRow
            title="Emergency Contact"
            placeholder="Emergency name"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
          />
          <ProfileInputRow
            title="Emergency Phone Number"
            placeholder="Emergency phone number"
            value={emergencyPhoneNumber}
            keyboardType="numeric"
            onChangeText={setEmergencyPhoneNumber}
          />
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <PrimaryButton title="Next" onPress={handleNext} />
        </View>
      </View>
    );
  };

  // step 2
  const renderBoatingInfo = () => {
    return (
      <View>
        <ProfileInputRowTitle title="Boating Information" icon="map" />

        <ProfileInputRow
          title="Experience Level"
          placeholder="Select your experience level"
          value={experienceLevel}
          onChangeText={setExperienceLevel}
        />
        <ProfileInputRow
          title="Boating License"
          placeholder="Enter your boating license"
          value={boatingLicense}
          onChangeText={setBoatingLicense}
        />
        <ProfileInputRow
          title="Certifications"
          placeholder="Enter your certifications"
          value={certifications}
          onChangeText={setCertifications}
        />
        <ProfileInputRow
          title="Preferred Water"
          placeholder="Enter your preferred water"
          value={preferredWater}
          onChangeText={setPreferredWater}
        />
        <View style={{ marginTop: spacing.lg }}>
          <PrimaryButton title="Next" onPress={handleNext} />
        </View>
      </View>
    );
  };

  // step 3
  const renderPreferences = () => {
    return (
      <View>
        <ProfileInputRowTitle title="App Preferences" icon="settings" />
        <SwitchInputRow
          title="Notifications"
          value={notifications}
          onChange={setNotifications}
        />

        <DropdownRow
          title="Language"
          value={selectedLanguage}
          onChange={setSelectedLanguage}
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
          onChange={setSelectedMeasurementUnit}
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
        >
          <TouchableOpacity onPress={openPrivacyPolicy}>
            <Text style={{ ...globalStyles.subTitle, color: colors.text.link }}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openTermsOfService}>
            <Text style={{ ...globalStyles.subTitle, color: colors.text.link }}>
              Terms of Service
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <PrimaryButton title="Complete" onPress={handleComplete} />
        </View>
      </View>
    );
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderBoatingInfo();
      case 3:
        return renderPreferences();
    }
  };

  const handleNext = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setTimeout(() => {
      setStep(step + 1);

      Animated.spring(animatedProcent, {
        toValue: procent + 33,
        useNativeDriver: false,
        tension: 40,
        friction: 8,
      }).start();

      setProcent(procent + 33);
      setSelectedSection(sections[step]);
    }, 300);
  };

  const handleComplete = async () => {
    let formData = new FormData();

    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("date_of_birth", "1990-01-01");
    formData.append("address", address);
    formData.append("emergency_contact", emergencyContact);
    formData.append("emergency_phone_number", emergencyPhoneNumber);

    if (photo) {
      formData.append("image", {
        uri: photo,
        name: "profile.png",
        type: "image/png",
      } as any);
    }

    const boatingInfoPayload = {
      experience_level: experienceLevel,
      boating_license: boatingLicense,
      certifications: certifications,
      preferred_waters: preferredWater,
    };

    const preferencesPayload = {
      language: selectedLanguage.value,
      measurement_unit: selectedMeasurementUnit.title.toLowerCase(),
      notification: notifications ? 1 : 0,
    };

    const endpoints = [
      { endpoint: "profile/setup", payload: formData },
      { endpoint: "boating", payload: boatingInfoPayload },
      { endpoint: "preferences", payload: preferencesPayload },
    ];

    for (const { endpoint, payload } of endpoints) {
      const response = await handlePostFunction({ endpoint, payload });
      if (!response.success) {
        return;
      }
    }

    await AsyncStorage.setItem("user_token", token);

    navigation.navigate("AddBoat");
  };

  const handlePostFunction = async ({
    endpoint,
    payload,
  }: {
    endpoint: string;
    payload: any;
  }) => {
    const response = await globalApi("POST", endpoint, payload, token);
    return response;
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

  const openPrivacyPolicy = () => {
    Linking.openURL("https://www.google.com");
  };

  const openTermsOfService = () => {
    Linking.openURL("https://www.google.com");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={globalStyles.scrollContainer}>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: spacing.scrollViewBottomPadding,
              paddingTop: spacing.lg,
              flexGrow: 1,
            }}
          >
            <View>
              <View
                style={{
                  height: 10,
                  backgroundColor: colors.brand.light,
                  borderRadius: spacing.borderRadius,
                  position: "relative",
                }}
              >
                <Animated.View
                  style={{
                    width: animatedProcent.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                    height: 10,
                    backgroundColor: colors.ui.darkBlue,
                    borderRadius: spacing.borderRadius,
                    position: "absolute",
                    left: 0,
                  }}
                />
              </View>
              <Text
                style={{
                  ...globalStyles.smallText,
                  color: colors.text.secondary,
                  marginTop: spacing.sm,
                }}
                onPress={() => console.log(photo)}
              >
                {procent}% completed
              </Text>
            </View>
            {renderSection()}
            {renderForm()}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      {renderModal()}
    </KeyboardAvoidingView>
  );
};

export default CreateProfileScreen;

const styles = StyleSheet.create({});
