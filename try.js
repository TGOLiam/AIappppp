import React from 'react';
import { View } from 'react-native';
import ImageSequence from 'react-native-image-sequence-2';

const ImageSequenceComponent = () => {
  const images = [];

  for (let i = 1; i <= 180; i++) {
    images.push(require(`./assets/images/${i}.png`));
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageSequence
        images={images}
        startFrameIndex={0}
        framesPerSecond={24}
        loop={true}
      />
    </View>
  );
};

export default ImageSequenceComponent;
