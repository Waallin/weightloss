import { calculatePoints } from "../services/dietPoints";
import useTodayProgressStore from "../stores/useTodayProgressStore";
import useUserStore from "../stores/useUserStore";

// Debug-only launch argument: `-scanImage <path>`. AppDelegate.swift (#if DEBUG)
// passes it to the root component as the `scanImage` prop.
// __DEV__ is false in release builds, so this always returns null there.
export function getDebugScanImage(props: { scanImage?: unknown }): string | null {
  if (!__DEV__) return null;
  const path = props?.scanImage;
  return typeof path === "string" && path.length > 0 ? path : null;
}

// Debug-only mock profile so the daily budget ("left today") looks real.
// The budget itself comes from the app's real calculatePoints.
export function seedDebugProfile(steps = 0) {
  const user = {
    gender: "Male",
    height: 180,
    startWeight: 90,
    currentWeight: 90,
    birthYear: new Date().getFullYear() - 35,
  };
  const points = calculatePoints(
    user.currentWeight,
    user.height,
    new Date().getFullYear() - user.birthYear,
    user.gender,
    steps,
  );
  useUserStore.setState({ user });
  useTodayProgressStore.setState({
    todayProgress: {
      progress: { water: 0, steps },
      points: { ...points, used: 0 },
      completion: { water: false, steps: false, points: false },
    },
  });
}

// Debug-only: `-debugSteps <n>` opens the dashboard with n mocked steps.
let debugSteps: number | null = null;

export function getDebugSteps(props: { debugSteps?: unknown }): number | null {
  if (!__DEV__) return null;
  const n = Number(props?.debugSteps);
  debugSteps = Number.isFinite(n) && props?.debugSteps != null ? n : null;
  return debugSteps;
}

export function getDebugStepsOverride(): number | null {
  return __DEV__ ? debugSteps : null;
}
