import React, { useEffect, useState } from 'react';
import { Animated, Image, View, Button } from 'react-native';

const AnimatedImage = ({ source, style }) => {
  const opacity = new Animated.Value(1); // Initial opacity

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1, // Animate to 1 (fully opaque)
      duration: 300, // Transition duration (milliseconds)
      useNativeDriver: true, // Optimize for performance
    }).start();
  }, [source]); // Animate on source change

  return (
    <Animated.Image source={source} style={[style, { opacity }]} />
  );
};



export default AnimatedImage;
