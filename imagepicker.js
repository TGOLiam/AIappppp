
import { useState } from 'react';
import { Button, Image, View, StyleSheet, Text, TextInput} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createClient, CallbackUrl } from "@deepgram/sdk";
import { manipulateAsync } from 'expo-image-manipulator';



export default function ImagePickerScript() {
  const [image, setImage] = useState(null);
  const [AItext, setAItext] = useState("Try askin me smth.......")  
  const [AIstatus, setStatus] = useState("status")
  const [userText, setUserText] = useState('')
  const [OCRData, setOCRData] = useState('')

  const topic = "Start your sentence with The topic is about."
  

  const pickImage = async () => {
    setOCRData('')
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      quality: 0.5,
    });
    const file = result.assets[0].base64
    console.log('')
    OcrApiRequest(file)
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };




  async function OcrApiRequest(file) {
    try {
      setStatus("Scanning picture...")
      const completeBase64 = `data:image/jpg;base64,${file}`;
      const apiKey = 'K89035530388957';
      const endpoint = 'https://api.ocr.space/parse/image';
      
      const formData = new FormData();
      formData.append('base64Image', completeBase64);
      formData.append('apikey', apiKey);
  
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      if (response.ok){
        setStatus("Picture scanned...")
      }
      const res = data.ParsedResults[0].ParsedText
      const res2 = res.replace(/\s/g, "");
      console.log(res2); 
      
      setOCRData(res2)
      
      AIapiRequest(topic)
    } catch (error) {
      console.error('Error occurred during OCR API request:', error);
      // Handle the error appropriately
    }
  } 


  async function AIapiRequest(question) {
    console.log(question)
    console.log(OCRData)
    setStatus("Reading your topic...")
    setAItext('Using my brain...')
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '36bd46ce1dmshb13c8e862387c12p1ad17ejsn232fc5a04130',
        'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
      },
      body: JSON.stringify({
        "question": question,
        "context": OCRData
      })
    };

    try {
      const response = await fetch('https://open-ai21.p.rapidapi.com/qa', options);
      const AIresponse = await response.json();
      // Check if response is successful
      if (response.ok) {
        setStatus("Finished reading...")
        console.log("AI: ", AIresponse);
        setAItext(`Gatchaa! ${AIresponse.result} How can I help you?`)
      } else {
        // If response is not successful, throw an error
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.log(error);
      // If an error occurs, reject the promise
      throw error;
    }
}














  return (
    <View style={styles.container} >
      <Text style = {{paddingBottom: 100}}>{AItext}</Text>
      <TextInput placeholder = "Try saying summarize for me" style ={{paddingBottom: 100}} value = {userText} onChangeText={setUserText} onEndEditing={ () => AIapiRequest(userText,OCRData)}></TextInput>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Text>{AIstatus}</Text>
    </View >
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

});
