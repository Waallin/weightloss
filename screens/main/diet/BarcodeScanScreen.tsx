import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import { textStyles, typography } from "../../../constants/texts";
import { analyticsEvents } from "../../../constants/analytics";
import PrimaryButtonComponent from "../../../components/PrimaryButtonComponent";
import GoBackHeaderComponent from "../../../components/GoBackHeaderComponent";
import { trackMixpanelEvent } from "../../../services/mixpanel";
import { trackMealLogged } from "../../../services/tracking";
import { maybeAskForStoreReview } from "../../../services/storeReview";
import { addToDiet } from "../../../services/firebase";
import {
  defaultPortion,
  lookupBarcode,
  normalizeBarcode,
  pointsForGrams,
  portionOptions,
  type BarcodeProduct,
  type PortionKey,
} from "../../../services/openFoodFacts";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useTodayDietStore from "../../../stores/useTodayDietStore";
import useUserStore from "../../../stores/useUserStore";
import useToastStore from "../../../stores/useToastStore";
import { ptsWord, slotForNow } from "../../../utils/goals";
import { RootStackParamList } from "../../navigation/types";

type Input = "camera" | "typed";

type ScreenState =
  | { kind: "camera" }
  | { kind: "typing" }
  | { kind: "looking_up"; barcode: string }
  | { kind: "result"; product: BarcodeProduct }
  | { kind: "not_found"; barcode: string; reason: "not_in_database" | "no_nutrition" }
  | { kind: "error"; barcode: string; input: Input };

const BARCODE_TYPES = ["ean13", "ean8", "upc_a", "upc_e"] as const;
const SCAN_DIM = "rgba(0,0,0,0.45)";
const CORNER = 26;
const CORNER_THICKNESS = 4;
const FIELD_BACKGROUND = "#F2F2F4";

function Corner({ top, left }: { top?: boolean; left?: boolean }) {
  return (
    <View
      style={{
        position: "absolute",
        width: CORNER,
        height: CORNER,
        top: top ? 0 : undefined,
        bottom: top ? undefined : 0,
        left: left ? 0 : undefined,
        right: left ? undefined : 0,
        borderColor: "#fff",
        borderTopWidth: top ? CORNER_THICKNESS : 0,
        borderBottomWidth: top ? 0 : CORNER_THICKNESS,
        borderLeftWidth: left ? CORNER_THICKNESS : 0,
        borderRightWidth: left ? 0 : CORNER_THICKNESS,
      }}
    />
  );
}

const BarcodeScanScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "BarcodeScanScreen">>();
  const [permission, requestPermission] = useCameraPermissions();
  const [state, setState] = useState<ScreenState>({ kind: "camera" });
  const [typedBarcode, setTypedBarcode] = useState("");
  const [portion, setPortion] = useState<PortionKey>("100g");
  const [customGrams, setCustomGrams] = useState("");
  const [slot] = useState(slotForNow());
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const { todayDiet, setTodayDiet } = useTodayDietStore();
  const { user } = useUserStore();
  const { showToast } = useToastStore();

  // Kameran kan rapportera samma kod många gånger per sekund
  const lockedRef = useRef(false);
  const startedAtRef = useRef(Date.now());
  const inputRef = useRef<Input>("camera");

  useEffect(() => {
    trackMixpanelEvent(analyticsEvents.barcodeScanStarted, {
      source: route.params?.source ?? "diet_list",
    });
  }, []);

  const askedCameraRef = useRef(false);
  useEffect(() => {
    if (permission?.status !== "undetermined" || askedCameraRef.current) return;
    askedCameraRef.current = true;
    void handleRequestCamera();
  }, [permission?.status]);

  const handleRequestCamera = async () => {
    const response = await requestPermission();
    trackMixpanelEvent(analyticsEvents.cameraPermissionResult, {
      result: response?.granted ? "granted" : "denied",
      context: "barcode",
    });
  };

  const resetToCamera = () => {
    lockedRef.current = false;
    startedAtRef.current = Date.now();
    setTypedBarcode("");
    setState({ kind: "camera" });
  };

  const handleLookup = async (raw: string, input: Input) => {
    const barcode = normalizeBarcode(raw);
    if (!barcode) {
      lockedRef.current = false;
      return;
    }
    inputRef.current = input;
    setState({ kind: "looking_up", barcode });
    const result = await lookupBarcode(barcode);
    const duration_ms = Date.now() - startedAtRef.current;

    if (result.status === "found") {
      const initial = defaultPortion(result.product);
      setPortion(initial.key);
      setCustomGrams(String(Math.round(initial.grams)));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      trackMixpanelEvent(analyticsEvents.barcodeScanSucceeded, {
        duration_ms,
        input,
        points: pointsForGrams(result.product, initial.grams).points,
        has_serving: !!result.product.servingGrams,
      });
      setState({ kind: "result", product: result.product });
    } else if (result.status === "not_found") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      trackMixpanelEvent(analyticsEvents.barcodeProductNotFound, {
        reason: result.reason,
        barcode,
        input,
        duration_ms,
      });
      setState({ kind: "not_found", barcode, reason: result.reason });
    } else {
      trackMixpanelEvent(analyticsEvents.barcodeScanFailed, {
        reason: result.reason,
        input,
        duration_ms,
      });
      setState({ kind: "error", barcode, input });
    }
  };

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (lockedRef.current || state.kind !== "camera") return;
    if (!normalizeBarcode(data)) return;
    lockedRef.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    void handleLookup(data, "camera");
  };

  const handleSubmitTyped = () => {
    if (!normalizeBarcode(typedBarcode)) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void handleLookup(typedBarcode, "typed");
  };

  const openPhotoScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.replace("ScanFoodScreen", { fromFirstDayGuide: route.params?.fromFirstDayGuide });
  };

  const openManualEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.replace("ManualFoodScreen", { fromFirstDayGuide: route.params?.fromFirstDayGuide });
  };

  const gramsFor = (product: BarcodeProduct) => {
    if (portion === "custom") {
      const n = parseFloat(customGrams.replace(",", "."));
      return Number.isFinite(n) && n > 0 ? n : 0;
    }
    return portionOptions(product).find((o) => o.key === portion)?.grams ?? 100;
  };

  const handleAddToDiet = (product: BarcodeProduct) => {
    const grams = gramsFor(product);
    if (grams <= 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { points, calories } = pointsForGrams(product, grams);

    const payload = {
      id: "barcode",
      sourceId: `barcode_${product.barcode}`,
      type: "barcode",
      title: product.name,
      points,
      calories,
      barcode: product.barcode,
      grams: Math.round(grams),
    };

    setTodayProgress({
      ...todayProgress,
      points: {
        ...todayProgress.points,
        used: todayProgress.points.used + points,
      },
    });

    try {
      trackMealLogged({ method: "barcode", points, slot, portion });
      setTodayDiet([...todayDiet, payload]);
      addToDiet(user?.email, payload);
      showToast(`${slot} added · ${points} ${ptsWord(points)}`);
      void maybeAskForStoreReview("meal_logged");
      if (route.params?.fromFirstDayGuide) {
        navigation.navigate("FirstDayGuide", { mealLogged: true });
      } else {
        navigation.popTo("MainNavigator");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderTextLink = (label: string, onPress: () => void, color = colors.goals.muted) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ alignItems: "center", paddingVertical: spacing.md }}
    >
      <Text style={{ ...typography.bodySemiBold, fontSize: 15, color }}>{label}</Text>
    </TouchableOpacity>
  );

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
      }}
    >
      <Ionicons name={icon} size={20} color={colors.ui.primary} />
      <Text style={{ ...typography.bodySemiBold, fontSize: 16, color: colors.text.primary }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderPermissionDenied = () => {
    const canAskAgain = permission?.canAskAgain !== false;
    return (
      <View style={{ flex: 1, paddingBottom: insets.bottom + spacing.md, paddingHorizontal: spacing.md }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md }}>
          <Image
            source={require("../../../assets/mascot/camera.png")}
            style={{ width: 260, height: 260 }}
            resizeMode="contain"
          />
          <Text style={{ ...typography.headline, color: colors.text.primary, textAlign: "center" }}>
            Camera shy?
          </Text>
          <Text style={{ ...textStyles.secondary, textAlign: "center", maxWidth: 260 }}>
            I need the camera to read the barcode. Or type the number instead.
          </Text>
        </View>
        <PrimaryButtonComponent
          title={canAskAgain ? "Alright, take a look" : "Fine, open Settings"}
          onPress={canAskAgain ? handleRequestCamera : () => Linking.openSettings()}
        />
        {renderSecondaryButton("Type the number", "keypad-outline", () => setState({ kind: "typing" }))}
      </View>
    );
  };

  const renderCamera = () => {
    if (!permission || permission.status === "undetermined") {
      return <View style={{ flex: 1, backgroundColor: "#000" }} />;
    }
    if (!permission.granted) return renderPermissionDenied();

    return (
      <View style={{ flex: 1, backgroundColor: "#17151D" }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: [...BARCODE_TYPES] }}
          onBarcodeScanned={state.kind === "camera" ? handleBarcodeScanned : undefined}
        />
        <View pointerEvents="none" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
          <View style={{ flex: 1, backgroundColor: SCAN_DIM }} />
          <View style={{ flexDirection: "row", height: 170 }}>
            <View style={{ width: "9%", backgroundColor: SCAN_DIM }} />
            <View style={{ width: "82%" }}>
              <Corner top left />
              <Corner top />
              <Corner left />
              <Corner />
            </View>
            <View style={{ width: "9%", backgroundColor: SCAN_DIM }} />
          </View>
          <View style={{ flex: 1, backgroundColor: SCAN_DIM, alignItems: "center", paddingTop: spacing.md }}>
            <Text style={{ ...typography.body, fontSize: 15, color: "rgba(255,255,255,0.78)", textAlign: "center" }}>
              Point at the barcode on the package
            </Text>
          </View>
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
            accessibilityLabel="Close barcode scanner"
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
          <View style={{ paddingVertical: spacing.sm, paddingHorizontal: 14, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.14)" }}>
            <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: "#fff" }}>{slot}</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
        <View
          pointerEvents="box-none"
          style={{ position: "absolute", left: 0, right: 0, bottom: insets.bottom + spacing.lg, alignItems: "center", gap: spacing.sm }}
        >
          <Pressable
            onPress={() => setState({ kind: "typing" })}
            style={{
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
            <Ionicons name="keypad-outline" size={18} color="#fff" />
            <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: "#fff" }}>Type the number</Text>
          </Pressable>
          <Pressable onPress={openPhotoScan} style={{ paddingVertical: 10, paddingHorizontal: 18 }}>
            <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: "rgba(255,255,255,0.78)" }}>
              No barcode? Scan the food instead
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderTyping = () => {
    const valid = !!normalizeBarcode(typedBarcode);
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1, paddingHorizontal: spacing.md, paddingBottom: insets.bottom + spacing.md }}>
          <View style={{ alignItems: "center", gap: spacing.xs, marginTop: spacing.sm }}>
            <Text style={{ ...typography.headline, color: colors.text.primary, textAlign: "center" }}>
              Type the barcode
            </Text>
            <Text style={{ ...textStyles.secondary, textAlign: "center", maxWidth: 280 }}>
              The numbers under the lines, usually 8 or 13 digits.
            </Text>
          </View>
          <TextInput
            autoFocus
            value={typedBarcode}
            onChangeText={(t) => setTypedBarcode(t.replace(/\D/g, ""))}
            keyboardType="number-pad"
            placeholder="Barcode number"
            placeholderTextColor={colors.text.secondary}
            maxLength={14}
            accessibilityLabel="Barcode number"
            returnKeyType="search"
            onSubmitEditing={handleSubmitTyped}
            style={{
              marginTop: spacing.lg,
              height: 60,
              borderRadius: 14,
              paddingHorizontal: spacing.md,
              backgroundColor: FIELD_BACKGROUND,
              ...typography.titleMedium,
              fontSize: 22,
              letterSpacing: 2,
              color: colors.text.primary,
              textAlign: "center",
            }}
          />
          <View style={{ flex: 1 }} />
          <View style={{ opacity: valid ? 1 : 0.5 }} pointerEvents={valid ? "auto" : "none"}>
            <PrimaryButtonComponent title="Look it up" onPress={handleSubmitTyped} />
          </View>
          {permission?.granted ? renderTextLink("Use the camera instead", resetToCamera) : null}
        </View>
      </KeyboardAvoidingView>
    );
  };

  const renderLookingUp = (barcode: string) => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.lg, paddingHorizontal: spacing.md }}>
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
        <ActivityIndicator color={colors.goals.eatRing} />
        <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: "#fff" }}>Looking it up…</Text>
      </View>
      <Text style={{ ...textStyles.secondary, textAlign: "center", letterSpacing: 1 }}>{barcode}</Text>
    </View>
  );

  const renderNotFound = (barcode: string, reason: "not_in_database" | "no_nutrition") => (
    <View style={{ flex: 1, paddingHorizontal: spacing.md, paddingBottom: insets.bottom + spacing.md }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md }}>
        <Image
          source={require("../../../assets/mascot/noFood.png")}
          style={{ width: 260, height: 260 }}
          resizeMode="contain"
        />
        <Text style={{ ...typography.headline, color: colors.text.primary, textAlign: "center" }}>
          Haven't seen this one
        </Text>
        <Text style={{ ...textStyles.secondary, textAlign: "center", maxWidth: 280 }}>
          {reason === "no_nutrition"
            ? "I found the product but not its nutrition. Snap the food instead and I'll guess the points."
            : "This barcode isn't in my database yet. Snap the food instead and I'll guess the points."}
        </Text>
        <Text style={{ ...typography.small, fontSize: 13, color: colors.goals.muted, letterSpacing: 1 }}>{barcode}</Text>
      </View>
      <PrimaryButtonComponent title="Scan the food instead" onPress={openPhotoScan} />
      {renderSecondaryButton("Add it manually", "create-outline", openManualEntry)}
      {renderTextLink("Try another barcode", resetToCamera)}
    </View>
  );

  const renderError = (barcode: string, input: Input) => (
    <View style={{ flex: 1, paddingHorizontal: spacing.md, paddingBottom: insets.bottom + spacing.md }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md }}>
        <Ionicons name="cloud-offline-outline" size={56} color={colors.goals.muted} />
        <Text style={{ ...typography.headline, color: colors.text.primary, textAlign: "center" }}>
          Couldn't look it up
        </Text>
        <Text style={{ ...textStyles.secondary, textAlign: "center", maxWidth: 280 }}>
          Check your connection and try again.
        </Text>
      </View>
      <PrimaryButtonComponent title="Try again" onPress={() => void handleLookup(barcode, input)} />
      {renderSecondaryButton("Add it manually", "create-outline", openManualEntry)}
    </View>
  );

  const renderResult = (product: BarcodeProduct) => {
    const options = portionOptions(product);
    const grams = gramsFor(product);
    const { points } = pointsForGrams(product, grams);
    const total = todayProgress?.points?.total ?? 0;
    const used = todayProgress?.points?.used ?? 0;
    const leftAfter = total - used - points;
    const overAfter = leftAfter < 0;
    const cheer = overAfter
      ? "Logged. Honest days count too, and tomorrow starts fresh."
      : points <= 3
        ? "That's a steal. Fits your day nicely."
        : "Looks tasty. Add it when you're ready.";
    const canAdd = grams > 0;

    const chip = (key: PortionKey, label: string, onPress: () => void) => {
      const on = portion === key;
      return (
        <Pressable
          key={key}
          accessibilityRole="radio"
          accessibilityState={{ selected: on }}
          onPress={() => {
            Haptics.selectionAsync();
            onPress();
          }}
          style={{
            paddingHorizontal: 14,
            height: 40,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: on ? colors.ui.white : FIELD_BACKGROUND,
            borderWidth: on ? 1 : 0,
            borderColor: colors.ui.cardBorder,
          }}
        >
          <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: on ? colors.text.primary : colors.goals.muted }}>
            {label}
          </Text>
        </Pressable>
      );
    };

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: spacing.sm, paddingHorizontal: 20, paddingBottom: spacing.lg }}
        >
          <MotiView
            from={{ opacity: 0, translateY: 12, scale: 0.98 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: "timing", duration: 420, reduceMotion: ReduceMotion.Never }}
            style={{ backgroundColor: colors.ui.white, borderRadius: 24, padding: 20, ...globalStyles.shadow, shadowOpacity: 0.06 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              {product.imageUrl ? (
                <Image
                  source={{ uri: product.imageUrl }}
                  style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: FIELD_BACKGROUND }}
                  resizeMode="contain"
                />
              ) : (
                <View style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: FIELD_BACKGROUND, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="barcode-outline" size={28} color={colors.goals.muted} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.cardTitle, fontSize: 17, lineHeight: 22, color: colors.text.primary }} numberOfLines={2}>
                  {product.name}
                </Text>
                {product.brand ? (
                  <Text style={{ ...typography.body, fontSize: 14, color: colors.goals.muted }} numberOfLines={1}>
                    {product.brand}
                  </Text>
                ) : null}
              </View>
            </View>

            <View style={{ marginTop: 20, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
              <View>
                <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
                  <Text style={{ ...typography.displayNumeric, fontSize: 56, lineHeight: 62, color: colors.goals.eat }}>
                    {points}
                  </Text>
                  <Text style={{ ...typography.cardTitle, fontSize: 17, color: colors.goals.eat }}>
                    {points === 1 ? "point" : "points"}
                  </Text>
                </View>
                <Text style={{ ...typography.body, fontSize: 15, color: colors.goals.muted }}>
                  {Math.round(grams)} g
                </Text>
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
              <Image source={require("../../../assets/mascot/logging.png")} resizeMode="contain" style={{ width: 52, height: 52 }} />
              <Text style={{ flex: 1, ...typography.bodySemiBold, fontSize: 15, lineHeight: 21, color: colors.goals.eatSoftText }}>
                {cheer}
              </Text>
            </View>
          </MotiView>

          <View style={{ marginTop: 12, backgroundColor: colors.ui.white, borderRadius: 24, padding: spacing.md, ...globalStyles.shadow, shadowOpacity: 0.04 }}>
            <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: colors.text.primary, marginBottom: 10 }}>
              How much?
            </Text>
            <View accessibilityRole="radiogroup" accessibilityLabel="Portion size" style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {options.map((o) =>
                chip(o.key, o.label, () => {
                  setPortion(o.key);
                  setCustomGrams(String(Math.round(o.grams)));
                }),
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, gap: 10 }}>
              <TextInput
                value={customGrams}
                onChangeText={(t) => {
                  setCustomGrams(t.replace(/[^0-9.,]/g, ""));
                  setPortion("custom");
                }}
                keyboardType="decimal-pad"
                accessibilityLabel="Grams"
                maxLength={5}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  paddingHorizontal: spacing.md,
                  backgroundColor: FIELD_BACKGROUND,
                  ...typography.titleMedium,
                  color: colors.text.primary,
                }}
              />
              <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: colors.goals.muted }}>grams</Text>
            </View>
            <Text style={{ ...typography.small, fontSize: 13, color: colors.goals.muted, marginTop: 10 }}>
              {product.per100.calories} kcal per 100 g · from Open Food Facts
            </Text>
          </View>
        </ScrollView>
        <View style={{ paddingTop: 12, paddingHorizontal: 20, paddingBottom: insets.bottom + spacing.sm }}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!canAdd}
            onPress={() => handleAddToDiet(product)}
            style={{
              height: 58,
              borderRadius: 14,
              backgroundColor: colors.goals.eat,
              opacity: canAdd ? 1 : 0.5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ ...typography.button, fontSize: 18, color: colors.ui.white }}>
              Add to {slot.toLowerCase()}
            </Text>
          </TouchableOpacity>
          {renderTextLink("Scan another barcode", resetToCamera)}
        </View>
      </KeyboardAvoidingView>
    );
  };

  const fullBleedCamera = state.kind === "camera" && !!permission?.granted;

  return (
    <View style={{ flex: 1, backgroundColor: fullBleedCamera ? "#000" : colors.ui.background }}>
      {!fullBleedCamera ? (
        <View style={{ paddingHorizontal: spacing.md }}>
          <GoBackHeaderComponent title="" />
        </View>
      ) : null}
      {state.kind === "camera"
        ? renderCamera()
        : state.kind === "typing"
          ? renderTyping()
          : state.kind === "looking_up"
            ? renderLookingUp(state.barcode)
            : state.kind === "result"
              ? renderResult(state.product)
              : state.kind === "not_found"
                ? renderNotFound(state.barcode, state.reason)
                : renderError(state.barcode, state.input)}
    </View>
  );
};

export default BarcodeScanScreen;
