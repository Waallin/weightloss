import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const HEALTH_CONNECT_REQUESTED_KEY = "health_connect_requested";

/**
 * HealthKit hides read-permission status, so "connected" means
 * steps were read today or the user has gone through the connect prompt.
 */
const useHealthConnected = (steps: number) => {
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(HEALTH_CONNECT_REQUESTED_KEY).then((value) => {
      if (value === "true") setRequested(true);
    });
  }, []);

  const markRequested = useCallback(async () => {
    setRequested(true);
    await AsyncStorage.setItem(HEALTH_CONNECT_REQUESTED_KEY, "true");
  }, []);

  return { connected: steps > 0 || requested, markRequested };
};

export default useHealthConnected;
