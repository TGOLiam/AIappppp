import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { processImage, OcrApiRequest, AIapiRequest, topic, speakAI, PlayAudio } from './APIprocess'
import { TestAI } from './test'

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
    <View style={styles.container}>

      <Text style={{ paddingBottom: 100 }}>{AItext}</Text>

      <TextInput placeholder="Try saying summarize for me" style={{ paddingBottom: 100 }} value={userText} onChangeText={setUserText}></TextInput>

      <Button title="Pick an image from camera roll" onPress={imageprocess} />
      <Button title="Send" onPress={() => {
        if (userText.trim() !== '') {
          AIprocess(OCRtext, userText);
        }
      }} />
      <Text>{AIstatus}</Text>


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
