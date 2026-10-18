import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
import * as haptics from "expo-haptics";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/texts";
import { useHealthKitPermissions } from "../services/healthkit";

const BULLETS = [
  "Reads your steps only, nothing else",
  "Includes today's steps, so you won't start from zero",
  "Turn it off any time in Settings",
];

interface ConnectHealthSheetProps {
  visible: boolean;
  onClose: () => void;
  onConnected: () => void;
}

const ConnectHealthSheet: React.FC<ConnectHealthSheetProps> = ({
  visible,
  onClose,
  onConnected,
}) => {
  const insets = useSafeAreaInsets();
  const { requestPermission } = useHealthKitPermissions();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    setConnecting(true);
    try {
      await requestPermission();
    } catch (error) {
      console.log("Error requesting HealthKit permission:", error);
    } finally {
      setConnecting(false);
    }
    onConnected();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={connecting ? undefined : onClose}
        style={{ flex: 1, backgroundColor: "rgba(20,16,40,0.45)" }}
      />
      <View
        style={{
          backgroundColor: colors.ui.white,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: spacing.sm + 4,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + spacing.md,
        }}
      >
        <View
          style={{
            width: 40,
            height: 5,
            borderRadius: 3,
            backgroundColor: "#DDDDE2",
            alignSelf: "center",
          }}
        />
        <View
          style={{
            marginTop: spacing.md + 4,
            width: 64,
            height: 64,
            borderRadius: 24,
            backgroundColor: colors.goals.moveSoft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="shoe-print" size={34} color={colors.goals.move} />
        </View>
        <Text
          style={{
            ...typography.headline,
            fontSize: 26,
            lineHeight: 32,
            color: colors.text.primary,
            marginTop: spacing.md,
          }}
        >
          Count your steps automatically
        </Text>
        <Text
          style={{
            ...typography.body,
            fontSize: 15,
            lineHeight: 22,
            color: colors.goals.muted,
            marginTop: spacing.xs + 2,
          }}
        >
          Move daily works on its own once it's on. Your phone already counts
          steps; Kudoo just reads them.
        </Text>
        <View style={{ marginTop: spacing.md + 2, gap: spacing.sm + 4 }}>
          {BULLETS.map((text) => (
            <View
              key={text}
              style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm + 4 }}
            >
              <Ionicons name="checkmark" size={20} color={colors.goals.move} />
              <Text
                style={{
                  ...typography.body,
                  fontSize: 15,
                  color: colors.text.primary,
                  flex: 1,
                }}
              >
                {text}
              </Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={connecting}
          onPress={handleConnect}
          style={{
            marginTop: spacing.lg,
            height: 56,
            borderRadius: 14,
            backgroundColor: colors.goals.move,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {connecting ? (
            <ActivityIndicator color={colors.ui.white} />
          ) : (
            <Text style={{ ...typography.button, fontSize: 18, color: colors.ui.white }}>
              Connect Apple Health
            </Text>
          )}
        </TouchableOpacity>
        <Text
          style={{
            ...typography.small,
            fontSize: 13,
            color: colors.goals.muted,
            textAlign: "center",
            marginTop: spacing.sm,
          }}
        >
          Next, iOS asks you to allow Steps.
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={connecting}
          onPress={onClose}
          style={{ height: 44, alignItems: "center", justifyContent: "center", marginTop: spacing.xs }}
        >
          <Text style={{ ...typography.cardTitle, color: colors.goals.muted }}>
            Not now
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ConnectHealthSheet;
