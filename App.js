import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ServerTest from './script';
import ImagePickerExample from './imagepicker';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <ServerTest />
      <ImagePickerExample />
      
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
