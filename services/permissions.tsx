import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

export const requestCameraPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === "granted";
};

export const requestMediaLibraryPermission = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted";
};

export const pickImageFromCamera = async () => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      throw new Error("Kameratillstånd saknas");
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error("Fel vid användning av kamera:", error);
    throw error;
  }
};

export const pickImageFromGallery = async () => {
  try {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
      throw new Error("Tillstånd för fotobibliotek saknas");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error("Fel vid val av bild från galleri:", error);
    throw error;
  }
};
