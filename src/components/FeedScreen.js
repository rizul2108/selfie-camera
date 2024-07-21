import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GestureRecognizer, {
  swipeDirections,
} from 'react-native-swipe-gestures';

const { width, height } = Dimensions.get('window');

const FeedScreen = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const storedPhotos = await AsyncStorage.getItem('photos');
      if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
      }
    })();
  }, []);

  const onSwipeLeft = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      {photos.length > 0 && (
        <GestureRecognizer
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
          config={{
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80,
          }}
          style={styles.photoContainer}
        >
          <Image
            source={{ uri: photos[currentIndex].uri }}
            style={styles.photo}
          />
        </GestureRecognizer>
      )}
      <Button
        title="Go to Camera"
        onPress={() => navigation.navigate('Camera')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default FeedScreen;
