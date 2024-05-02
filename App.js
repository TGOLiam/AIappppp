import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView } from 'react-native';
import { processImage, OcrApiRequest, AIapiRequest, topic, speakAI, PlayAudio } from './APIprocess'


export default function App() {
  const [AItext, setAItext] = useState("Try askin me smth.......")
  const [AIstatus, setStatus] = useState("status")
  const [userText, setUserText] = useState('')
  const [OCRtext, setOCRData] = useState('')




  const imageprocess = async () => {
    setStatus("Using my eyes...")
    const image = await processImage()
    setStatus("Reading your image...")
    const ocrData = await OcrApiRequest(image)
    setOCRData(ocrData)
    AIprocess(ocrData, topic)
  }

  const AIprocess = async (data, input) => {
    setAItext("Hmmm....")
    setStatus("Using my brain...")
    const AI = await AIapiRequest(data, input)
    const AIspeak = await speakAI(AI)
    const audio = await PlayAudio(AIspeak)
    setStatus("Im done...")
    console.log("AI Response: ", AI)
    setAItext(AI)
  }







  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>

      <Text style={{ paddingBottom: 100 }}>{AItext}</Text>


      <Button title="Pick an image from camera roll" onPress={imageprocess} />
      <Button title="Send" onPress={() => {
        if (userText.trim() !== '') {
          AIprocess(OCRtext, userText);
        }
      }} />
      <Text>{AIstatus}</Text>

      <TextInput placeholder="Try saying summarize for me" style={styles.input} value={userText} onChangeText={setUserText}></TextInput>

    </KeyboardAvoidingView>





  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    justifyContent: "center",
  },

  input:{
    borderColor: 'black',
    borderWidth: 1,
    width: '80%',
    borderRadius: 7,
    height: 40,
    
  }










});
