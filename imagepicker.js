import { useState } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';



export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  
  const pickImage = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      
      quality: 1,
    });
    const file = result.assets[0].uri
    
    fetchData(file)
    console.log(result.assets[0].uri)
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const [responseData, setResponseData] = useState(null);

  const fetchData = async (file) => {
    try {
      const url = 'http://192.168.1.4:3000/send-image';

      const fileName = file.split('/').pop();

      // Determine file type based on file extension
      const fileType = `image/${fileName.split('.').pop()}`;

      const formData = new FormData();

      // Append the file to the FormData object
      formData.append('image', {
        uri: file,
        name: fileName,
        type: fileType,
      });

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log(responseData);
      setResponseData(responseData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };



  
  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  
});
