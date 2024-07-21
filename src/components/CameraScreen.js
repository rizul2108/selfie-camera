import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';
import { useFrameProcessor } from 'react-native-vision-camera';
import { faceDetector } from 'vision-camera-face-detector';
import { Canvas, Paint, Rect } from '@shopify/react-native-skia';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CameraScreen = ({ navigation }) => {
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.front;
  const [faces, setFaces] = useState([]);
  const camera = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      if (cameraPermission !== 'authorized') {
        console.error('Camera permission denied');
      }
    })();
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const detectedFaces = faceDetector(frame);
    runOnJS(setFaces)(detectedFaces);
  }, []);

  const takePhoto = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      const storedPhotos = await AsyncStorage.getItem('photos');
      const photos = storedPhotos ? JSON.parse(storedPhotos) : [];
      photos.push(photo);
      await AsyncStorage.setItem('photos', JSON.stringify(photos));
    }
  };

  return (
    <View style={styles.container}>
      {device && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={1}
        />
      )}
      <Canvas style={StyleSheet.absoluteFill}>
        {faces.map((face, index) => (
          <Paint key={index}>
            <Rect
              x={face.bounds.origin.x}
              y={face.bounds.origin.y}
              width={face.bounds.size.width}
              height={face.bounds.size.height}
              color="red"
            />
          </Paint>
        ))}
      </Canvas>
      <Button title="Capture" onPress={takePhoto} />
      <Button title="Feed" onPress={() => navigation.navigate('Feed')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CameraScreen;
