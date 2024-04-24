import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ServerTest from './script';
import ImagePickerScript from './imagepicker';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      
      <ImagePickerScript />
      
    </View>  
    

    


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },













});
