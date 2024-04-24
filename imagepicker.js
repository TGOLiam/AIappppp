
import { useState } from 'react';
import { Button, Image, View, StyleSheet, Text, TextInput} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createClient, CallbackUrl } from "@deepgram/sdk";
import { manipulateAsync } from 'expo-image-manipulator';



export default function ImagePickerScript() {
  const [image, setImage] = useState(null);
  const [AItext, setAItext] = useState("Try sayin...........")  
  const [AIstatus, setStatus] = useState("status")
  let [userText, setUserText] = useState("")

  const pickImage = async () => {
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
      if (response.json){
        setStatus("Picture scanned...")
      }
      console.log(data.ParsedResults[0].ParsedText); // Handle the response data here
      let OCRdata = data.ParsedResults[0].ParsedText
      AIcaptionRequest(OCRdata)
    } catch (error) {
      console.error('Error occurred during OCR API request:', error);
      // Handle the error appropriately
    }
  } 


  async function AIcaptionRequest(OCRdata) {
    setStatus("Reading your topic...")
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'b828fd60d2mshcc2ef1ee9111f4cp12916djsna471524b857a',
        'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
      },
      body: JSON.stringify({
        "question": "A very short sentence that describes the topic. Start your sentence with The topic is about.",
        "context": OCRdata
      })
    };

    try {
      const response = await fetch('https://open-ai21.p.rapidapi.com/qa', options);
      let AIresponse = await response.json();
      if (response.json){
        setStatus("Finished reading...")
      }
      console.log("AI: ", AIresponse);
      setAItext(`Gatchaa! ${AIresponse.result} How can i help you?`)
    } catch (error) {
      console.log(error);
      // If an error occurs, reject the promise
      throw error;
    }
  }


  async function AIapiRequest() {
    setStatus("Reading your topic...")
    
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'b828fd60d2mshcc2ef1ee9111f4cp12916djsna471524b857a',
        'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
      },
      body: JSON.stringify({
        "question": userText,
        "context": OCRdata
      })
    };

    try {
      const response = await fetch('https://open-ai21.p.rapidapi.com/qa', options);
      let AIresponse = await response.json();
      if (response.json){
        setStatus("Finished reading...")
      }
      console.log("AI: ", AIresponse);
      setAItext(`Gatchaa! ${AIresponse.result}`)
    } catch (error) {
      console.log(error);
      // If an error occurs, reject the promise
      throw error;
    }
  }










  return (
    <View style={styles.container} >
      <Text style = {{paddingBottom: 100}}>{AItext}</Text>
      <TextInput placeholder = "Try saying summarize for me" style ={{paddingBottom: 100}} onChangeText={text => setUserText(text)} onEndEditing={() => AIapiRequest()}></TextInput>
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
