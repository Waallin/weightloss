import {
  PermissionStatus,
  useHealthKitStatistics,
  usePermissions,
} from "apple-health/hooks";
import { getDebugStepsOverride } from "../utils/debugScanImage";

export { PermissionStatus };

export const useHealthKitPermissions = () => {
  const [status, requestPermission] = usePermissions({
    read: ["stepCount"],
  });
  return { status, requestPermission };
};

export const useTodaySteps = () => {
  const { data } = useHealthKitStatistics({
    type: "stepCount",
    aggregations: ["cumulativeSum"],
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date()
  });

  const debugSteps = getDebugStepsOverride();
  if (debugSteps != null) return debugSteps;

  if (data == null || Array.isArray(data)) {
    return 0;
  }

  return data.sumQuantity ?? 0;
};