import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import ServerTest from './script';
import {processImage, OcrApiRequest, AIapiRequest, topic } from './imagepicker'
import { test } from './test'

export default function App() {
  const [AItext, setAItext] = useState("Try askin me smth.......")
  const [AIstatus, setStatus] = useState("status")
  let [userText, setUserText] = useState('')
  const [OCRtext, setOCRData] = useState('')

  
  

  const imageprocess = async () => {
    setStatus("Using my eyes...")
    const image = await processImage()
    setStatus("Reading your image...")
    const ocrData = await OcrApiRequest(image)
    setOCRData(ocrData)
    setStatus("Using my brain...")
    const AI = await AIapiRequest(ocrData, topic)
    setStatus("Im done...")
    console.log("AI Response: ", AI)
    setAItext(AI)
  }

  const textprocess = async (data, input) => {
    console.log(data)
    console.log(input)
    
    
    if (userText !== "") {
      setAItext("Hmmmm.....")
      setStatus("Using my brain...")
      const AI = await AIapiRequest(data, input)
      setAItext(AI)
      setStatus("Im done...")
    }
  }






  return (
    <View style={styles.container}>

      <Text style={{ paddingBottom: 100 }}>{AItext}</Text>
      <TextInput placeholder="Try saying summarize for me" style={{ paddingBottom: 100 }} value={userText} onChangeText={setUserText} onEndEditing={() => textprocess(OCRtext, userText)}></TextInput>
      <Button title="Pick an image from camera roll" onPress={imageprocess} />
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
