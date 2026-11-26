import {
  Text,
  View,
  Image,
  Alert,
  ActivityIndicator,
  Pressable,
  Linking,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import {
  recipeDetailCopy,
  textStyles,
  typography,
} from "../../../constants/texts";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OpenAI from "openai";
import { trackMealLogged } from "../../../services/tracking";
import { maybeAskForStoreReview } from "../../../services/storeReview";
import { calculateFoodPoints } from "../../../services/dietPoints";
import { useEffect } from "react";
import PrimaryButtonComponent from "../../../components/PrimaryButtonComponent";
import { trackMixpanelEvent } from "../../../services/mixpanel";
import { analyticsEvents } from "../../../constants/analytics";

import * as Haptics from "expo-haptics";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useTodayDietStore from "../../../stores/useTodayDietStore";
import useUserStore from "../../../stores/useUserStore";
import { addToDiet } from "../../../services/firebase";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import GoBackHeaderComponent from "../../../components/GoBackHeaderComponent";
import useToastStore from "../../../stores/useToastStore";
import { Ionicons } from "@expo/vector-icons";
import { ptsWord, slotForNow } from "../../../utils/goals";
import { SAMPLE_FOOD_BASE64 } from "../../../constants/sampleFoodBase64";

type Portion = "small" | "regular" | "large";

const PORTIONS: { key: Portion; label: string; multiplier: number }[] = [
  { key: "small", label: "Small", multiplier: 0.75 },
  { key: "regular", label: "Regular", multiplier: 1 },
  { key: "large", label: "Large", multiplier: 1.35 },
];

// Under det här visas "Is this X?" i stället för den neutrala rättelselänken
const LOW_CONFIDENCE = 0.7;
const CORRECTION_MAX_LENGTH = 200;

type PickedImage = {
  uri: string;
  base64: string;
  mimeType: string;
};

function mimeFromBase64(base64: string): string | null {
  if (base64.startsWith("/9j/")) return "image/jpeg";
  if (base64.startsWith("iVBORw0KGgo")) return "image/png";
  if (base64.startsWith("R0lGOD")) return "image/gif";
  if (base64.startsWith("UklGR")) return "image/webp";
  return null;
}

function getResultHeadline(points: number): string {
  if (points <= 0) return "On the house";
  if (points <= 3) return "That's a steal";
  if (points <= 7) return "Looks tasty";
  return "Okay, that works";
}

const SCAN_DIM = "rgba(0,0,0,0.35)";
const SCAN_CORNER_SIZE = 28;
const SCAN_CORNER_THICKNESS = 4;

function ScanFrameCorner({
  top,
  left,
  right,
  bottom,
}: {
  top?: boolean;
  left?: boolean;
  right?: boolean;
  bottom?: boolean;
}) {
  return (
    <View
      style={{
        position: "absolute",
        width: SCAN_CORNER_SIZE,
        height: SCAN_CORNER_SIZE,
        top: top ? 0 : undefined,
        bottom: bottom ? 0 : undefined,
        left: left ? 0 : undefined,
        right: right ? 0 : undefined,
        borderColor: "#fff",
        borderTopWidth: top ? SCAN_CORNER_THICKNESS : 0,
        borderBottomWidth: bottom ? SCAN_CORNER_THICKNESS : 0,
        borderLeftWidth: left ? SCAN_CORNER_THICKNESS : 0,
        borderRightWidth: right ? SCAN_CORNER_THICKNESS : 0,
      }}
    />
  );
}

type SampleFood = { id: string; label: string; source: number };

// Exempelfoton för den som inte har mat framme (första dagens guide)
const SAMPLE_FOODS: SampleFood[] = [
  { id: "pizza", label: "Pizza", source: require("../../../assets/samples/pizza.jpg") },
  { id: "chocolate", label: "Chocolate", source: require("../../../assets/samples/chocolate.jpg") },
  { id: "donut", label: "Donut", source: require("../../../assets/samples/donut.jpg") },
  { id: "salad", label: "Salad", source: require("../../../assets/samples/salad.jpg") },
];

const SCANNING_COPY = [
  {
    title: "Let's see...",
    body: "If I can get these points right. Accuracy is my middle name. Allegedly.",
  },
  {
    title: "Squinting...",
    body: "Sauce, oil, or just a very confident drizzle?",
  },
  {
    title: "Doing the math",
    body: "Protein up. Fries have entered the chat.",
  },
  {
    title: "Almost there",
    body: "Not judging. Much.",
  },
];

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function uriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const chunkSize = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

const ScanFoodScreen = () => {
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<PickedImage | null>(null);
  const [scanning, setScanning] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [scanCopyIndex, setScanCopyIndex] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [portion, setPortion] = useState<Portion>("regular");
  // Rättelse: användaren beskriver vad det egentligen är och AI:n tittar igen
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionDraft, setCorrectionDraft] = useState("");
  const [correcting, setCorrecting] = useState(false);
  const [correctionError, setCorrectionError] = useState<string | null>(null);
  const [correctedWith, setCorrectedWith] = useState<string | null>(null);
  const [slot] = useState(slotForNow());
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const { todayDiet, setTodayDiet } = useTodayDietStore();
  const { user } = useUserStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "ScanFoodScreen">>();
  // Från första dagens guide öppnas väljaren direkt
  const [samplePickerOpen, setSamplePickerOpen] = useState(route.params?.autoSample === true);
  const { showToast } = useToastStore();
  useEffect(() => {
    if (image && !result) {
      handleScanFood();
    }
  }, [image]);

  // Debug-only (-scanImage launch arg): load the image from disk instead of
  // the camera and run the normal scan. With -scanHold the image is instead
  // shown as a mocked camera feed and nothing is scanned.
  useEffect(() => {
    const debugPath = __DEV__ ? route.params?.debugImagePath : undefined;
    if (!debugPath || route.params?.debugHold) return;
    (async () => {
      try {
        const uri = debugPath.startsWith("file://")
          ? debugPath
          : `file://${debugPath}`;
        const base64 = await uriToBase64(uri);
        const mimeType = mimeFromBase64(base64);
        if (!mimeType) {
          Alert.alert("Invalid photo", "Debug image is not JPEG/PNG/GIF/WebP.");
          return;
        }
        clearScanState();
        setScanning(true);
        setImage({ uri, base64, mimeType });
      } catch (error) {
        console.error("debug scanImage failed", error);
      }
    })();
  }, []);

  // Första gången man scannar visas iOS-frågan direkt, utan skärm emellan.
  // Nekas den visas "Camera shy?"-skärmen med vägen till Inställningar.
  const askedCameraRef = useRef(false);
  useEffect(() => {
    if (permission?.status !== "undetermined") return;
    if (askedCameraRef.current || samplePickerOpen || mockCameraFeed) return;
    askedCameraRef.current = true;
    void handleRequestCamera();
  }, [permission?.status, samplePickerOpen]);

  useEffect(() => {
    if (!scanning) {
      setScanCopyIndex(0);
      return;
    }

    const intervalId = setInterval(() => {
      setScanCopyIndex((index) => (index + 1) % SCANNING_COPY.length);
    }, 2200);

    return () => clearInterval(intervalId);
  }, [scanning]);

  const clearScanState = () => {
    setResult(null);
    setScanning(false);
    setPortion("regular");
    setCorrectionOpen(false);
    setCorrectionDraft("");
    setCorrecting(false);
    setCorrectionError(null);
    setCorrectedWith(null);
  };

  const handleTakePhoto = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!cameraRef.current || takingPhoto) return;

    setTakingPhoto(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (!photo?.uri) {
        Alert.alert("Couldn't read the photo", "Try taking a new one.");
        return;
      }

      const base64 = await withTimeout(uriToBase64(photo.uri), 8000);
      const mimeType = mimeFromBase64(base64);
      if (!mimeType) {
        Alert.alert("Invalid photo", "Take a JPEG, PNG, GIF, or WebP.");
        return;
      }

      clearScanState();
      setScanning(true);
      setImage({
        uri: photo.uri,
        base64,
        mimeType,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Couldn't take photo", "Try taking a new one.");
    } finally {
      setTakingPhoto(false);
    }
  };

  // Exempelfoto för den som inte har mat framme under första dagens guide.
  // Går genom samma scanning som ett vanligt foto.
  const handleSamplePhoto = async (food: SampleFood) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (takingPhoto || scanning) return;
    setTakingPhoto(true);
    try {
      // Bundlade bilder går inte att läsa med fetch i release-builds, så base64 ligger i koden
      const base64 = SAMPLE_FOOD_BASE64[food.id];
      const mimeType = base64 ? mimeFromBase64(base64) : null;
      const uri = `data:${mimeType};base64,${base64}`;
      if (!mimeType) {
        Alert.alert("Couldn't load the sample", "Try another one or take a photo.");
        return;
      }
      trackMixpanelEvent(analyticsEvents.scanSampleUsed, { sample: food.id });
      setSamplePickerOpen(false);
      clearScanState();
      setScanning(true);
      setImage({ uri, base64, mimeType });
    } catch (error) {
      console.error(error);
      Alert.alert("Couldn't load the sample", "Try another one or take a photo.");
    } finally {
      setTakingPhoto(false);
    }
  };

  const handleScanFood = async () => {
    if (!image?.base64) {
      setScanning(false);
      Alert.alert("No photo", "Take a photo before scanning.");
      return;
    }

    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    
    if (!apiKey) {
      setScanning(false);
      Alert.alert("API key missing", "EXPO_PUBLIC_OPENAI_API_KEY is not set.");
      return;
    }

    setScanning(true);
    setResult(null);
    const scanStartedAt = Date.now();
    trackMixpanelEvent(analyticsEvents.scanStarted);

    try {
      const food = await analyzeFood(apiKey, image);
      if (!food?.isFood) {
        setImage(null);
        setResult(null);
        trackMixpanelEvent(analyticsEvents.scanFailed, {
          reason: "not_food",
          duration_ms: Date.now() - scanStartedAt,
        });
        Alert.alert("No meal found", "Take a new photo and try again.");
        return;
      }

      const obj = toResult(food);
      setResult(obj);
      trackMixpanelEvent(analyticsEvents.scanSucceeded, {
        points: obj.points,
        confidence: obj.confidence,
        duration_ms: Date.now() - scanStartedAt,
      });
    } catch (error) {
      console.error(error);
      trackMixpanelEvent(analyticsEvents.scanFailed, {
        reason: "error",
        duration_ms: Date.now() - scanStartedAt,
      });
      setResult(null);
    } finally {
      setScanning(false);
    }
  };

  const openCorrection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCorrectionError(null);
    setCorrectionDraft(correctedWith ?? "");
    setCorrectionOpen(true);
    trackMixpanelEvent(analyticsEvents.scanCorrectionOpened, {
      points: result?.points,
      confidence: result?.confidence,
      low_confidence: isLowConfidence,
      already_corrected: !!correctedWith,
    });
  };

  const closeCorrection = () => {
    if (correcting) return;
    setCorrectionOpen(false);
    setCorrectionError(null);
  };

  // Samma bild skickas igen tillsammans med användarens beskrivning.
  // Misslyckas det ligger det gamla svaret kvar.
  const handleCorrection = async () => {
    const note = correctionDraft.trim().slice(0, CORRECTION_MAX_LENGTH);
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!note || correcting || !image?.base64 || !apiKey) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCorrecting(true);
    setCorrectionError(null);
    const startedAt = Date.now();
    const before = result;

    try {
      const food = await analyzeFood(apiKey, image, note);
      if (!food?.isFood) {
        setCorrectionError("Couldn't make that work with the photo. Try describing it differently.");
        trackMixpanelEvent(analyticsEvents.scanCorrectionFailed, {
          reason: "not_food",
          duration_ms: Date.now() - startedAt,
        });
        return;
      }

      const obj = toResult(food);
      setResult(obj);
      setCorrectedWith(note);
      setCorrectionOpen(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      trackMixpanelEvent(analyticsEvents.scanCorrected, {
        text: note,
        text_length: note.length,
        name_before: before?.name,
        name_after: obj.name,
        points_before: before?.points,
        points_after: obj.points,
        points_delta: Number(obj.points) - Number(before?.points),
        confidence_before: before?.confidence,
        confidence_after: obj.confidence,
        low_confidence: isLowConfidence,
        duration_ms: Date.now() - startedAt,
      });
    } catch (error) {
      console.error(error);
      setCorrectionError("Couldn't update right now. Check your connection and try again.");
      trackMixpanelEvent(analyticsEvents.scanCorrectionFailed, {
        reason: "error",
        duration_ms: Date.now() - startedAt,
      });
    } finally {
      setCorrecting(false);
    }
  };

  const analyzeFood = async (apiKey: string, image: PickedImage, correction?: string) => {
      const client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      const correctionPrompt = correction
        ? `

USER CORRECTION:
The user looked at this photo and says: "${correction.replace(/"/g, "'")}"
Trust the user over what you see. Use their description to identify the food, sauces, toppings and portion, then estimate the nutrition and points again for the whole visible meal.
Use the user's description for the name if it names the food. The description should acknowledge what the user said in a casual way.
The photo contains food, so isFood must be true.`
        : "";

      const mime = image.mimeType ?? "image/jpeg";
      const response = await client.responses.create({
        model: "gpt-5-nano",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `
Analyze the food in this image for Kudoo, a weight-loss app that uses a simple points system instead of calorie counting.

Return ONLY valid JSON in this exact format:

{
  "isFood": true,
  "name": "Chicken bowl",
  "description": "Looks like chicken, rice, and some greens",
  "estimatedGrams": 420,
  "calories": 610,
  "protein": 48,
  "carbs": 67,
  "fat": 17,
  "fiber": 6,
  "points": 8,
  "confidence": 0.86
}

KUDOO POINT PHILOSOPHY:

Kudoo should encourage filling, nutritious foods and make healthy eating feel easy.

General rules:

- Foods with negligible calories should be 0 points.
- Most non-starchy vegetables should be 0 points.
  Examples: cucumber, lettuce, tomato, broccoli, spinach, peppers, mushrooms, zucchini.

- Black coffee, plain tea, water and zero-calorie drinks should be 0 points.

- Fruit should generally be 1 point per normal portion.
  Examples: apple, banana, orange, berries, pear.

- Eggs should generally be around 1 point per normal serving.

- Lean, filling, protein-rich foods should receive relatively low points compared with their calories.
  Examples: chicken breast, turkey, white fish, low-fat Greek yogurt, cottage cheese.

- High-fiber and filling foods should receive a favorable score.
  Examples: potatoes, beans, oats, whole grains and legumes.

- Foods that are calorie-dense and less filling should receive more points.
  Examples: chocolate, candy, pastries, chips, creamy sauces, oils and fried food.

- Protein bars are typically around 3 points depending on size and nutrition.

- A normal serving of popcorn is typically around 4 points depending on preparation.

- Chocolate is typically around 5 points for a normal small serving.

IMPORTANT:
Points are NOT a direct calorie conversion.

Two foods with the same calories may have different points.

Foods high in protein, fiber, volume and satiety should generally get fewer points.

Foods high in added sugar, saturated fat, oil or calorie density should generally get more points.

When analyzing a complete meal:
- Identify every meaningful component internally for nutrition and points.
- Estimate the visible portion size.
- Include likely oils, sauces, dressings and toppings in the nutrition estimate.
- Calculate one points value for the ENTIRE visible meal.
- Do not assign points separately and return multiple foods.
- Round points to the nearest whole number.
- Minimum points is 0.
- Never return negative points.

Keep the food name short, casual, and approximate.
Name the meal, not every ingredient. Prefer everyday labels like "Chicken bowl", "Pasta", or "Burger".
Do not list cooking methods, sauces, toppings, or sides in the name.

The description should be one loose, everyday guess. Not a spec sheet.
Do not list every visible ingredient, sauce, or topping. It is fine to be a little vague.

confidence must be a number between 0 and 1 representing how confident you are in the identification and portion estimate.

If the image does not contain food, return exactly:

{
  "isFood": false,
  "name": null,
  "description": null,
  "estimatedGrams": null,
  "calories": null,
  "protein": null,
  "carbs": null,
  "fat": null,
  "fiber": null,
  "points": null,
  "confidence": 0
}

Do not include markdown.
Do not include explanations outside the JSON.
Return JSON only.
                `.trim() + correctionPrompt,
              },
              {
                type: "input_image",
                image_url: `data:${mime};base64,${image.base64}`,
                detail: "auto",
              },
            ],
          },
        ],
      });

      return JSON.parse(response.output_text);
  };

  const toResult = (food: any) => {
    const points = calculateFoodPoints({
      calories: food.calories,
      protein: food.protein,
      fiber: food.fiber,
      estimatedGrams: food.estimatedGrams,
    });
    const confidence = Number(food?.confidence);
    return {
      points,
      name: food?.name,
      description: food?.description,
      confidence: Number.isFinite(confidence) ? confidence : undefined,
    };
  };

  const isLowConfidence =
    typeof result?.confidence === "number" && result.confidence < LOW_CONFIDENCE;

  const handleRemovePhoto = () => {
    setImage(null);
    clearScanState();
  };

  const mockCameraFeed =
    __DEV__ && route.params?.debugHold ? route.params?.debugImagePath : undefined;

  const handleRequestCamera = async () => {
    const response = await requestPermission();
    trackMixpanelEvent(analyticsEvents.cameraPermissionResult, {
      result: response?.granted ? "granted" : "denied",
    });
  };

  const openManualEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ManualFoodScreen", {
      fromFirstDayGuide: route.params?.fromFirstDayGuide,
    });
  };

  const renderManualLink = () => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={openManualEntry}
      style={{ alignItems: "center", paddingVertical: spacing.md }}
    >
      <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: colors.goals.muted }}>
        Add it manually instead
      </Text>
    </TouchableOpacity>
  );

  const renderCamera = () => {
    // Svart bakgrund medan iOS-frågan visas, så "Camera shy?" inte blinkar förbi
    if (!mockCameraFeed && (!permission || permission.status === "undetermined")) {
      return <View style={{ flex: 1, backgroundColor: "#000" }} />;
    }

    if (!mockCameraFeed && !permission?.granted) {
      const canAskAgain = permission?.canAskAgain !== false;

      return (
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            paddingHorizontal: spacing.md,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.md,
            }}
          >
            <Image
              source={require("../../../assets/mascot/camera.png")}
              style={{
                width: 300,
                height: 300,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                ...typography.headline,
                color: colors.text.primary,
                textAlign: "center",
              }}
            >
              Camera shy?
            </Text>
            <Text
              style={{
                ...textStyles.secondary,
                textAlign: "center",
                maxWidth: 260,
              }}
            >
              Let me peek at your plate so I can guess the points. I won't
              judge. Much.
            </Text>
          </View>
          <PrimaryButtonComponent
            title={canAskAgain ? "Alright, take a look" : "Fine, open Settings"}
            onPress={
              canAskAgain ? handleRequestCamera : () => Linking.openSettings()
            }
          />
          {route.params?.fromFirstDayGuide ? (
            renderSecondaryButton(
              "No food nearby? Pick a sample photo",
              "images-outline",
              () => setSamplePickerOpen(true),
            )
          ) : null}
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#17151D" }}>
        {mockCameraFeed ? (
          <Image
            source={{ uri: `file://${mockCameraFeed.replace(/^file:\/\//, "")}` }}
            style={{ flex: 1 }}
            resizeMode="cover"
          />
        ) : (
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing="back"
            mode="picture"
          />
        )}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <View style={{ flex: 1, backgroundColor: SCAN_DIM }} />
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "9%", backgroundColor: SCAN_DIM }} />
            <View style={{ width: "82%", aspectRatio: 1 }}>
              <ScanFrameCorner top left />
              <ScanFrameCorner top right />
              <ScanFrameCorner bottom left />
              <ScanFrameCorner bottom right />
            </View>
            <View style={{ width: "9%", backgroundColor: SCAN_DIM }} />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: SCAN_DIM,
              alignItems: "center",
              paddingTop: spacing.md,
            }}
          >
            <Text
              style={{
                ...typography.body,
                fontSize: 15,
                color: "rgba(255,255,255,0.78)",
                textAlign: "center",
              }}
            >
              Fit the whole plate in the frame
            </Text>
          </View>
          <View
            style={{
              height: insets.bottom + spacing.lg + 80,
              backgroundColor: SCAN_DIM,
            }}
          />
        </View>
        <View
          style={{
            position: "absolute",
            top: spacing.md,
            left: 20,
            right: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
            accessibilityLabel="Close camera"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.14)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>
          <View
            style={{
              paddingVertical: spacing.sm,
              paddingHorizontal: 14,
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.14)",
            }}
          >
            <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: "#fff" }}>
              {slot}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.replace("BarcodeScanScreen", {
                source: "photo_scan",
                fromFirstDayGuide: route.params?.fromFirstDayGuide,
              });
            }}
            accessibilityLabel="Scan a barcode"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.14)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="barcode-outline" size={22} color="#fff" />
          </Pressable>
        </View>
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: insets.bottom + spacing.lg,
            alignItems: "center",
          }}
        >
          <Pressable onPress={handleTakePhoto} disabled={takingPhoto}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                borderWidth: 4,
                borderColor: "white",
                alignItems: "center",
                justifyContent: "center",
                opacity: takingPhoto ? 0.6 : 1,
              }}
            >
              <View
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 31,
                  backgroundColor: "white",
                }}
              />
            </View>
          </Pressable>
          {route.params?.fromFirstDayGuide ? (
            <Pressable
              onPress={() => setSamplePickerOpen(true)}
              disabled={takingPhoto}
              style={{
                marginTop: spacing.md,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 12,
                paddingHorizontal: 18,
                borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.16)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <Ionicons name="images-outline" size={18} color="#fff" />
              <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: "#fff" }}>
                No food nearby? Pick a sample photo
              </Text>
            </Pressable>
          ) : null}
        </View>
        {takingPhoto ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          >
            <ActivityIndicator color="#fff" />
          </View>
        ) : null}
      </View>
    );
  };

  const renderScanning = () => {
    const copy = SCANNING_COPY[scanCopyIndex] ?? SCANNING_COPY[0];

    return (
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.md,
          paddingHorizontal: spacing.md,
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.lg,
        }}
      >
        <View
          style={{
            width: 228,
            height: 232,
            marginBottom: spacing.sm,
          }}
        >
          {image?.uri ? (
            <Image
              source={{ uri: image.uri }}
              style={{
                width: 200,
                height: 200,
                borderRadius: spacing.borderRadius * 2,
                backgroundColor: colors.ui.componentBackground,
              }}
            />
          ) : (
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: spacing.borderRadius * 2,
                backgroundColor: colors.ui.secondaryBackground,
              }}
            />
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingVertical: 14,
            paddingHorizontal: spacing.md,
            borderRadius: 16,
            backgroundColor: colors.goals.dark,
          }}
        >
          <MotiView
            from={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 700, loop: true, reduceMotion: ReduceMotion.Never }}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.goals.eatRing,
            }}
          />
          <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: "#fff" }}>
            Reading your plate…
          </Text>
        </View>

        <MotiView
          key={scanCopyIndex}
          from={{ opacity: 0, translateY: 6 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 280,
            reduceMotion: ReduceMotion.Never,
          }}
          style={{
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <Text
            style={{
              ...typography.headline,
              color: colors.text.primary,
              textAlign: "center",
            }}
          >
            {copy.title}
          </Text>
          <Text
            style={{
              ...textStyles.secondary,
              textAlign: "center",
              maxWidth: 260,
            }}
          >
            {copy.body}
          </Text>
        </MotiView>
      </View>
    );
  };

  const renderNoResult = () => {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.md,
          paddingHorizontal: spacing.md,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.md,
          }}
        >
          {!result && (
            <Image
              source={require("../../../assets/mascot/noFood.png")}
              style={{
                width: 300,
                height: 300,
              }}
              resizeMode="contain"
            />
          )}

          <Text
            style={{
              ...typography.headline,
              color: colors.text.primary,
              textAlign: "center",
            }}
          >
            No meal found
          </Text>
          <Text
            style={{
              ...textStyles.secondary,
              textAlign: "center",
              maxWidth: 260,
            }}
          >
            Take a new photo and try again.
          </Text>
        </View>

        <PrimaryButtonComponent
          title="Scan again"
          onPress={handleRemovePhoto}
        />
        {renderManualLink()}
      </View>
    );
  };

  const getPortionPoints = () => {
    const base = Number(result?.points);
    if (!Number.isFinite(base)) return result?.points;
    const multiplier = PORTIONS.find((p) => p.key === portion)?.multiplier ?? 1;
    return Math.max(0, Math.round(base * multiplier));
  };

  const handleAddToDiet = async () => {
    if (correcting) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const portionPoints = getPortionPoints();

    const payload = {
      id: "5",
      type: "scanned",
      title: result.name,
      points: portionPoints,
    };



    setTodayProgress({
      ...todayProgress,
      points: {
        ...todayProgress.points,
        used: todayProgress.points.used + parseInt(portionPoints),
      },
    });

    try {
      trackMixpanelEvent(analyticsEvents.dietScanAdded, { food: result?.name });
      trackMealLogged({ method: "scan", points: Number(portionPoints), slot, corrected: !!correctedWith });
      setTodayDiet([...todayDiet, payload]);
      addToDiet(user?.email, payload);
      showToast(`${slot} added · ${portionPoints} ${ptsWord(Number(portionPoints))}`);
      void maybeAskForStoreReview("meal_logged");
      if (route.params?.fromFirstDayGuide) {
        navigation.navigate("FirstDayGuide", { mealLogged: true });
      } else {
        navigation.popTo("MainNavigator");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setScanning(false);
    }
  };

  // Diskret rad under namnet. Vid låg säkerhet blir den en fråga.
  const renderCorrection = () => {
    if (correctionOpen) {
      const canSend = correctionDraft.trim().length > 0 && !correcting;
      return (
        <View style={{ marginTop: 12, gap: 10 }}>
          <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: colors.text.primary }}>
            What is it really?
          </Text>
          <TextInput
            value={correctionDraft}
            onChangeText={setCorrectionDraft}
            placeholder="e.g. it's garlic sauce, not béarnaise"
            placeholderTextColor={colors.goals.muted}
            autoFocus
            multiline
            maxLength={CORRECTION_MAX_LENGTH}
            editable={!correcting}
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={() => canSend && handleCorrection()}
            accessibilityLabel="Describe the food"
            style={{
              ...typography.body,
              fontSize: 16,
              lineHeight: 22,
              color: colors.text.primary,
              minHeight: 72,
              maxHeight: 120,
              paddingHorizontal: 14,
              paddingTop: 12,
              paddingBottom: 12,
              borderRadius: 14,
              backgroundColor: "#F2F2F4",
              textAlignVertical: "top",
            }}
          />
          {correctionError ? (
            <Text style={{ ...typography.small, fontSize: 13, color: colors.goals.over }}>
              {correctionError}
            </Text>
          ) : null}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={closeCorrection}
              disabled={correcting}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F2F2F4",
              }}
            >
              <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: colors.goals.muted }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCorrection}
              disabled={!canSend}
              accessibilityState={{ disabled: !canSend, busy: correcting }}
              style={{
                flex: 2,
                height: 44,
                borderRadius: 12,
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.text.primary,
                opacity: canSend || correcting ? 1 : 0.35,
              }}
            >
              {correcting ? <ActivityIndicator size="small" color={colors.ui.white} /> : null}
              <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: colors.ui.white }}>
                {correcting ? "Taking another look…" : "Update"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (correctedWith) {
      return (
        <Pressable
          onPress={openCorrection}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Updated with your note. Edit note"
          style={{ marginTop: 6, flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Ionicons name="checkmark-circle" size={16} color={colors.goals.eat} />
          <Text style={{ ...typography.small, fontSize: 14, color: colors.goals.muted }}>
            Updated with your note ·{" "}
            <Text style={{ ...typography.bodySemiBold, fontSize: 14, color: colors.text.primary }}>Edit</Text>
          </Text>
        </Pressable>
      );
    }

    return (
      <Pressable
        onPress={openCorrection}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Not quite right? Tell Kudoo what it is"
        style={{ marginTop: 6 }}
      >
        <Text style={{ ...typography.small, fontSize: 14, color: colors.goals.muted }}>
          {isLowConfidence ? "Is this right? " : "Not quite? "}
          <Text style={{ ...typography.bodySemiBold, fontSize: 14, color: colors.text.primary }}>
            Tell Kudoo what it is
          </Text>
        </Text>
      </Pressable>
    );
  };

  const renderResult = () => {
    const portionPoints = getPortionPoints();
    const points = Number(portionPoints);
    const pointsFinite = Number.isFinite(points);
    const headline = pointsFinite ? getResultHeadline(points) : "Looks tasty";
    const total = todayProgress?.points?.total ?? 0;
    const used = todayProgress?.points?.used ?? 0;
    const leftAfter = total - used - (pointsFinite ? points : 0);
    const overAfter = leftAfter < 0;
    const cheer = overAfter
      ? "Logged. Honest days count too, and tomorrow starts fresh."
      : `${headline}. ${result?.description ?? ""}`.trim();

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: spacing.md,
            paddingHorizontal: 20,
            paddingBottom: spacing.lg,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleRemovePhoto();
              }}
              accessibilityLabel="Retake photo"
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: colors.ui.white,
                alignItems: "center",
                justifyContent: "center",
                ...globalStyles.shadow,
                shadowOpacity: 0.06,
              }}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
            </Pressable>
            <Text style={{ ...typography.cardTitle, fontSize: 17, color: colors.text.primary }}>{slot}</Text>
            <View style={{ width: 44 }} />
          </View>

          <MotiView
            from={{ opacity: 0, translateY: 12, scale: 0.98 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: "timing", duration: 420, reduceMotion: ReduceMotion.Never }}
            style={{
              marginTop: 18,
              backgroundColor: colors.ui.white,
              borderRadius: 24,
              padding: 20,
              ...globalStyles.shadow,
              shadowOpacity: 0.06,
            }}
          >
            <View style={{ gap: 14 }}>
              {image?.uri ? (
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: "100%", aspectRatio: 1, borderRadius: 16, backgroundColor: colors.ui.secondaryBackground }}
                  resizeMode="cover"
                />
              ) : null}
              <View>
                <Text style={{ ...typography.cardTitle, fontSize: 17, lineHeight: 22, color: colors.text.primary }}>
                  {result?.name}
                </Text>
                {renderCorrection()}
              </View>
            </View>

            <View style={{ marginTop: 20, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
              <View>
                <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
                  <Text style={{ ...typography.displayNumeric, fontSize: 56, lineHeight: 62, color: colors.goals.eat }}>
                    {pointsFinite ? points : portionPoints}
                  </Text>
                  <Text style={{ ...typography.cardTitle, fontSize: 17, color: colors.goals.eat }}>
                    {points === 1 ? "point" : "points"}
                  </Text>
                </View>
                <Text style={{ ...typography.body, fontSize: 15, color: colors.goals.muted }}>this meal</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ ...typography.displayNumeric, fontSize: 34, lineHeight: 40, color: overAfter ? colors.goals.over : colors.text.primary }}>
                  {overAfter ? -leftAfter : leftAfter}
                </Text>
                <Text style={{ ...typography.body, fontSize: 15, color: colors.goals.muted }}>
                  {overAfter ? "over today" : "left today"}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 18,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 10,
                paddingRight: 12,
                paddingLeft: 6,
                borderRadius: 14,
                backgroundColor: colors.goals.eatSoft,
              }}
            >
              <Image
                source={require("../../../assets/mascot/logging.png")}
                resizeMode="contain"
                style={{ width: 52, height: 52 }}
              />
              <Text style={{ flex: 1, ...typography.bodySemiBold, fontSize: 15, lineHeight: 21, color: colors.goals.eatSoftText }}>
                {cheer}
              </Text>
            </View>
          </MotiView>

          <View
            style={{
              marginTop: 12,
              backgroundColor: colors.ui.white,
              borderRadius: 24,
              padding: spacing.md,
              ...globalStyles.shadow,
              shadowOpacity: 0.04,
            }}
          >
            <View
              accessibilityRole="radiogroup"
              accessibilityLabel="Portion size"
              style={{ flexDirection: "row", gap: 4, padding: 4, borderRadius: 14, backgroundColor: "#F2F2F4" }}
            >
              {PORTIONS.map((p) => {
                const on = portion === p.key;
                return (
                  <Pressable
                    key={p.key}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setPortion(p.key);
                    }}
                    style={{
                      flex: 1,
                      height: 40,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: on ? colors.ui.white : "transparent",
                      shadowColor: colors.goals.dark,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: on ? 0.14 : 0,
                      shadowRadius: 3,
                      elevation: on ? 2 : 0,
                    }}
                  >
                    <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: on ? colors.text.primary : colors.goals.muted }}>
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={{ ...typography.small, fontSize: 13, color: colors.goals.muted, marginTop: 10 }}>
              Not quite right? Change the portion size.
            </Text>
          </View>
        </ScrollView>
        <View style={{ paddingTop: 12, paddingHorizontal: 20, paddingBottom: insets.bottom + spacing.sm }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAddToDiet}
            disabled={correcting}
            style={{
              height: 58,
              borderRadius: 14,
              opacity: correcting ? 0.5 : 1,
              backgroundColor: colors.goals.eat,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: colors.goals.eat,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.28,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            <Text style={{ ...typography.button, fontSize: 18, color: colors.ui.white }}>
              Add to {slot.toLowerCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };

  // Vit sekundärknapp med tunn kant och mjuk skugga (samma stil som i första dagens guide)
  const renderSecondaryButton = (
    label: string,
    icon: React.ComponentProps<typeof Ionicons>["name"],
    onPress: () => void,
  ) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        marginTop: spacing.sm,
        height: 54,
        borderRadius: 14,
        backgroundColor: colors.ui.componentBackground,
        borderWidth: 1,
        borderColor: colors.ui.cardBorder,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        shadowColor: colors.ui.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <Ionicons name={icon} size={20} color={colors.ui.primary} />
      <Text style={{ ...typography.bodySemiBold, fontSize: 16, color: colors.text.primary }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Två rutor per rad, med fast storlek så att stora fotofiler inte styr layouten
  const sampleTile = Math.floor((windowWidth - spacing.md * 3) / 2);

  const renderSamplePicker = () => (
    <View
      style={{
        flex: 1,
        paddingHorizontal: spacing.md,
        paddingBottom: insets.bottom + spacing.md,
      }}
    >
      <View style={{ alignItems: "center", gap: spacing.xs, marginTop: spacing.sm }}>
        <Text style={{ ...typography.headline, color: colors.text.primary, textAlign: "center" }}>
          Pick something to scan
        </Text>
        <Text style={{ ...textStyles.secondary, textAlign: "center", maxWidth: 280 }}>
          We'll count the points, just like with your own meal.
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.md,
          marginTop: spacing.lg,
        }}
      >
        {SAMPLE_FOODS.map((food) => (
          <Pressable
            key={food.id}
            onPress={() => handleSamplePhoto(food)}
            disabled={takingPhoto}
            style={{ width: sampleTile, opacity: takingPhoto ? 0.6 : 1 }}
          >
            <Image
              source={food.source}
              style={{ width: sampleTile, height: sampleTile, borderRadius: 16 }}
              resizeMode="cover"
            />
            <Text
              style={{
                ...typography.bodySemiBold,
                fontSize: 16,
                color: colors.text.primary,
                textAlign: "center",
                marginTop: spacing.xs,
              }}
            >
              {food.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={{ flex: 1 }} />
      {renderSecondaryButton("Use the camera instead", "camera-outline", () =>
        setSamplePickerOpen(false),
      )}
    </View>
  );

  const showSamplePicker = samplePickerOpen && !scanning && !image;

  const showDefaultHeader =
    scanning ||
    showSamplePicker ||
    (image && !result) ||
    (!image && !permission?.granted && !mockCameraFeed);

  return (
    <View style={{ flex: 1, backgroundColor: colors.ui.background }}>
      {showDefaultHeader ? (
        <View style={{ paddingHorizontal: spacing.md }}>
          <GoBackHeaderComponent title="" />
        </View>
      ) : null}
      {scanning
        ? renderScanning()
        : image
          ? result
            ? renderResult()
            : renderNoResult()
          : showSamplePicker
            ? renderSamplePicker()
            : renderCamera()}
    </View>
  );
};

export default ScanFoodScreen;
