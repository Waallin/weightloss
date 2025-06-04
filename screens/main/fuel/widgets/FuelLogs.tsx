import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "../../../../constants/globalStyles";
import { spacing } from "../../../../constants/spacing";
import { colors } from "../../../../constants/colors";
import { FuelLogType } from "../types";
import LogItem from "../components/LogItem";

const FuelLogs = ({ logs }: { logs: FuelLogType[] }) => {
  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        ...globalStyles.cardShadow,
      }}
    >
      <View>
        <Text style={{ ...globalStyles.smallTitle }}>Logs</Text>
      </View>
      <View>
        {logs.map((log) => (
          <LogItem key={log.date} log={log} />
        ))}
      </View>
    </View>
  );
};

export default FuelLogs;

const styles = StyleSheet.create({});
