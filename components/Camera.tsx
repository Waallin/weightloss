import React, { useRef } from "react";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { StyleSheet, View } from "react-native";

interface CameraViewProps {
  onPhotoTaken: (path: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onPhotoTaken }) => {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CameraView;
