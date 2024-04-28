

import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

let OCRData
let gatcha = 'hello'
let topic = "Start your sentence with The topic is about. ONLY ONE SENTENCE"

export { topic }

export const processImage = async () => {
  await ImagePicker.requestCameraPermissionsAsync();
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    base64: true,
    quality: 0.5,
  });
  const file = result.assets[0].base64
  console.log(result.assets[0].uri)
  if (!result.canceled) {
    console.log("image processing")
  }
  return file
}



export async function OcrApiRequest(file) {
  try {
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
    if (response.ok) {
      OCRData = data.ParsedResults[0].ParsedText
    }
    console.log(OCRData)
    return OCRData
  } catch (error) {
    console.error('Error occurred during OCR API request:', error);
    // Handle the error appropriately
  }
}


export const AIapiRequest = async (data, question) => {
  

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
          content: `CONTEXT:${data}, QUESTION:${question} (BE DIRECT,READ CONTEXT BEFORE ANSWERING, CHECK SPELLING)`
        }
      ],
      web_access: false
    })
  };

  try {
    const response = await fetch('https://open-ai21.p.rapidapi.com/conversationllama', options);
    const AIresponse = await response.json();
    // Check if response is successful
    if (response.ok) {

      gatcha = `Gatchaa! ${AIresponse.result} How can I help you?`
      console.log("AI: ", AIresponse);
      return gatcha
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






export const speakAI = async (text) =>{
  const url = 'https://natural-text-to-speech-converter-at-lowest-price.p.rapidapi.com/backend/ttsNewDemo';
  const options = {
      method: 'POST',
      headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'e3dd378c36mshfa7bf0801eb3953p1b55a4jsn5fa4ac659c4f',
          'X-RapidAPI-Host': 'natural-text-to-speech-converter-at-lowest-price.p.rapidapi.com'
      },
      body: JSON.stringify({
          ttsService: 'polly',
          audioKey: 'ff63037e-6994-4c50-9861-3e162ee56468',
          storageService: 's3',
          text: `<speak><p>${text}</p></speak>`,
          voice: {
              value: 'en-GB_Emma',
              lang: 'en-US'
          },
          audioOutput: {
              fileFormat: 'mp3',
              sampleRate: 24000
          }
      })
  };

  try {
      const response = await fetch(url, options);
      const result = await response.json();
      if (response.ok){
        console.log("Audio Done: ",result.url);
      }
      return result.url
  } catch (error) {
      console.error(error);
  }
}

export const PlayAudio = async (audio) => {
  try {
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri: audio });
    await soundObject.playAsync();
  } catch (error) {
    console.log('Error playing audio:', error);
  }
};

