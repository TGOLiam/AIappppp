
import { useState } from 'react';
import { Button, Image, View, StyleSheet, Text, TextInput} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createClient, CallbackUrl } from "@deepgram/sdk";
import { manipulateAsync } from 'expo-image-manipulator';
import { Audio } from 'expo-av';



export default function ImagePickerScript() {
  const [image, setImage] = useState(null);
  const [AItext, setAItext] = useState("Try askin me smth.......")  
  const [AIstatus, setStatus] = useState("status")
  const [userText, setUserText] = useState('')
  const [OCRtext, setOCRData] = useState(OCRData)
  let OCRData


  let topic = "Start your sentence with The topic is about. ONLY ONE SENTENCE"
  

  const pickImage = async () => {
    
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      quality: 0.5,
    });
    const file = result.assets[0].base64
    console.log(result.assets[0].uri)
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
        OCRData = data.ParsedResults[0].ParsedText
        setOCRData(OCRData)
      }
    
      AIapiRequest(topic,OCRData)
    } catch (error) {
      console.error('Error occurred during OCR API request:', error);
      // Handle the error appropriately
    }
  } 


  async function AIapiRequest(question,OCRData) {
    console.log(question)
    console.log(OCRData)
    setStatus("Reading your topic...")
    setAItext('Using my brain...')
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'e3dd378c36mshfa7bf0801eb3953p1b55a4jsn5fa4ac659c4f',
        'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `CONTEXT:${OCRData}, QUESTION:${question} (BE DIRECT,READ CONTEXT BEFORE ANSWERING)`
          }
        ],
        web_access: false
      })
    };

    try {
      const response = await fetch('https://open-ai21.p.rapidapi.com/chatgpt', options);
      const AIresponse = await response.json();
      // Check if response is successful
      if (response.ok) {
        setStatus("Finished reading...")
        const gatcha = `Gatchaa! ${AIresponse.result} How can I help you?`
        console.log("AI: ", AIresponse);

        setAItext(gatcha)
        speakAI(gatcha)
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

async function speakAI(text) {
  const url = 'https://joj-text-to-speech.p.rapidapi.com/';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '36bd46ce1dmshb13c8e862387c12p1ad17ejsn232fc5a04130',
      'X-RapidAPI-Host': 'joj-text-to-speech.p.rapidapi.com'
    },
    body: JSON.stringify({
      input: { text: text },
      voice: {
        languageCode: 'en-GB',
        name: 'en-GB-Standard-A',
        ssmlGender: 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3'
      }
    })
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (response.ok){
      console.log("Audio Done")
    }
    PlayAudio(result.audioContent)
  } catch (error) {
    console.error(error);
  }
}

const PlayAudio = async (audio) => {
  try {
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri: `data:audio/mp3;base64,${audio}` });
    await soundObject.playAsync();
  } catch (error) {
    console.log('Error playing audio:', error);
  }
};













/*
const playAudio = async (base64Audio) => {
  const decodedAudio = await new Sound(base64Audio, "", (error) => {
    if (error) {
      console.error('failed to decode audio:', error);
    } else {
      decodedAudio.play();
    }
  });
};
*/









  return (
    <View style={styles.container} >
      <Text style = {{paddingBottom: 100}}>{AItext}</Text>
      <TextInput placeholder = "Try saying summarize for me" style ={{paddingBottom: 100}} value = {userText} onChangeText={setUserText} onEndEditing={ () => AIapiRequest(userText,OCRtext)}></TextInput>
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
