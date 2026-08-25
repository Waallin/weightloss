import {
  Text,
  View,
  Image,
  Alert,
  ActivityIndicator,
  Pressable,
  Linking,
} from "react-native";
import React, { useRef, useState } from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import {
  dietLabels,
  recipeDetailCopy,
  textStyles,
  typography,
} from "../../../constants/texts";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OpenAI from "openai";
import { calculateFoodPoints } from "../../../services/dietPoints";
import { useEffect } from "react";
import PrimaryButtonComponent from "../../../components/PrimaryButtonComponent";
import { trackMixpanelEvent } from "../../../services/mixpanel";

import * as Haptics from "expo-haptics";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useTodayDietStore from "../../../stores/useTodayDietStore";
import useUserStore from "../../../stores/useUserStore";
import { addToDiet } from "../../../services/firebase";
import { useNavigation } from "@react-navigation/native";
import GoBackHeaderComponent from "../../../components/GoBackHeaderComponent";
import useToastStore from "../../../stores/useToastStore";

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
  const [result, setResult] = useState(null);
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const { todayDiet, setTodayDiet } = useTodayDietStore();
  const { user } = useUserStore();
  const navigation = useNavigation();
  const { showToast } = useToastStore();
  useEffect(() => {
    if (image && !result) {
      handleScanFood();
    }
  }, [image]);

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
  "name": "Chicken rice bowl",
  "description": "Grilled chicken with rice, broccoli and sauce",
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
- Identify every meaningful component.
- Estimate the visible portion size.
- Include likely oils, sauces, dressings and toppings.
- Calculate one points value for the ENTIRE visible meal.
- Do not assign points separately and return multiple foods.
- Round points to the nearest whole number.
- Minimum points is 0.
- Never return negative points.

Keep the food name short and user-friendly.

The description should be short and useful, preferably one sentence.

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
    } catch (error) {
      console.error(error);
      setResult(null);
    } finally {
      setScanning(false);
    }
  };

  const handleRemovePhoto = () => {
    setImage(null);
    clearScanState();
  };

  const renderCamera = () => {
    if (!permission) {
      return <View style={{ flex: 1, backgroundColor: "#000" }} />;
    }

    if (!permission.granted) {
      const canAskAgain = permission.canAskAgain !== false;

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
              source={require("../../../assets/mascot/standing.png")}
              style={{
                width: 200,
                height: 200,
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
              canAskAgain ? requestPermission : () => Linking.openSettings()
            }
          />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          mode="picture"
        />
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            paddingBottom: insets.bottom + spacing.lg + 80 + spacing.md,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: SCAN_DIM,
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: spacing.md,
            }}
          >
            <Text
              style={{
                ...typography.headline,
                color: "#fff",
                textAlign: "center",
              }}
            >
              Scan your meal
            </Text>
          </View>
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
          <View style={{ flex: 1, backgroundColor: SCAN_DIM }} />
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
          {result && (
            <Image
              source={require("../../../assets/mascot/waving.png")}
              style={{
                width: 200,
                height: 200,
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
      </View>
    );
  };

  const handleAddToDiet = async () => {
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const payload = {
      id: "5",
      type: "scanned",
      title: result.name,
      points: result.points,
    };



    setTodayProgress({
      ...todayProgress,
      points: {
        ...todayProgress.points,
        used: todayProgress.points.used + parseInt(result?.points),
      },
    });

    try {
      trackMixpanelEvent("scanned_food_added_to_diet", { food: result?.name });
      setTodayDiet([...todayDiet, payload]);
      addToDiet(user?.email, payload);
      showToast("Food added to diet");
      navigation.pop(2);
    } catch (error) {
      console.error(error);
    } finally {
      setScanning(false);
    }
  };

  const renderResult = () => {
    const points = Number(result?.points);
    const headline = Number.isFinite(points)
      ? getResultHeadline(points)
      : "Looks tasty";

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
            gap: spacing.lg,
          }}
        >
          <View style={{ alignItems: "center", gap: spacing.md }}>
            {image?.uri ? (
              <Image
                source={{ uri: image.uri }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: spacing.borderRadius * 2,
                  backgroundColor: colors.ui.componentBackground,
                }}
                resizeMode="cover"
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
            <Text
              style={{
                ...typography.headline,
                color: colors.text.primary,
                textAlign: "center",
              }}
            >
              {headline}
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              padding: spacing.md,
              gap: spacing.sm,
              borderRadius: spacing.borderRadius,
              backgroundColor: colors.ui.componentBackground,
              borderWidth: 1,
              borderColor: colors.ui.cardBorder,
              ...globalStyles.shadow,
            }}
          >
            <Text
              style={{
                ...textStyles.listItemTitle,
                lineHeight: 22,
              }}
            >
              {result?.name}
            </Text>
            <Text
              style={{
                ...textStyles.listItemMeta,
                lineHeight: 20,
              }}
            >
              {result?.description}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                alignSelf: "flex-start",
                marginTop: spacing.xs,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                borderRadius: spacing.borderRadius,
                backgroundColor: colors.ui.foodPointsChipBackground,
              }}
            >
              <Text style={{ ...textStyles.listItemEmphasis }}>
                {result?.points}
              </Text>
              <Text
                style={{
                  ...typography.small,
                  marginLeft: spacing.xs,
                  color: colors.ui.primary,
                }}
              >
                {dietLabels.pointsSuffix}
              </Text>
            </View>
          </View>
        </View>
        <PrimaryButtonComponent
          title={`Add ${Number.isFinite(points) ? points : result?.points} points`}
          onPress={handleAddToDiet}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.ui.background }}>
      <View style={{ paddingHorizontal: spacing.md }}>
        <GoBackHeaderComponent title="" />
      </View>
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
