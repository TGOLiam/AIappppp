

import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

let OCRData
let gatcha = 'hello'
let topic = "The image is about what? ONLY ONE SENTENCE"
let soundObject

export { topic, soundObject }

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
  if (data === undefined) {
    data = ''
  }
  console.log("Processing AI")
  const url = 'https://models3.p.rapidapi.com/?model_id=5&prompt=Write%20prompt%20in%20body%20not%20here!';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'e3dd378c36mshfa7bf0801eb3953p1b55a4jsn5fa4ac659c4f',
      'X-RapidAPI-Host': 'models3.p.rapidapi.com'
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'assistant',
          content: `Your name is Gatcha, the mini AI tutor,  your purpose is to tutor and answer students' queries in their general studies .Say "Gatcha!" as a catchline when you answer a query. CONTEXT: ${data}`
        },
        {
          role: 'user',
          content: question
        }
      ]
    }),
    
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const AItext = result.content
    console.log(AItext);
    return AItext
  } catch (error) {
    console.log(error);
    
  }
}






export const speakAI = async (text) => {
  console.log("Proccessing speech to text")
  const replacedText = text.replace(/\s+/g, ' ');

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
      text: `<speak><p>${replacedText}</p></speak>`,
      voice: {
        value: 'en-GB_Emma',
        lang: 'en-US'
      },
      audioOutput: {
        fileFormat: 'mp3',
        sampleRate: 24000
      }
    }),
    
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (response.ok) {
      console.log("Audio Done: ", result.url);
    }
    return result.url
  } catch (error) {
    console.log(error);
    
  }
}

export const PlayAudio = async (input, audio) => {
  console.log(audio)
  try {
    soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri: audio });
    if (input == "play") {

      await soundObject.playAsync();
    }




  } catch (error) {
    console.log('Error playing audio:', error);
  }
};

export const controlAudio = async (input, audio) => {
  const soundObject = new Audio.Sound();
  await soundObject.loadAsync({ uri: audio });
  try {
    if (input == "stop") {
      await soundObject.stopAsync();
    }

    if (input == "resume") {
      await soundObject.playAsync();
    }
  }
  catch (error) {
    console.log('Error playing audio:', error);
  }

}


