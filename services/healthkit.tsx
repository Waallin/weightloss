import {
  PermissionStatus,
  useHealthKitStatistics,
  usePermissions,
} from "apple-health/hooks";

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
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  });

  if (data == null || Array.isArray(data)) {
    return 0;
  }

  return data.sumQuantity ?? 0;
};