import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  FlatList,
  type FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { textSizes, textStyles } from "../constants/texts";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export type WheelPickerProps<T> = {
  data: readonly T[];
  value: T;
  onChange: (item: T) => void;
  getLabel: (item: T) => string;
  getKey?: (item: T) => string | number;
  height?: number;
  itemHeight?: number;
};

function WheelPickerInner<T>({
  data,
  value,
  onChange,
  getLabel,
  getKey = getLabel,
  height = 260,
  itemHeight = 52,
}: WheelPickerProps<T>) {
  const AnimatedFlatList = useMemo(
    () =>
      Animated.createAnimatedComponent(FlatList) as unknown as React.ComponentType<FlatListProps<T>>,
    []
  );

  const selectedIndex = useMemo(() => {
    const key = getKey(value);
    const idx = data.findIndex((item) => getKey(item) === key);
    return idx >= 0 ? idx : 0;
  }, [data, value, getKey]);

  const paddingVertical = (height - itemHeight) / 2;

  const scrollY = useRef(new Animated.Value(selectedIndex * itemHeight)).current;
  const lastHapticIndexRef = useRef<number>(selectedIndex);
  const lastHapticAtMsRef = useRef<number>(0);

  useEffect(() => {
    lastHapticIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const rawIndex = offsetY / itemHeight;
      const idx = clamp(Math.round(rawIndex), 0, data.length - 1);
      const next = data[idx];
      if (getKey(next) !== getKey(value)) onChange(next);
    },
    [data, getKey, itemHeight, onChange, value]
  );

  const handleScrollToIndexFailed = useCallback(() => {}, []);

  const handleScrollHaptics = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const rawIndex = offsetY / itemHeight;
      const idx = clamp(Math.round(rawIndex), 0, data.length - 1);

      if (idx === lastHapticIndexRef.current) return;

      const now = Date.now();
      if (now - lastHapticAtMsRef.current < 50) return;

      lastHapticIndexRef.current = idx;
      lastHapticAtMsRef.current = now;
      void Haptics.selectionAsync();
    },
    [data.length, itemHeight]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      const inputRange = [
        (index - 2) * itemHeight,
        (index - 1) * itemHeight,
        index * itemHeight,
        (index + 1) * itemHeight,
        (index + 2) * itemHeight,
      ];

      const opacity = scrollY.interpolate({
        inputRange,
        outputRange: [0.25, 0.55, 1, 0.55, 0.25],
        extrapolate: "clamp",
      });

      const scale = scrollY.interpolate({
        inputRange,
        outputRange: [0.92, 0.96, 1, 0.96, 0.92],
        extrapolate: "clamp",
      });

      const color = scrollY.interpolate({
        inputRange,
        outputRange: [
          colors.text.secondary,
          colors.text.secondary,
          colors.ui.primary,
          colors.text.secondary,
          colors.text.secondary,
        ],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={{
            height: itemHeight,
            alignItems: "center",
            justifyContent: "center",
            opacity,
            transform: [{ scale }],
          }}
        >
          <Animated.Text
            style={{
              ...textStyles.primary,
              fontSize: textSizes.xxl + 6,
              fontWeight: "bold",
              color: color as unknown as string,
            }}
          >
            {getLabel(item)}
          </Animated.Text>
        </Animated.View>
      );
    },
    [itemHeight, scrollY]
  );

  const keyExtractor = useCallback((item: T) => String(getKey(item)), [getKey]);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight]
  );

  return (
    <View
      style={{
        height,
        width: "100%",
        borderRadius: spacing.borderRadius,
        backgroundColor: colors.ui.background,
        overflow: "hidden",
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: paddingVertical,
          left: spacing.md,
          right: spacing.md,
          height: itemHeight,
          borderRadius: spacing.borderRadius,
          backgroundColor: colors.ui.secondaryBackground,
        }}
      />

      <AnimatedFlatList
        data={data}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        bounces={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumEnd}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        contentContainerStyle={{
          paddingVertical,
        }}
        getItemLayout={getItemLayout}
        initialScrollIndex={selectedIndex}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
          listener: handleScrollHaptics,
        })}
        renderItem={renderItem}
      />
    </View>
  );
}

const WheelPicker = WheelPickerInner as <T>(props: WheelPickerProps<T>) => React.ReactElement;

export default WheelPicker;
