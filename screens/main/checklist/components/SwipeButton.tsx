import {
  StyleSheet,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  View,
} from "react-native";
import React, { useRef, useState } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.5; // Användaren måste dra 50% av skärmens bredd

const SwipeButton = ({
  onPress,
  checklist,
  allItemsCompleted,
}: {
  onPress: () => void;
  checklist: any;
  allItemsCompleted: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const readyToSwipe = !checklist.is_completed && allItemsCompleted;
  const text = checklist.is_completed
    ? "Completed ✓"
    : readyToSwipe
    ? "Swipe to complete"
    : "Complete all tasks first";

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging(true);
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      setIsDragging(false);
      if (gestureState.dx > SWIPE_THRESHOLD) {
        onPress();
        Animated.spring(pan, {
          toValue: { x: SCREEN_WIDTH, y: 0 },
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Text style={styles.backgroundText}>{text}</Text>
      </View>

      {readyToSwipe && (
        <Animated.View
          style={[
            styles.button,
            {
              transform: [{ translateX: pan.x }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.buttonText}>→</Text>
        </Animated.View>
      )}
    </View>
  );
};

export default SwipeButton;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "100%",
    position: "relative",
  },
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundText: {
    color: "#999",
  },
  button: {
    position: "absolute",
    left: 0,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
});
