import {
  Text,
  View,
  Image,
  Alert,
  ActivityIndicator,
  Pressable,
  Linking,
  ScrollView,
  TouchableOpacity,
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

type Portion = "small" | "regular" | "large";

const PORTIONS: { key: Portion; label: string; multiplier: number }[] = [
  { key: "small", label: "Small", multiplier: 0.75 },
  { key: "regular", label: "Regular", multiplier: 1 },
  { key: "large", label: "Large", multiplier: 1.35 },
];

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
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<PickedImage | null>(null);
  const [scanning, setScanning] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [scanCopyIndex, setScanCopyIndex] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [portion, setPortion] = useState<Portion>("regular");
  const [slot] = useState(slotForNow());
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const { todayDiet, setTodayDiet } = useTodayDietStore();
  const { user } = useUserStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "ScanFoodScreen">>();
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

      const base64 = await uriToBase64(photo.uri);
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
      const client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

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
                `.trim(),
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

      const food = JSON.parse(response.output_text);
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

      const points = calculateFoodPoints({
        calories: food.calories,
        protein: food.protein,
        fiber: food.fiber,
        estimatedGrams: food.estimatedGrams,
      });

      const obj = {
        points,
        name: food?.name,
        description: food?.description,
      };

      setResult(obj);
      trackMixpanelEvent(analyticsEvents.scanSucceeded, {
        points,
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
    if (!mockCameraFeed && !permission) {
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
          <View style={{ width: 44 }} />
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
          <Pressable
            onPress={openManualEntry}
            accessibilityLabel="Add food manually"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: spacing.lg,
              paddingVertical: spacing.sm,
              paddingHorizontal: 16,
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.14)",
            }}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: "#fff" }}>
              Add manually
            </Text>
          </Pressable>
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
      trackMealLogged({ method: "scan", points: Number(portionPoints), slot });
      setTodayDiet([...todayDiet, payload]);
      addToDiet(user?.email, payload);
      showToast(`${slot} added · ${portionPoints} ${ptsWord(Number(portionPoints))}`);
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
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
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
              <Text style={{ ...typography.cardTitle, fontSize: 17, lineHeight: 22, color: colors.text.primary }}>
                {result?.name}
              </Text>
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
            style={{
              height: 58,
              borderRadius: 14,
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
      </View>
    );
  };

  const showDefaultHeader =
    scanning || (image && !result) || (!image && !permission?.granted && !mockCameraFeed);

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
          : renderCamera()}
    </View>
  );
};

export default ScanFoodScreen;
